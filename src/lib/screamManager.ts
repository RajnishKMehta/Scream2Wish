import { AudioModule, RecordingPresets, setAudioModeAsync } from 'expo-audio';
import type { AudioRecorder } from 'expo-audio';

export type ScreamCallbacks = {
  onAmplitude: (level: number) => void;
  onProgressChange: (progress: number) => void;
  onScreamStart: () => void;
  onScreamStop: () => void;
  onComplete: () => void;
  onReset?: () => void;
};

// ─── Timing config ──
const MIN_COMPLETION_SECS = 30; // loudest scream finishes in this many seconds
const MAX_COMPLETION_SECS = 50; // quietest qualifying scream finishes in this many seconds

const DB_SILENCE = -48;
const DB_MAX = -3;

// 0.5 ≈ -25 dBFS
const SCREAM_FLOOR = 0.5;

const BASE_RATE = 100 / MAX_COMPLETION_SECS;
const MAX_RATE  = 100 / MIN_COMPLETION_SECS;
const POLL_MS   = 100;
const RESET_SILENCE_MS = 900;

let recorder: AudioRecorder | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let progressVal = 0;
let silenceMs = 0;
let screaming = false;
let completed = false;
let didResetInSilence = false;
let cbs: ScreamCallbacks | null = null;
let lastTickTime = 0;

function normalize(db: number): number {
  if (db <= DB_SILENCE) return 0;
  return (Math.min(DB_MAX, db) - DB_SILENCE) / (DB_MAX - DB_SILENCE);
}

function tick(): void {
  if (!recorder || !cbs) return;

  const status = recorder.getStatus();
  if (!status.isRecording) return;

  const now = Date.now();
  const delta = lastTickTime === 0 ? POLL_MS : Math.min(now - lastTickTime, 300);
  lastTickTime = now;

  const rawLevel = normalize(status.metering ?? -160);
  cbs.onAmplitude(rawLevel);

  if (rawLevel < SCREAM_FLOOR) {
    silenceMs += delta;

    if (screaming) {
      screaming = false;
      cbs.onScreamStop();
    }

    if (!completed && silenceMs >= RESET_SILENCE_MS && !didResetInSilence) {
      didResetInSilence = true;
      progressVal = 0;
      cbs.onProgressChange(0);
      cbs.onReset?.();
    }
  } else {
    silenceMs = 0;
    didResetInSilence = false;

    if (!screaming) {
      screaming = true;
      cbs.onScreamStart();
    }

    if (!completed) {
      const effective = (rawLevel - SCREAM_FLOOR) / (1 - SCREAM_FLOOR);
      const rate = BASE_RATE + (MAX_RATE - BASE_RATE) * effective;
      progressVal = Math.min(100, progressVal + rate * (delta / 1000));
      cbs.onProgressChange(progressVal);

      if (progressVal >= 100) {
        completed = true;
        cbs.onComplete();
      }
    }
  }
}

export async function startScreamDetection(callbacks: ScreamCallbacks): Promise<void> {
  cbs = callbacks;
  progressVal = 0;
  silenceMs = 0;
  screaming = false;
  completed = false;
  didResetInSilence = false;
  lastTickTime = 0;

  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
    interruptionMode: 'duckOthers',
    shouldPlayInBackground: false,
    shouldRouteThroughEarpiece: false,
  });

  recorder = new AudioModule.AudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  await recorder.prepareToRecordAsync();
  recorder.record();

  pollTimer = setInterval(tick, POLL_MS);
}

export async function stopScreamDetection(): Promise<void> {
  cbs = null;

  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  if (recorder) {
    try {
      await recorder.stop();
    } catch {}
    recorder = null;
  }
}

import * as Speech from 'expo-speech';
import { setAudioModeAsync } from 'expo-audio';
import { pausePlaying, resumePlaying } from '@lib/audioManager';

let isSpeaking = false;

async function duckBackground(): Promise<void> {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      shouldPlayInBackground: false,
    });
    pausePlaying();
  } catch {}
}

async function restoreBackground(): Promise<void> {
  try {
    resumePlaying();
    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      shouldPlayInBackground: false,
    });
  } catch {}
}

export function isSpeechPlaying(): boolean {
  return isSpeaking;
}

export async function stopSpeech(): Promise<void> {
  if (await Speech.isSpeakingAsync()) {
    await Speech.stop();
  }
  isSpeaking = false;
  await restoreBackground();
}

export async function speak(
  text: string,
  options?: {
    language?: string;
    pitch?: number;
    rate?: number;
    onDone?: () => void;
  }
): Promise<void> {
  if (isSpeaking) {
    await stopSpeech();
  }

  await duckBackground();
  isSpeaking = true;

  Speech.speak(text, {
    language: options?.language ?? 'en-US',
    pitch: options?.pitch ?? 1.0,
    rate: options?.rate ?? 0.95,
    onDone: () => {
      isSpeaking = false;
      restoreBackground();
      options?.onDone?.();
    },
    onStopped: () => {
      isSpeaking = false;
      restoreBackground();
    },
    onError: () => {
      isSpeaking = false;
      restoreBackground();
    },
  });
}

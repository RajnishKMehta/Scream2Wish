import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

let currentPlayer: AudioPlayer | null = null;

export async function setupAudioConfig() {
  await setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'duckOthers',
    shouldPlayInBackground: false,
  });
}

async function playAudio(source: any, loop = false): Promise<void> {
  try {
    if (currentPlayer) {
      currentPlayer.remove();
      currentPlayer = null;
    }

    const player = createAudioPlayer(source);

    player.loop = loop;
    player.volume = 1;

    const sub = player.addListener('playbackStatusUpdate', (status) => {
      if (!status?.isPlaying && !loop) {
        currentPlayer = null;
        sub.remove();
      }
    });

    player.play();
    currentPlayer = player;

  } catch {
    currentPlayer = null;
  }
}

export async function stopPlaying(): Promise<void> {
  if (currentPlayer) {
    currentPlayer.remove();
    currentPlayer = null;
  }
}

export function isSoundPlaying(): boolean {
  return currentPlayer?.playing ?? false;
}

export async function playChiSasur(loop = false): Promise<void> {
  await playAudio(require('@audio/chi-sasur.mp3'), loop);
}

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { MemeLoadingStyles as S } from '@stylez';
import {
  playGhachar,
  playWelcomeToHell,
  restartAudio,
  stopPlaying,
} from '@lib/audioManager';

const MEME_MESSAGES = [
  '🔍 Scanning your phone...',
  '💀 Hacking your device...',
  '🌑 Connecting to Dark Web...',
  '📁 Leaking your private information on Dark Web...',
  '🌚 Reading your browser history...',
  '💳 Searching for bank details...',
  '📍 Tracking your live location...',
  '🎤 Activating microphone secretly...',
  '🔐 Bypassing security systems...',
  '📡 Sending data to unknown IP: 69.42.0.0...',
  '🕵️ Agent deployed successfully...',
  '☠️ Almost done leaking everything...',
  '✅ Upload complete. You are now owned.',
];

const MESSAGE_INTERVAL_MS = 1950;
const LAST_MESSAGE_HOLD_MS = 2050;
const TOTAL_DURATION_MS = (MEME_MESSAGES.length - 1) * MESSAGE_INTERVAL_MS + LAST_MESSAGE_HOLD_MS;

type Props = {
  onDone: () => void;
};

export function LoadingScreen({ onDone }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const msgFadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glitchAnim = useRef(new Animated.Value(1)).current;
  const lastMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    playGhachar(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TOTAL_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const progressListener = progressAnim.addListener(({ value }) => {
      setProgress(Math.round(value * 100));
    });

    const msgInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(msgFadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(msgFadeAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start();

      setMessageIndex((prev) => {
        if (prev >= MEME_MESSAGES.length - 1) {
          return prev;
        }
        return prev + 1;
      });

      restartAudio();
    }, MESSAGE_INTERVAL_MS);

    const glitchInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(glitchAnim, { toValue: 0.85, duration: 60, useNativeDriver: true }),
        Animated.timing(glitchAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      ]).start();
    }, 1800);

    lastMessageTimerRef.current = setTimeout(() => {
      stopPlaying();
      playWelcomeToHell(false);
    }, (MEME_MESSAGES.length - 1) * MESSAGE_INTERVAL_MS);

    doneTimerRef.current = setTimeout(() => {
      clearInterval(msgInterval);
      clearInterval(glitchInterval);
      progressAnim.removeListener(progressListener);
      stopPlaying();
      onDoneRef.current();
    }, TOTAL_DURATION_MS);

    return () => {
      clearInterval(msgInterval);
      clearInterval(glitchInterval);
      if (lastMessageTimerRef.current) clearTimeout(lastMessageTimerRef.current);
      if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
      progressAnim.removeListener(progressListener);
      stopPlaying();
    };
  }, []);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[S.container, { opacity: fadeAnim }]}>
      <View style={S.inner}>
        <Animated.Text style={[S.skull, { transform: [{ scale: glitchAnim }] }]}>
          👽
        </Animated.Text>

        <Text style={S.title}>SYSTEM BREACH</Text>
        <Text style={S.subtitle}>DO NOT CLOSE THIS APP</Text>

        <View style={S.terminalBox}>
          <Text style={S.terminalHeader}>{'>'} root@darknet:~$ executing payload...</Text>
          <Animated.Text style={[S.terminalMsg, { opacity: msgFadeAnim }]}> 
            {MEME_MESSAGES[messageIndex]}
          </Animated.Text>
        </View>

        <View style={S.progressContainer}>
          <View style={S.progressTrack}>
            <Animated.View style={[S.progressBar, { width: barWidth }]} />
          </View>
          <Text style={S.progressText}>{progress}% complete</Text>
        </View>

        <Text style={S.warningText}>⚠️  system hijacking...  ⚠️</Text>
      </View>
    </Animated.View>
  );
}

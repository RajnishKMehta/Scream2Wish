import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@stylez';
import { trySendWish, clearSessionAuthBlock } from '@lib/sendWish';

export default function RootLayout() {
  useEffect(() => {
    clearSessionAuthBlock();
    trySendWish();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg.base },
          animation: 'fade',
        }}
      />
    </>
  );
}

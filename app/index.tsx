import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { ShieldAlert } from 'lucide-react-native';
import {
  requestRequiredPermissions,
  areRequiredPermissionsGranted,
  type PermissionStatuses,
} from '@lib/permissionManager';
import { Storage } from '@lib/storage';
import { Colors, Layout, Components, Typography } from '@stylez';
import { setupAudioConfig } from '@lib/audioManager';

type Phase = 'requesting' | 'checking' | 'done';

const PHASE_MESSAGES: Record<Phase, string> = {
  requesting: 'Requesting required permissions...',
  checking: 'Checking everything...',
  done: 'All done!',
};

export default function PermissionGate() {
  const [phase, setPhase] = useState<Phase>('requesting');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    initApp()
  }, []);

  async function initApp() {
    try {
      await setupAudioConfig();
    } catch {}
  await runPermissionFlow();
  }
  async function runPermissionFlow() {
    setPhase('requesting');
    const requiredStatuses: PermissionStatuses = await requestRequiredPermissions();

    setPhase('checking');
    await new Promise((r) => setTimeout(r, 600));

    setPhase('done');
    await new Promise((r) => setTimeout(r, 300));

    if (areRequiredPermissionsGranted(requiredStatuses)) {
      const savedName = Storage.getString('name');
      if (savedName && savedName.trim().length > 5) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    } else {
      router.replace({
        pathname: '/perm',
        params: { statuses: JSON.stringify(requiredStatuses) },
      });
    }
  }

  return (
    <Animated.View style={[Layout.screenCentered, { opacity: fadeAnim }]}>
      <Animated.View
        style={[
          Components.iconCircleRed,
          { marginBottom: 28, transform: [{ scale: pulseAnim }] },
        ]}
      >
        <ShieldAlert size={64} color={Colors.red.primary} strokeWidth={1.5} />
      </Animated.View>

      <Text style={Typography.pageTitle}>Permissions Required</Text>
      <Text style={[Typography.subtitle, { marginBottom: 40 }]}>
        We need a few things before the app can start...
      </Text>

      <View style={Components.infoBox}>
        <ActivityIndicator size="small" color={Colors.red.primary} />
        <Text style={Typography.phaseText}>{PHASE_MESSAGES[phase]}</Text>
      </View>

      <Text style={Typography.footer}>
        Shout or Suffer{'\n'}(your time is being wasted)
      </Text>
    </Animated.View>
  );
}

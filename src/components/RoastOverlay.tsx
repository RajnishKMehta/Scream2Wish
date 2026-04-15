import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Copy, Check } from 'lucide-react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@stylez';

const PASSWORD = 'PassW0RD';

const ROASTS = [
  {
    emoji: '🫠',
    title: 'Three strikes.',
    body: "The password was the placeholder text. In the input box. The grey text that appeared before you started typing. You've been looking at it this entire time.",
  },
  {
    emoji: '😐',
    title: "We need to talk.",
    body: 'The hint was the answer. The placeholder in the password field literally said "PassW0RD". We put it there for you. Three tries later, here we are.',
  },
  {
    emoji: '💀',
    title: "Achievement unlocked.",
    body: '"Can\'t Read Input Fields" — the password was printed right inside the box you were typing in. Congratulations on this milestone.',
  },
  {
    emoji: '🪨',
    title: "Rocks solve this faster.",
    body: "We've seen inanimate objects figure this out. The password was the placeholder. Grey text. Inside the field. We built this screen specifically for you.",
  },
  {
    emoji: '🤦',
    title: "We're doing this for you.",
    body: "Our engineers are genuinely emotional right now. Three attempts. The answer was displayed inside the input on every single one of them. Here it is again.",
  },
  {
    emoji: '🫡',
    title: "No judgment. Some judgment.",
    body: 'A placeholder is a hint. In this case, it was also the exact correct answer. We applaud your persistence. We do not applaud your observation skills.',
  },
];

type Props = {
  visible: boolean;
};

export function RoastOverlay({ visible }: Props) {
  const slideAnim   = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [copied, setCopied]   = useState(false);
  const [roast]               = useState(() => ROASTS[Math.floor(Math.random() * ROASTS.length)]);
  const copyTimerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  if (!visible) return null;

  async function handleCopy() {
    await Clipboard.setStringAsync(PASSWORD);
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
  }

  return (
    <>
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} pointerEvents="none" />
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.handle} />

        <Text style={styles.emoji}>{roast.emoji}</Text>
        <Text style={styles.title}>{roast.title}</Text>
        <Text style={styles.body}>{roast.body}</Text>

        <View style={styles.divider} />

        <Text style={styles.passwordLabel}>The password was always:</Text>

        <View style={styles.passwordRow}>
          <Text style={styles.passwordText} selectable>{PASSWORD}</Text>
          <TouchableOpacity
            style={[styles.copyBtn, copied && styles.copyBtnDone]}
            onPress={handleCopy}
            activeOpacity={0.75}
          >
            {copied ? (
              <Check size={15} color={Colors.green.label} strokeWidth={2.5} />
            ) : (
              <Copy size={15} color={Colors.text.muted} strokeWidth={2} />
            )}
            <Text style={[styles.copyBtnText, copied && styles.copyBtnTextDone]}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          This panel will not go away. You're welcome.
        </Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    zIndex: 8000,
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 8001,
    backgroundColor: Colors.bg.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border.redLight,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
    paddingBottom: 40,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border.neutral,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },

  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  title: {
    fontSize: FontSize.heading3,
    fontWeight: FontWeight.extrabold,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  body: {
    fontSize: FontSize.body,
    color: Colors.text.subtle,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.neutral,
    width: '100%',
    marginBottom: Spacing.xl,
  },

  passwordLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text.dimmer,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bg.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  passwordText: {
    flex: 1,
    fontSize: FontSize.heading3,
    fontWeight: FontWeight.extrabold,
    color: Colors.text.white,
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  copyBtnDone: {
    borderColor: Colors.border.greenFaint,
    backgroundColor: Colors.green.badge,
  },

  copyBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.muted,
  },

  copyBtnTextDone: {
    color: Colors.green.label,
  },

  footer: {
    fontSize: FontSize.md,
    color: Colors.text.ghost,
    textAlign: 'center',
    lineHeight: 18,
  },
});

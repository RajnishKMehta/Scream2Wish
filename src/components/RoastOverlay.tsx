import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Copy, Check, Eye, EyeOff } from 'lucide-react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@stylez';

const PASSWORD = 'PassW0RD';
const LOCK_MS  = 1200;

const ROASTS = [
  {
    emoji: '🫠',
    title: 'Four strikes.',
    body: "The password was the placeholder text. The grey text inside the input box. Visible on all four attempts. You've been looking at it the entire time.",
  },
  {
    emoji: '😐',
    title: "We need to talk.",
    body: 'The hint was the answer. The placeholder in the password field literally said "PassW0RD". We put it there for you. Four tries later, here we are.',
  },
  {
    emoji: '💀',
    title: "Achievement unlocked.",
    body: '"Can\'t Read Input Fields" — the password was printed right inside the box you were typing in. Four consecutive attempts. Congratulations on this milestone.',
  },
  {
    emoji: '🪨',
    title: "Rocks solve this faster.",
    body: "We've seen inanimate objects figure this out. The password was the placeholder. Grey text. Inside the field. You had four chances. We built this screen specifically for you.",
  },
  {
    emoji: '🤦',
    title: "I'm doing this for you.",
    body: "I'm genuinely emotional right now. Four attempts. The answer was displayed inside the input on every single one of them. Here it is again.",
  },
  {
    emoji: '🫡',
    title: "No judgment. Some judgment.",
    body: 'A placeholder is a hint. In this case, it was also the exact correct answer. We applaud your persistence across four attempts. We do not applaud your observation skills.',
  },
  {
    emoji: '🧠',
    title: "A study in patience.",
    body: "You tried four times. Each time the answer sat inside the field, unhidden, unencrypted, plain text, completely visible. Science has no explanation for what happened here.",
  },
  {
    emoji: '🔍',
    title: "The clue was the answer.",
    body: "Detectives spend careers learning to see what's in front of them. In four attempts, you developed the opposite skill. The password was the placeholder. It still is.",
  },
];

type Props = {
  onHide: () => void;
};

export function RoastOverlay({ onHide }: Props) {
  const slideAnim    = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [copied, setCopied]   = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [roast]               = useState(() => ROASTS[Math.floor(Math.random() * ROASTS.length)]);

  const lockRef      = useRef(true);
  const lockTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHideRef    = useRef(onHide);

  useEffect(() => { onHideRef.current = onHide; }, [onHide]);

  const dismissSheet = useCallback(() => {
    if (lockRef.current) return;
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => { onHideRef.current(); });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        !lockRef.current && gs.dy > 8 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderMove: (_, gs) => {
        if (!lockRef.current && gs.dy > 0) {
          slideAnim.setValue(gs.dy);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (!lockRef.current && gs.dy > 80) {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: 600,
              duration: 220,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(backdropAnim, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }),
          ]).start(() => { onHideRef.current(); });
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 120,
            friction: 12,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    slideAnim.setValue(500);
    backdropAnim.setValue(0);

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

    lockRef.current = true;
    lockTimer.current = setTimeout(() => { lockRef.current = false; }, LOCK_MS);

    return () => {
      if (lockTimer.current) clearTimeout(lockTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  async function handleCopy() {
    await Clipboard.setStringAsync(PASSWORD);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2500);
  }

  return (
    <>
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={dismissSheet}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <Text style={styles.emoji}>{roast.emoji}</Text>
        <Text style={styles.title}>{roast.title}</Text>
        <Text style={styles.body}>{roast.body}</Text>

        <View style={styles.divider} />

        <Text style={styles.passwordLabel}>The password was always:</Text>

        <View style={styles.passwordRow}>
          <Text style={styles.passwordText} selectable={showPwd}>
            {showPwd ? PASSWORD : '•'.repeat(PASSWORD.length)}
          </Text>

          <TouchableOpacity
            onPress={() => setShowPwd((p) => !p)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.eyeBtn}
          >
            {showPwd
              ? <EyeOff size={16} color={Colors.text.muted} strokeWidth={2} />
              : <Eye    size={16} color={Colors.text.muted} strokeWidth={2} />
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.copyBtn, copied && styles.copyBtnDone]}
            onPress={handleCopy}
            activeOpacity={0.75}
          >
            {copied
              ? <Check size={15} color={Colors.green.label} strokeWidth={2.5} />
              : <Copy  size={15} color={Colors.text.muted}  strokeWidth={2} />
            }
            <Text style={[styles.copyBtnText, copied && styles.copyBtnTextDone]}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Swipe down or tap outside to hide. You'll need to come back if you forget again.
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
    gap: Spacing.sm,
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

  eyeBtn: {
    padding: 4,
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

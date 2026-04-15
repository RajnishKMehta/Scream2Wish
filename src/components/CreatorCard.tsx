import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Globe } from 'lucide-react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@stylez';

const LOCAL_AVATAR  = require('@img/in/rajnish.jpg');
const GITHUB_AVATAR = 'https://avatars.githubusercontent.com/u/172272341?s=460';
const APP_URL       = 'https://rajnishkmehta.github.io/Scream2Wish';
const GITHUB_URL    = 'https://github.com/RajnishKMehta';
const LINKEDIN_URL  = 'https://linkedin.com/in/RajnishKMehta';
const DEVTO_URL     = 'https://dev.to/RajnishKMehta';

interface Props {
  rnoteLoaded: boolean;
}

export function CreatorCard({ rnoteLoaded }: Props) {
  const [remoteReady, setRemoteReady] = useState(false);

  const localOpacity  = useRef(new Animated.Value(1)).current;
  const remoteOpacity = useRef(new Animated.Value(0)).current;
  const showRemoteRef = useRef(false);

  useEffect(() => {
    if (!rnoteLoaded) return;
    Image.prefetch(GITHUB_AVATAR)
      .then(() => setRemoteReady(true))
      .catch(() => {});
  }, [rnoteLoaded]);

  useEffect(() => {
    if (!rnoteLoaded || !remoteReady) return;

    const startWithRemote = Math.random() > 0.5;
    localOpacity.setValue(startWithRemote ? 0 : 1);
    remoteOpacity.setValue(startWithRemote ? 1 : 0);
    showRemoteRef.current = startWithRemote;

    const toggle = () => {
      const toRemote = !showRemoteRef.current;
      showRemoteRef.current = toRemote;
      Animated.parallel([
        Animated.timing(localOpacity, {
          toValue: toRemote ? 0 : 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(remoteOpacity, {
          toValue: toRemote ? 1 : 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const id = setInterval(toggle, 4000);
    return () => clearInterval(id);
  }, [rnoteLoaded, remoteReady]);

  function openLink(url: string) {
    Linking.openURL(url).catch(() => {});
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.websiteBtn}
        onPress={() => openLink(APP_URL)}
        activeOpacity={0.8}
      >
        <Globe size={18} color={Colors.red.primary} strokeWidth={2} />
        <View style={styles.websiteBtnText}>
          <Text style={styles.websiteBtnTitle}>See all wishes on the web</Text>
          <Text style={styles.websiteBtnSub}>
            Visit Scream2Wish to read wishes &amp; notes from everyone
          </Text>
        </View>
        <Text style={styles.websiteArrow}>›</Text>
      </TouchableOpacity>

      <View style={styles.creatorRow}>
        <View style={styles.avatarWrap}>
          <Animated.Image
            source={LOCAL_AVATAR}
            style={[styles.avatar, { opacity: localOpacity }]}
          />
          {remoteReady && (
            <Animated.Image
              source={{ uri: GITHUB_AVATAR }}
              style={[styles.avatar, styles.avatarAbsolute, { opacity: remoteOpacity }]}
            />
          )}
        </View>

        <View style={styles.creatorInfo}>
          <Text style={styles.creatorLabel}>Made by</Text>
          <Text style={styles.creatorName}>Rajnish K. Mehta</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialChip}
              onPress={() => openLink(GITHUB_URL)}
              activeOpacity={0.75}
            >
              <Text style={styles.socialChipText}>GitHub</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialChip}
              onPress={() => openLink(LINKEDIN_URL)}
              activeOpacity={0.75}
            >
              <Text style={styles.socialChipText}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialChip}
              onPress={() => openLink(DEVTO_URL)}
              activeOpacity={0.75}
            >
              <Text style={styles.socialChipText}>Dev.to</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    marginTop: Spacing.xl,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.neutral,
    marginBottom: Spacing.xl,
  },

  websiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border.redFaint,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },

  websiteBtnText: {
    flex: 1,
  },

  websiteBtnTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.text.white,
    marginBottom: 2,
  },

  websiteBtnSub: {
    fontSize: FontSize.xs,
    color: Colors.text.subtle,
    lineHeight: 16,
  },

  websiteArrow: {
    fontSize: 22,
    color: Colors.text.dimmer,
    lineHeight: 24,
  },

  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    padding: Spacing.xl,
  },

  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: Colors.bg.elevated,
    borderWidth: 2,
    borderColor: Colors.border.redLight,
    flexShrink: 0,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  avatarAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  creatorInfo: {
    flex: 1,
  },

  creatorLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text.dimmer,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  creatorName: {
    fontSize: FontSize.btn,
    fontWeight: FontWeight.bold,
    color: Colors.text.white,
    marginBottom: Spacing.md,
  },

  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  socialChip: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },

  socialChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.muted,
  },
});

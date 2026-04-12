import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { FontSize, FontWeight } from './typography';
import { Spacing, Radius } from './spacing';

export const MainStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg.base,
  },
  centeredScreen: {
    flex: 1,
    backgroundColor: Colors.bg.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: 130,
    fontWeight: FontWeight.extrabold,
    color: Colors.text.white,
    textAlign: 'center',
    letterSpacing: -4,
  },
  introText: {
    fontSize: FontSize.heading1,
    fontWeight: FontWeight.extrabold,
    color: Colors.text.white,
    textAlign: 'center',
    paddingHorizontal: Spacing.huge,
    lineHeight: 38,
  },
  promptText: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.extrabold,
    color: Colors.red.label,
    textAlign: 'center',
    paddingHorizontal: Spacing.huge,
    lineHeight: 42,
  },
  meterWrap: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 10,
    height: 90,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bg.elevated,
    overflow: 'hidden',
    zIndex: 20000,
  },
  meterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: Radius.sm,
  },
  bottomInstruction: {
    position: 'absolute',
    bottom: 56,
    left: Spacing.screen,
    right: Spacing.screen,
    textAlign: 'center',
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.text.subtle,
    lineHeight: 22,
    zIndex: 20000,
  },
  characterWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    zIndex: 15000,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
});

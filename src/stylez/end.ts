import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Spacing, Radius } from './spacing';
import { FontSize, FontWeight } from './typography';

export const EndStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg.base,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screen,
    paddingTop: 56,
    paddingBottom: 64,
    alignItems: 'center',
  },

  characterImage: {
    width: 180,
    height: 180,
    marginBottom: Spacing.xxl,
  },

  tabBar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    padding: 4,
    marginBottom: Spacing.xl,
  },

  tabItem: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Radius.full,
  },

  tabItemActive: {
    backgroundColor: Colors.red.primary,
  },

  tabLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dimmer,
  },

  tabLabelActive: {
    color: Colors.text.white,
  },

  noteCard: {
    width: '100%',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    minHeight: 160,
  },

  noteSectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.text.dimmer,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },

  noteText: {
    fontSize: FontSize.heading3,
    fontWeight: FontWeight.medium,
    color: Colors.text.white,
    lineHeight: 32,
    marginBottom: Spacing.lg,
  },

  noteMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },

  noteMetaText: {
    fontSize: FontSize.xs,
    color: Colors.text.subtle,
  },

  noteDivider: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: Colors.text.ghost,
  },

  fetchLoadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },

  fetchLoadingText: {
    fontSize: FontSize.body,
    color: Colors.text.subtle,
  },

  fetchErrorText: {
    fontSize: FontSize.body,
    color: Colors.red.label,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },

  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bg.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginTop: 4,
  },

  retryBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.muted,
  },

  sendStatusWrap: {
    marginTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border.neutral,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },

  sendStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },

  sendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  sendDotGreen: {
    backgroundColor: Colors.green.bright,
  },

  sendDotAmber: {
    backgroundColor: Colors.amber.primary,
  },

  sendDotRed: {
    backgroundColor: Colors.red.primary,
  },

  sendStatusSent: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.green.label,
  },

  sendStatusRetrying: {
    fontSize: FontSize.base,
    color: Colors.amber.primary,
    fontWeight: FontWeight.medium,
  },

  sendStatusError: {
    fontSize: FontSize.base,
    color: Colors.red.label,
    fontWeight: FontWeight.medium,
    flex: 1,
  },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.bg.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    width: '100%',
    marginTop: Spacing.sm,
  },

  shareBtnText: {
    fontSize: FontSize.btn,
    fontWeight: FontWeight.semibold,
    color: Colors.text.muted,
  },

  wishInputContainer: {
    flex: 1,
    backgroundColor: Colors.bg.base,
    paddingHorizontal: Spacing.screen,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  wishCharacterImage: {
    width: 160,
    height: 160,
    marginBottom: Spacing.xxl,
  },

  wishPrompt: {
    fontSize: FontSize.heading3,
    fontWeight: FontWeight.bold,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 30,
  },

  wishSubPrompt: {
    fontSize: FontSize.body,
    color: Colors.text.subtle,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    lineHeight: 20,
  },

  wishInputWrap: {
    width: '100%',
    backgroundColor: Colors.bg.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.neutral,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
    minHeight: 90,
  },

  wishInputWrapError: {
    borderColor: Colors.border.redStrong,
    backgroundColor: Colors.bg.errorInput,
  },

  wishErrorText: {
    fontSize: FontSize.xs,
    color: Colors.red.primary,
    fontWeight: FontWeight.semibold,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },

  wishInput: {
    color: Colors.text.white,
    fontSize: FontSize.input,
    lineHeight: 22,
  },

  wishCharCount: {
    fontSize: FontSize.xs,
    color: Colors.text.ghost,
    fontWeight: FontWeight.medium,
    alignSelf: 'flex-end',
    marginBottom: Spacing.xxxl,
  },

  wishBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.red.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    width: '100%',
    marginBottom: Spacing.md,
  },

  wishBtnPrimaryText: {
    color: Colors.text.white,
    fontSize: FontSize.btn,
    fontWeight: FontWeight.bold,
  },

  wishBtnSkip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'transparent',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    width: '100%',
  },

  wishBtnSkipText: {
    color: Colors.text.subtle,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
});

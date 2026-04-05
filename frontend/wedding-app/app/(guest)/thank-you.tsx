import { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { apiClient } from '../../services/api';
import type { ThankYouMessage } from '../../types/api';

const HEART_CONFIGS = [
  { left: '10%', size: 12, color: '#ffb3ba', delay: 0 },
  { left: '30%', size: 8, color: '#c0504d', delay: 300 },
  { left: '55%', size: 14, color: '#ffb3ba', delay: 600 },
  { left: '75%', size: 10, color: '#c0504d', delay: 900 },
  { left: '88%', size: 8, color: '#ffb3ba', delay: 1200 },
];

function FloatingHeart({ cfg }: { cfg: typeof HEART_CONFIGS[0] }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    // stagger start
    const timer = setTimeout(() => {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 100 }),
        ),
        -1,
      );
    }, cfg.delay);
    return () => clearTimeout(timer);
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -progress.value * 100 }],
    opacity: progress.value < 0.7 ? progress.value / 0.7 : (1 - progress.value) / 0.3,
  }));
  return (
    <Animated.Text
      style={[{
        position: 'absolute',
        bottom: 20,
        left: cfg.left as any,
        fontSize: cfg.size,
        color: cfg.color,
      }, style]}
    >
      ♥
    </Animated.Text>
  );
}

function FloatingHearts() {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }} pointerEvents="none">
      {HEART_CONFIGS.map((cfg, i) => (
        <FloatingHeart key={i} cfg={cfg} />
      ))}
    </View>
  );
}

export default function ThankYouScreen() {
  const { isEnabled, isLoading: flagLoading } = useFeatureFlag('thank_you');

  const { data: message, isLoading: msgLoading } = useQuery<ThankYouMessage | null>({
    queryKey: ['thank-you-my'],
    queryFn: async () => (await apiClient.get('/thank-you/my')).data,
    enabled: isEnabled,
  });

  if (flagLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!isEnabled) {
    return (
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Feather name="mail" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.title}>{Copy.thankYou.lockedTitle}</Text>
        <Text style={s.subtitle}>{Copy.thankYou.lockedSubtitle}</Text>
        <View style={s.dateBadge}>
          <Feather name="calendar" size={13} color={Colors.primary} />
          <Text style={s.dateText}>6. september 2026, 8:00</Text>
        </View>
      </View>
    );
  }

  if (msgLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!message) {
    return (
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Feather name="clock" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.title}>Správa sa pripravuje</Text>
        <Text style={s.subtitle}>
          Maťka a Dušan práve píšu vaše osobné poďakovanie. Skúste to znova neskôr.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* ── Envelope hero ─────────────────────────────────────── */}
      <LinearGradient
        colors={[Colors.primaryFixed, '#fedf9f', Colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={s.hero}
      >
        <FloatingHearts />

        {/* Wax seal */}
        <View style={s.waxSeal}>
          <LinearGradient
            colors={[Colors.primary, '#4d3a08']}
            style={s.waxSealInner}
          >
            <Text style={s.waxSealText}>M&D</Text>
          </LinearGradient>
          {/* Seal rays */}
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={[s.waxRay, { transform: [{ rotate: `${i * 45}deg` }] }]}
            />
          ))}
        </View>

        <Text style={s.heroTitle}>{Copy.thankYou.title}</Text>
        <Text style={s.heroSub}>od Maťky a Dušana</Text>

        {/* Decorative envelope flap */}
        <View style={s.envelopeFlap}>
          <View style={s.flapLeft} />
          <View style={s.flapRight} />
        </View>
      </LinearGradient>

      {/* ── Message card (letter paper style) ─────────────────── */}
      <View style={s.card}>
        {/* Corner decorations */}
        <Text style={[s.corner, s.cornerTL]}>✦</Text>
        <Text style={[s.corner, s.cornerTR]}>✦</Text>
        <Text style={[s.corner, s.cornerBL]}>✦</Text>
        <Text style={[s.corner, s.cornerBR]}>✦</Text>

        {message.photoUrl ? (
          <Image
            source={{ uri: message.photoUrl }}
            style={s.photo}
            resizeMode="cover"
          />
        ) : null}
        <View style={s.quoteBar} />
        <Text style={s.messageText}>{message.message}</Text>
        <View style={s.signature}>
          <Text style={s.signatureText}>S láskou,</Text>
          <Text style={s.signatureName}>Maťka & Dušan 💛</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },

  center: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryFixed,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: Spacing.lg,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dateText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.primary,
  },

  hero: {
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 0,
    overflow: 'hidden',
    minHeight: 240,
    justifyContent: 'flex-end',
  },
  // Wax seal
  waxSeal: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  waxSealInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...Shadow.card,
  },
  waxSealText: {
    fontFamily: Typography.headingItalic,
    fontSize: 16,
    color: '#fedf9f',
    letterSpacing: 1,
  },
  waxRay: {
    position: 'absolute',
    width: 80,
    height: 4,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 2,
    opacity: 0.4,
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },
  // Envelope flap decorations
  envelopeFlap: {
    flexDirection: 'row',
    width: '100%',
    height: 32,
    marginTop: Spacing.sm,
  },
  flapLeft: {
    flex: 1,
    borderTopWidth: 32,
    borderTopColor: Colors.background,
    borderRightWidth: 0,
    borderRightColor: 'transparent',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    // CSS trick for triangle not available in RN, use opacity overlay instead
    opacity: 0.7,
  },
  flapRight: {
    flex: 1,
    borderTopWidth: 32,
    borderTopColor: Colors.background,
    opacity: 0.7,
  },

  card: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  // Corner ornaments
  corner: {
    position: 'absolute',
    fontSize: 14,
    color: Colors.primaryContainer,
    zIndex: 1,
  },
  cornerTL: { top: 12, left: 12 },
  cornerTR: { top: 12, right: 12 },
  cornerBL: { bottom: 12, left: 12 },
  cornerBR: { bottom: 12, right: 12 },
  photo: {
    width: '100%',
    height: 220,
  },
  quoteBar: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    marginTop: Spacing.lg,
    marginLeft: Spacing.lg,
  },
  messageText: {
    fontFamily: Typography.body,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 28,
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    letterSpacing: 0.2,
  },
  signature: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'flex-end',
  },
  signatureText: {
    fontFamily: Typography.headingItalic,
    fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  signatureName: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.primary,
    marginTop: 4,
  },
});

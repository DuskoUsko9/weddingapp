import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
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
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { StaticContent } from '../../types/api';

const MAP_URL = 'https://maps.google.com/?q=Penz%C3%ADon+Zemiansky+Dvor+Surovce';

function PulsingPin() {
  const scale = useSharedValue(1);
  const ring = useSharedValue(0);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 500, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1400 }),
      ),
      -1,
    );
    ring.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 100 }),
        withTiming(0, { duration: 1100 }),
      ),
      -1,
    );
  }, []);
  const pinStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ring.value * 0.5 }],
    opacity: (1 - ring.value) * 0.3,
  }));
  return (
    <View style={pin.container}>
      <Animated.View style={[pin.ring, ringStyle]} />
      <Animated.View style={[pin.badge, pinStyle]}>
        <Text style={pin.emoji}>📍</Text>
      </Animated.View>
    </View>
  );
}

const pin = StyleSheet.create({
  container: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 28 },
});

export default function ParkingScreen() {
  const { data, isLoading } = useQuery<StaticContent>({
    queryKey: ['static', 'parking'],
    queryFn: async () => (await apiClient.get('/static-content/parking')).data,
  });

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  const openMap = () => {
    const url = (data?.metadata as any)?.mapUrl ?? MAP_URL;
    Linking.openURL(url).catch(() => undefined);
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* ── Hero map card ─────────────────────────────────────── */}
      <LinearGradient
        colors={['#1e2d1e', '#2e4a2e', '#516351']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={s.mapHero}
      >
        {/* Grid overlay for map feel */}
        <View style={s.mapGrid} pointerEvents="none">
          {Array.from({ length: 8 }).map((_, r) => (
            <View key={`r${r}`} style={s.mapGridRow}>
              {Array.from({ length: 6 }).map((_, c) => (
                <View key={`c${c}`} style={s.mapGridCell} />
              ))}
            </View>
          ))}
        </View>
        <PulsingPin />
        <Text style={s.heroTitle}>{data?.title ?? Copy.parking.title}</Text>
        <Text style={s.heroAddress}>{Copy.parking.address}</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={openMap} style={s.mapBtn}>
          <Feather name="navigation" size={14} color="#fff" />
          <Text style={s.mapBtnText}>{Copy.parking.navigateBtn}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ── Info chips ────────────────────────────────────────── */}
      <View style={s.chips}>
        {[
          { icon: '🚗', label: 'Parkovanie zdarma' },
          { icon: '✅', label: 'Dostatočná kapacita' },
          { icon: '🏡', label: 'Priamo pri penzióne' },
        ].map(({ icon, label }) => (
          <View key={label} style={s.chip}>
            <Text style={s.chipEmoji}>{icon}</Text>
            <Text style={s.chipText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* ── Info card ─────────────────────────────────────────── */}
      {data?.content ? (
        <View style={s.card}>
          <View style={s.cardIconRow}>
            <Feather name="info" size={16} color={Colors.primary} />
            <Text style={s.cardLabel}>Informácie o parkovaní</Text>
          </View>
          <Text style={s.body}>{data.content}</Text>
        </View>
      ) : null}

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Map hero
  mapHero: {
    paddingTop: 64,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 280,
    justifyContent: 'flex-end',
  },
  mapGrid: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.06,
  },
  mapGridRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  mapGridCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: Spacing.xs,
  },
  heroAddress: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  mapBtnText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 13,
    color: '#fff',
    letterSpacing: 0.3,
  },

  chips: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chipEmoji: { fontSize: 18 },
  chipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.secondary,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    ...Shadow.card,
  },
  cardIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 13,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  body: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 26,
  },
});
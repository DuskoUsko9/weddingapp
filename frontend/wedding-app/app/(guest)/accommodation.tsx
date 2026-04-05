import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { StaticContent } from '../../types/api';

// Tiny star field component
function StarField() {
  const stars = [
    { top: 12, left: '15%', size: 3 }, { top: 25, right: '20%', size: 2 },
    { top: 8, left: '60%', size: 2 }, { top: 40, left: '40%', size: 3 },
    { top: 18, right: '5%', size: 2 }, { top: 50, left: '8%', size: 2 },
    { top: 35, right: '35%', size: 2 }, { top: 60, left: '75%', size: 3 },
    { top: 5, left: '80%', size: 2 }, { top: 70, left: '25%', size: 2 },
  ];
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
      {stars.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: s.top as any,
            left: (s as any).left,
            right: (s as any).right,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}
        />
      ))}
    </View>
  );
}

export default function AccommodationScreen() {
  const { data, isLoading } = useQuery<StaticContent>({
    queryKey: ['static', 'accommodation'],
    queryFn: async () => (await apiClient.get('/static-content/accommodation')).data,
  });

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  const meta = (data?.metadata as any) ?? {};

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* ── Venue hero ────────────────────────────────────────── */}
      <LinearGradient
        colors={['#0d1a1a', '#1a2e28', '#2a4a3a']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={s.hero}
      >
        <StarField />

        {/* Moon + building illustration */}
        <View style={s.illustration}>
          <Text style={s.moonEmoji}>🌙</Text>
          <View style={s.buildingRow}>
            <Text style={s.buildingEmoji}>🏡</Text>
          </View>
        </View>

        <Text style={s.heroTitle}>{data?.title ?? Copy.accommodation.title}</Text>
        <Text style={s.heroVenue}>{Copy.accommodation.venue}</Text>

        {/* Check-in badge */}
        <View style={s.checkInBadge}>
          <Text style={s.checkInEmoji}>🗓️</Text>
          <Text style={s.checkInText}>{Copy.accommodation.checkIn}</Text>
        </View>
      </LinearGradient>

      {/* ── Info chips ────────────────────────────────────────── */}
      <View style={s.chips}>
        {[
          { emoji: '🛏️', label: 'Ubytovanie priamo na mieste' },
          ...(meta.breakfastIncluded === false
            ? [{ emoji: 'ℹ️', label: 'Raňajky nie sú v cene' }]
            : [{ emoji: '🥐', label: 'Raňajky v cene' }]),
          ...(meta.note ? [{ emoji: 'ℹ️', label: meta.note }] : []),
        ].map(({ emoji, label }) => (
          <View key={label} style={s.chip}>
            <Text style={s.chipEmoji}>{emoji}</Text>
            <Text style={s.chipText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* ── Content card ─────────────────────────────────────── */}
      {data?.content ? (
        <View style={s.card}>
          <View style={s.cardIconRow}>
            <Feather name="home" size={16} color={Colors.secondary} />
            <Text style={s.cardLabel}>O ubytovaní</Text>
          </View>
          <Text style={s.body}>{data.content}</Text>
        </View>
      ) : null}

      {/* ── Info banner ──────────────────────────────────────── */}
      <View style={s.infoBanner}>
        <Text style={s.bannerEmoji}>📞</Text>
        <Text style={s.infoText}>
          Pre detaily o izbe kontaktujte organizátorov svadby.
        </Text>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  hero: {
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 260,
    justifyContent: 'flex-end',
  },
  illustration: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  moonEmoji: { fontSize: 32, marginBottom: -8 },
  buildingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  buildingEmoji: { fontSize: 48 },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: Spacing.xs,
  },
  heroVenue: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  checkInBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  checkInEmoji: { fontSize: 14 },
  checkInText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },

  chips: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chipEmoji: { fontSize: 18 },
  chipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: '#4d3a08',
    flex: 1,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
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
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  body: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 26,
  },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  bannerEmoji: { fontSize: 18 },
  infoText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: '#4d3a08',
    flex: 1,
    lineHeight: 20,
  },
});
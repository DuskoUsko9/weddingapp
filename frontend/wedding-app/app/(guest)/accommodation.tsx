import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { StaticContent } from '../../types/api';

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
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* ── Hero header ───────────────────────────────────────── */}
      <View style={s.hero}>
        <View style={s.iconWrap}>
          <Feather name="home" size={28} color={Colors.secondary} />
        </View>
        <Text style={s.title}>{data?.title ?? Copy.accommodation.title}</Text>
        <Text style={s.venue}>{Copy.accommodation.venue}</Text>
      </View>

      {/* ── Info chips ────────────────────────────────────────── */}
      <View style={s.chips}>
        <View style={s.chip}>
          <Feather name="calendar" size={14} color={Colors.primary} />
          <Text style={s.chipText}>{Copy.accommodation.checkIn}</Text>
        </View>
        {meta.breakfastIncluded === false && (
          <View style={s.chip}>
            <Feather name="info" size={14} color={Colors.onSurfaceVariant} />
            <Text style={[s.chipText, { color: Colors.onSurfaceVariant }]}>Raňajky nie sú v cene</Text>
          </View>
        )}
        {meta.note && (
          <View style={s.chip}>
            <Feather name="info" size={14} color={Colors.onSurfaceVariant} />
            <Text style={[s.chipText, { color: Colors.onSurfaceVariant }]}>{meta.note}</Text>
          </View>
        )}
      </View>

      {/* ── Content card ─────────────────────────────────────── */}
      <View style={s.card}>
        <Text style={s.body}>{data?.content}</Text>
      </View>

      {/* ── Info banner ──────────────────────────────────────── */}
      <View style={s.infoBanner}>
        <Feather name="phone" size={14} color="#4d3a08" />
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
    paddingTop: Spacing.gallery,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 32,
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: Spacing.xs,
  },
  venue: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  chips: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
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
  infoText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: '#4d3a08',
    flex: 1,
    lineHeight: 20,
  },
});
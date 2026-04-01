import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { ScheduleItem } from '../../types/api';

// Alternating dot colors per design
const DOT_COLORS = [Colors.secondary, Colors.primary, Colors.tertiary, Colors.secondary, Colors.primary];

export default function ScheduleScreen() {
  const { data: items = [], isLoading } = useQuery<ScheduleItem[]>({
    queryKey: ['schedule'],
    queryFn: async () => (await apiClient.get('/schedule')).data,
  });

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* ── Hero header ────────────────────────────────────────── */}
      <View style={s.heroHeader}>
        <Text style={s.heroTitle}>{Copy.schedule.title}</Text>
        <Text style={s.heroSub}>{Copy.schedule.subtitle}</Text>
        <View style={s.heroDivider} />
      </View>

      {/* ── Timeline ───────────────────────────────────────────── */}
      <View style={s.timeline}>
        {items.map((item, idx) => {
          const dotColor = DOT_COLORS[idx % DOT_COLORS.length];
          return (
            <View key={item.id} style={s.eventRow}>
              {/* Dot — no connecting line per design system */}
              <View style={[s.dot, { backgroundColor: dotColor }]} />

              {/* Card */}
              <View style={s.card}>
                <View style={s.cardTop}>
                  <View style={[s.timePill, { backgroundColor: `${dotColor}18` }]}>
                    <Text style={[s.timeText, { color: dotColor }]}>{item.timeLabel}</Text>
                  </View>
                </View>
                <Text style={s.itemTitle}>{item.title}</Text>
                {item.description ? (
                  <Text style={s.itemDesc}>{item.description}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingBottom: Spacing.xxl,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Hero header
  heroHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.gallery,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 36,
    color: Colors.onSurface,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  heroDivider: {
    width: 32,
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginTop: Spacing.md,
  },

  // Timeline
  timeline: {
    paddingHorizontal: Spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },

  // Dot — NO connecting line
  dot: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    marginTop: 18,
    flexShrink: 0,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  timePill: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  itemTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 6,
    lineHeight: 28,
  },
  itemDesc: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
});
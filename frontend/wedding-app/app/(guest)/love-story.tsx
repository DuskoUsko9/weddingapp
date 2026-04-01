import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { LoveStoryEvent } from '../../types/api';

const DOT_COLORS = [Colors.secondary, Colors.primary, Colors.tertiary, Colors.secondary, Colors.primary];

function formatEventDate(dateStr: string): string {
  // dateStr expected as ISO date "2017-09-09" or similar
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('sk-SK', { year: 'numeric', month: 'long' });
  } catch {
    return dateStr;
  }
}

export default function LoveStoryScreen() {
  const { data: events = [], isLoading } = useQuery<LoveStoryEvent[]>({
    queryKey: ['love-story'],
    queryFn: async () => (await apiClient.get('/love-story')).data,
  });

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* ── Hero header ───────────────────────────────────────── */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>{Copy.loveStory.title}</Text>
        <View style={s.heroDivider} />
        <Text style={s.heroSub}>{Copy.loveStory.subtitle}</Text>
      </View>

      {/* ── Timeline — NO connecting line ──────────────────── */}
      <View style={s.timeline}>
        {events.map((event, idx) => {
          const dotColor = DOT_COLORS[idx % DOT_COLORS.length];
          return (
            <View key={event.id} style={s.eventRow}>
              {/* Dot */}
              <View style={[s.dot, { backgroundColor: dotColor }]} />

              {/* Card */}
              <View style={[s.card, idx === events.length - 1 && s.cardLast]}>
                <Text style={[s.eventDate, { color: dotColor }]}>
                  {formatEventDate(event.eventDate)}
                </Text>
                <Text style={s.eventTitle}>{event.title}</Text>
                {event.description ? (
                  <Text style={s.eventDesc}>{event.description}</Text>
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
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  hero: {
    paddingTop: Spacing.gallery,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 36,
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  heroDivider: {
    width: 32,
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: Spacing.md,
  },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Timeline — NO connecting line
  timeline: {
    paddingHorizontal: Spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    marginTop: 20,
    flexShrink: 0,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.card,
  },
  cardLast: {
    backgroundColor: Colors.primaryFixed,
  },
  eventDate: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  eventTitle: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.onSurface,
    lineHeight: 26,
    marginBottom: 4,
  },
  eventDesc: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
});
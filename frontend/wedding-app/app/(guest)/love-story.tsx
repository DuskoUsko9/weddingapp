import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { LoveStoryEvent } from '../../types/api';

const DOT_COLORS = [Colors.secondary, Colors.primary, '#c0504d', Colors.tertiary, Colors.secondary, Colors.primary];

function formatEventDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('sk-SK', { year: 'numeric', month: 'long' });
  } catch {
    return dateStr;
  }
}

function OrnamentDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
      <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 6 }}>✦ ✦ ✦</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
    </View>
  );
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
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#2a1f0a', '#4a3515', '#6a5020']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={s.hero}
      >
        {/* Decorative bokeh dots */}
        <View style={s.bokehWrap} pointerEvents="none">
          {[
            { top: 20, left: '10%', size: 60, opacity: 0.04 },
            { top: 80, right: '8%', size: 90, opacity: 0.05 },
            { bottom: 30, left: '30%', size: 50, opacity: 0.03 },
          ].map((dot, i) => (
            <View
              key={i}
              style={[
                s.bokehDot,
                {
                  top: dot.top as any,
                  left: dot.left as any,
                  right: dot.right as any,
                  bottom: dot.bottom as any,
                  width: dot.size,
                  height: dot.size,
                  borderRadius: dot.size / 2,
                  opacity: dot.opacity,
                },
              ]}
            />
          ))}
        </View>

        <Text style={s.heroEyebrow}>Náš príbeh</Text>
        <Text style={s.heroTitle}>{Copy.loveStory.title}</Text>
        <View style={{ width: '70%', marginVertical: Spacing.md }}>
          <OrnamentDivider />
        </View>
        <Text style={s.heroSub}>{Copy.loveStory.subtitle}</Text>
      </LinearGradient>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <View style={s.timeline}>
        {events.map((event, idx) => {
          const dotColor = DOT_COLORS[idx % DOT_COLORS.length];
          const isLast = idx === events.length - 1;
          return (
            <View key={event.id} style={s.eventRow}>

              {/* Left column: dot + line */}
              <View style={s.dotColumn}>
                <View style={[s.dot, { backgroundColor: dotColor }]}>
                  <View style={s.dotInner} />
                </View>
                {!isLast && <View style={[s.line, { backgroundColor: dotColor + '40' }]} />}
              </View>

              {/* Right column: card */}
              <View style={s.cardWrap}>
                <LinearGradient
                  colors={isLast
                    ? [Colors.primaryFixed, '#fedf9f']
                    : [Colors.surface, Colors.surface]}
                  style={s.card}
                >
                  <Text style={[s.eventDate, { color: dotColor }]}>
                    {formatEventDate(event.eventDate)}
                  </Text>
                  <Text style={s.eventTitle}>{event.title}</Text>
                  {event.description ? (
                    <Text style={s.eventDesc}>{event.description}</Text>
                  ) : null}
                  {(event as any).imageUrl ? (
                    <Image
                      source={{ uri: (event as any).imageUrl }}
                      style={s.eventImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <LinearGradient
                      colors={[dotColor + '22', dotColor + '08']}
                      style={s.imagePlaceholder}
                    >
                      <Text style={s.imagePlaceholderEmoji}>
                        {idx === 0 ? '💬' : idx % 3 === 1 ? '✈️' : idx % 3 === 2 ? '💑' : '📸'}
                      </Text>
                      <Text style={[s.imagePlaceholderText, { color: dotColor }]}>
                        {event.title}
                      </Text>
                    </LinearGradient>
                  )}
                  {isLast && (
                    <View style={s.lastBadge}>
                      <Text style={s.lastBadgeText}>♥ Pokračovanie nasleduje…</Text>
                    </View>
                  )}
                </LinearGradient>
              </View>

            </View>
          );
        })}
      </View>

      {/* ── Footer ────────────────────────────────────────────── */}
      <View style={s.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.outlineVariant }} />
          <Text style={{ color: Colors.primaryContainer, fontSize: 10, letterSpacing: 6 }}>✦ ✦ ✦</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.outlineVariant }} />
        </View>
        <Text style={s.footerText}>Maťka &amp; Dušan · 5.9.2026</Text>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Hero
  hero: {
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bokehWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  bokehDot: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  heroEyebrow: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 38,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    maxWidth: 280,
  },

  // Timeline
  timeline: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: 0,
  },

  // Dot + line column
  dotColumn: {
    alignItems: 'center',
    width: 20,
    paddingTop: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginTop: 6,
    borderRadius: 1,
  },

  // Card
  cardWrap: {
    flex: 1,
    paddingBottom: Spacing.lg,
  },
  card: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.card,
  },
  eventDate: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
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
  eventImage: {
    width: '100%',
    height: 180,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLow,
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  imagePlaceholderEmoji: { fontSize: 28 },
  imagePlaceholderText: {
    fontFamily: Typography.headingItalic,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
  lastBadge: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  lastBadgeText: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  footerText: {
    fontFamily: Typography.heading,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.3,
    marginTop: Spacing.sm,
  },
});

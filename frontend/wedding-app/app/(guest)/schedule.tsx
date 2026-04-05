import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
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
import type { ScheduleItem } from '../../types/api';

const DOT_COLORS = [Colors.secondary, Colors.primary, Colors.tertiary, '#c0504d', Colors.secondary, Colors.primary];

// Emoji icons for common schedule event types (matched by title keywords)
function getEventEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('príchod') || t.includes('privítan')) return '🚗';
  if (t.includes('obrad') || t.includes('svadobn')) return '💍';
  if (t.includes('foto') || t.includes('fotograf')) return '📸';
  if (t.includes('raut') || t.includes('koktail')) return '🥂';
  if (t.includes('obed') || t.includes('večer') || t.includes('hostina')) return '🍽️';
  if (t.includes('torta') || t.includes('dort')) return '🎂';
  if (t.includes('tanec') || t.includes('prvý tanec')) return '💃';
  if (t.includes('hudba') || t.includes('zábava') || t.includes('dj')) return '🎵';
  if (t.includes('ohňostroj') || t.includes('prekvapenie')) return '🎆';
  if (t.includes('polnoc') || t.includes('koniec')) return '🌙';
  return '✦';
}

function AnimatedMapPin() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 600, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[s.pinBadge, style]}>
      <Text style={s.pinEmoji}>📍</Text>
    </Animated.View>
  );
}

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
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#2a1f0a', '#3e2e0e', '#516351']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={s.hero}
      >
        {/* Decorative bokeh */}
        <View style={s.bokehWrap} pointerEvents="none">
          {[
            { top: 10, left: '5%', size: 80, opacity: 0.04 },
            { top: 60, right: '10%', size: 60, opacity: 0.05 },
            { bottom: 20, left: '40%', size: 40, opacity: 0.03 },
          ].map((d, i) => (
            <View
              key={i}
              style={[s.bokehDot, {
                top: d.top as any, left: d.left as any, right: (d as any).right,
                bottom: (d as any).bottom, width: d.size, height: d.size,
                borderRadius: d.size / 2, opacity: d.opacity,
              }]}
            />
          ))}
        </View>

        <AnimatedMapPin />
        <Text style={s.heroEyebrow}>5. september 2026</Text>
        <Text style={s.heroTitle}>{Copy.schedule.title}</Text>
        <View style={s.heroDividerRow}>
          <View style={s.heroDividerLine} />
          <Text style={s.heroDividerDots}>✦ ✦ ✦</Text>
          <View style={s.heroDividerLine} />
        </View>
        <Text style={s.heroSub}>{Copy.schedule.subtitle}</Text>

        {/* Venue badge */}
        <View style={s.venueBadge}>
          <Text style={s.venueText}>📍 Penzión Zemiansky Dvor, Šúrovce</Text>
        </View>
      </LinearGradient>

      {/* ── Timeline ───────────────────────────────────────────── */}
      <View style={s.timeline}>
        {items.map((item, idx) => {
          const dotColor = DOT_COLORS[idx % DOT_COLORS.length];
          const isLast = idx === items.length - 1;
          const emoji = getEventEmoji(item.title);
          return (
            <View key={item.id} style={s.eventRow}>

              {/* Dot + line column */}
              <View style={s.dotColumn}>
                <View style={[s.dot, { backgroundColor: dotColor }]}>
                  <View style={s.dotInner} />
                </View>
                {!isLast && <View style={[s.line, { backgroundColor: dotColor + '30' }]} />}
              </View>

              {/* Card */}
              <View style={s.cardWrap}>
                <View style={s.card}>
                  <View style={s.cardTop}>
                    <View style={[s.timePill, { backgroundColor: `${dotColor}18` }]}>
                      <Text style={[s.timeText, { color: dotColor }]}>{item.timeLabel}</Text>
                    </View>
                    <Text style={s.emojiIcon}>{emoji}</Text>
                  </View>
                  <Text style={s.itemTitle}>{item.title}</Text>
                  {item.description ? (
                    <Text style={s.itemDesc}>{item.description}</Text>
                  ) : null}
                </View>
              </View>

            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={s.footer}>
        <View style={s.footerDivider} />
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
  bokehWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bokehDot: { position: 'absolute', backgroundColor: '#fff' },
  pinBadge: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  pinEmoji: { fontSize: 26 },
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
  heroDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '70%',
    marginVertical: Spacing.md,
  },
  heroDividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  heroDividerDots: { color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: 6 },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    maxWidth: 280,
  },
  venueBadge: {
    marginTop: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  venueText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.2,
  },

  // Timeline
  timeline: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dotColumn: {
    alignItems: 'center',
    width: 20,
    paddingTop: 18,
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
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 16,
    marginTop: 6,
    borderRadius: 1,
  },
  cardWrap: {
    flex: 1,
    paddingBottom: Spacing.lg,
  },
  card: {
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
  emojiIcon: {
    fontSize: 18,
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

  // Footer
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  footerDivider: {
    flexDirection: 'row' as any,
    width: '100%',
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  footerText: {
    fontFamily: Typography.heading,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.3,
    marginTop: Spacing.xs,
  },
});
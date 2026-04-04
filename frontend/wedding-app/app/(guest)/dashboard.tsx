import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useAuth } from '../../store/AuthContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { FeatureFlag } from '../../types/api';

// ─── Countdown hook ──────────────────────────────────────────────────────────
const WEDDING_DATE = new Date('2026-09-05T13:30:00Z'); // 15:30 CEST

function useCountdown() {
  const [diff, setDiff] = useState(WEDDING_DATE.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(WEDDING_DATE.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const total = Math.max(0, diff);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
  };
}

// ─── Animated Monogram ────────────────────────────────────────────────────────
function AnimatedMonogram() {
  const ring1 = useSharedValue(0.85);
  const ring2 = useSharedValue(0.7);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    ring1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.85, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    ring2.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 700, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 500, easing: Easing.in(Easing.quad) }),
        withTiming(1.1, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 400, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1400 }), // pause
      ),
      -1,
    );
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: interpolate(ring1.value, [0.7, 1], [0.08, 0.18]),
    transform: [{ scale: ring1.value }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: interpolate(ring2.value, [0.7, 1], [0.12, 0.25]),
    transform: [{ scale: ring2.value }],
  }));
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <View style={mono.container}>
      {/* Outer pulsing rings */}
      <Animated.View style={[mono.ring, mono.ring1, ring1Style]} />
      <Animated.View style={[mono.ring, mono.ring2, ring2Style]} />

      {/* Core circle */}
      <LinearGradient
        colors={['#fedf9f', '#e0c385', '#c0a469']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={mono.core}
      >
        {/* Replace this Image with the actual couple photo */}
        <Image
          source={require('../../assets/icon.png')}
          style={mono.photo}
          resizeMode="cover"
        />
      </LinearGradient>

      {/* Animated heart */}
      <Animated.View style={[mono.heartBadge, heartStyle]}>
        <Text style={mono.heartText}>♥</Text>
      </Animated.View>
    </View>
  );
}

const mono = StyleSheet.create({
  container: {
    width: 148,
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  ring: {
    position: 'absolute',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
  },
  ring1: { width: 148, height: 148 },
  ring2: { width: 172, height: 172 },
  core: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
  },
  heartBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore
    boxShadow: '0 2px 8px rgba(114,91,40,0.25)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  heartText: {
    fontSize: 14,
    color: '#c0504d',
    lineHeight: 16,
  },
});

// ─── Decorative Ornament ─────────────────────────────────────────────────────
function OrnamentDivider({ light }: { light?: boolean }) {
  const lineColor = light ? 'rgba(255,255,255,0.35)' : Colors.outlineVariant;
  const dotColor = light ? 'rgba(255,255,255,0.7)' : Colors.primaryContainer;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
      <View style={{ flex: 1, height: 1, backgroundColor: lineColor }} />
      <Text style={{ color: dotColor, fontSize: 10, letterSpacing: 6 }}>✦ ✦ ✦</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: lineColor }} />
    </View>
  );
}

// ─── Feature grid config ─────────────────────────────────────────────────────
type FeatherIcon = React.ComponentProps<typeof Feather>['name'];

type DashboardFeature = {
  key: string;
  title: string;
  description: string;
  icon: FeatherIcon;
  iconBg: string;
  iconColor: string;
  gradientColors: readonly [string, string];
  route: string;
  flagKey?: string;
  lockLabel?: string;
};

const FEATURES: DashboardFeature[] = [
  {
    key: 'schedule',
    title: Copy.features.schedule,
    description: Copy.features.scheduleDesc,
    icon: 'calendar',
    iconBg: Colors.secondaryContainer,
    iconColor: Colors.secondary,
    gradientColors: ['#eef5ed', '#d4e8d1'],
    route: '/(guest)/schedule',
  },
  {
    key: 'questionnaire',
    title: Copy.features.questionnaire,
    description: Copy.features.questionnaireDesc,
    icon: 'edit-3',
    iconBg: Colors.primaryFixed,
    iconColor: Colors.primary,
    gradientColors: ['#fff8e8', '#fedf9f'],
    route: '/(guest)/questionnaire',
    flagKey: 'questionnaire',
  },
  {
    key: 'parking',
    title: Copy.features.parking,
    description: Copy.features.parkingDesc,
    icon: 'map-pin',
    iconBg: Colors.primaryFixed,
    iconColor: Colors.primary,
    gradientColors: ['#fff8e8', '#fedf9f'],
    route: '/(guest)/parking',
  },
  {
    key: 'accommodation',
    title: Copy.features.accommodation,
    description: Copy.features.accommodationDesc,
    icon: 'home',
    iconBg: Colors.secondaryContainer,
    iconColor: Colors.secondary,
    gradientColors: ['#eef5ed', '#d4e8d1'],
    route: '/(guest)/accommodation',
  },
  {
    key: 'playlist',
    title: Copy.features.playlist,
    description: Copy.features.playlistDesc,
    icon: 'music',
    iconBg: Colors.secondaryContainer,
    iconColor: Colors.secondary,
    gradientColors: ['#eef5ed', '#d4e8d1'],
    route: '/(guest)/playlist',
  },
  {
    key: 'love_story',
    title: Copy.features.loveStory,
    description: Copy.features.loveStoryDesc,
    icon: 'heart',
    iconBg: '#fde8e8',
    iconColor: '#c0504d',
    gradientColors: ['#fff0f0', '#fde8e8'],
    route: '/(guest)/love-story',
    flagKey: 'love_story',
  },
  {
    key: 'menu',
    title: Copy.features.menu,
    description: Copy.features.menuDesc,
    icon: 'book-open',
    iconBg: Colors.primaryFixed,
    iconColor: Colors.primary,
    gradientColors: ['#fff8e8', '#fedf9f'],
    route: '/(guest)/menu',
  },
  {
    key: 'seating',
    title: Copy.features.seating,
    description: Copy.features.seatingDesc,
    icon: 'grid',
    iconBg: Colors.surfaceContainerLow,
    iconColor: Colors.onSurfaceVariant,
    gradientColors: [Colors.surfaceContainerLow, Colors.surfaceContainer],
    route: '/(guest)/seating',
    flagKey: 'seating',
    lockLabel: Copy.dashboard.weddingDay,
  },
  {
    key: 'photo_upload',
    title: Copy.features.photos,
    description: Copy.features.photosDesc,
    icon: 'camera',
    iconBg: Colors.surfaceContainerLow,
    iconColor: Colors.onSurfaceVariant,
    gradientColors: [Colors.surfaceContainerLow, Colors.surfaceContainer],
    route: '/(guest)/photo-upload',
    flagKey: 'photo_upload',
    lockLabel: Copy.dashboard.weddingDay,
  },
  {
    key: 'photo_bingo',
    title: Copy.features.bingo,
    description: Copy.features.bingoDesc,
    icon: 'target',
    iconBg: Colors.surfaceContainerLow,
    iconColor: Colors.onSurfaceVariant,
    gradientColors: [Colors.surfaceContainerLow, Colors.surfaceContainer],
    route: '/(guest)/bingo',
    flagKey: 'photo_bingo',
    lockLabel: Copy.dashboard.weddingDay,
  },
  {
    key: 'gallery',
    title: Copy.features.gallery,
    description: Copy.features.galleryDesc,
    icon: 'image',
    iconBg: Colors.surfaceContainerLow,
    iconColor: Colors.onSurfaceVariant,
    gradientColors: [Colors.surfaceContainerLow, Colors.surfaceContainer],
    route: '/(guest)/gallery',
    flagKey: 'gallery',
    lockLabel: Copy.dashboard.afterWedding,
  },
  {
    key: 'thank_you',
    title: Copy.features.thankYou,
    description: Copy.features.thankYouDesc,
    icon: 'mail',
    iconBg: Colors.surfaceContainerLow,
    iconColor: Colors.onSurfaceVariant,
    gradientColors: [Colors.surfaceContainerLow, Colors.surfaceContainer],
    route: '/(guest)/thank-you',
    flagKey: 'thank_you',
    lockLabel: Copy.dashboard.afterWedding,
  },
];

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const cd = useCountdown();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 768;

  const { data: flags = [] } = useQuery<FeatureFlag[]>({
    queryKey: ['feature-flags'],
    queryFn: async () => (await apiClient.get('/feature-flags')).data,
  });
  const flagsByKey = new Map(flags.map((f) => [f.key, f]));

  const isEnabled = (f: DashboardFeature) => {
    if (!f.flagKey) return true;
    return flagsByKey.get(f.flagKey)?.isEnabled ?? false;
  };

  const lockLabel = (f: DashboardFeature) => {
    if (!f.flagKey) return null;
    const flag = flagsByKey.get(f.flagKey);
    if (flag?.isEnabled) return null;
    if (f.lockLabel) return f.lockLabel;
    if (flag?.availableFrom)
      return `${Copy.dashboard.lockedUntil} ${new Date(flag.availableFrom).toLocaleDateString('sk-SK')}`;
    return Copy.dashboard.lockedSoon;
  };

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={[s.content, isWide && s.contentWide]}>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#2a1f0a', '#4a3515', '#725b28']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={s.hero}
        >
          {/* Decorative background texture dots */}
          <View style={s.heroPatternRow} pointerEvents="none">
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={i} style={s.heroDot} />
            ))}
          </View>

          {/* Top bar: greeting + logout */}
          <View style={s.heroTopBar}>
            <Text style={s.heroGreeting}>Vitaj, {user?.guestName?.split(' ')[0]}</Text>
            <TouchableOpacity style={s.logoutBtn} onPress={logout} activeOpacity={0.7}>
              <Feather name="log-out" size={14} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          {/* Couple monogram */}
          <AnimatedMonogram />

          {/* Couple names */}
          <Text style={s.heroNames}>Maťka &amp; Dušan</Text>
          <View style={{ marginVertical: Spacing.md, width: '80%' }}>
            <OrnamentDivider light />
          </View>
          <Text style={s.heroDateText}>{Copy.dashboard.weddingDate}</Text>
          <Text style={s.heroVenueText}>{Copy.dashboard.weddingVenue}</Text>

          {/* Countdown */}
          <View style={s.countdownSection}>
            <Text style={s.countdownLabel}>{Copy.dashboard.countdown}</Text>
            <View style={s.cdRow}>
              {([
                [cd.days, Copy.dashboard.days],
                [cd.hours, Copy.dashboard.hours],
                [cd.minutes, Copy.dashboard.minutes],
                [cd.seconds, Copy.dashboard.seconds],
              ] as const).map(([val, label]) => (
                <View key={label} style={s.cdUnit}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.06)']}
                    style={s.cdBox}
                  >
                    <Text style={s.cdNumber}>{String(val).padStart(2, '0')}</Text>
                  </LinearGradient>
                  <Text style={s.cdLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* ── Feature grid ──────────────────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Čo na teba čaká</Text>
          <OrnamentDivider />
        </View>

        <View style={s.grid}>
          {FEATURES.map((f) => {
            const on = isEnabled(f);
            const lock = lockLabel(f);
            return (
              <TouchableOpacity
                key={f.key}
                style={[s.tile, isWide && s.tileWide, !on && s.tileLocked]}
                activeOpacity={on ? 0.72 : 1}
                onPress={() => on && router.push(f.route as never)}
                disabled={!on}
              >
                <LinearGradient
                  colors={on ? f.gradientColors : [Colors.surfaceContainerLow, Colors.surfaceContainerLow]}
                  style={s.tileGradient}
                >
                  {/* Icon */}
                  <View style={[s.iconWrap, { backgroundColor: on ? f.iconBg : Colors.surfaceContainerHigh }]}>
                    <Feather name={f.icon} size={20} color={on ? f.iconColor : Colors.onSurfaceVariant} />
                  </View>

                  {/* Lock chip */}
                  {!on && (
                    <View style={s.chipLocked}>
                      <Feather name="lock" size={9} color={Colors.onSurfaceVariant} />
                      <Text style={s.chipLockedText}>{lock ?? Copy.dashboard.locked}</Text>
                    </View>
                  )}

                  <Text style={[s.tileTitle, !on && s.tileTitleLocked]} numberOfLines={1}>{f.title}</Text>
                  <Text style={s.tileSub} numberOfLines={2}>{f.description}</Text>

                  {on && (
                    <View style={s.tileCta}>
                      <Feather name="arrow-right" size={13} color={f.iconColor} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {/* Admin shortcut */}
          {(user?.role === 'Admin' || user?.role === 'MasterOfCeremony') && (
            <TouchableOpacity
              style={[s.tile, isWide && s.tileWide]}
              activeOpacity={0.72}
              onPress={() => router.push('/(admin)/dashboard' as never)}
            >
              <LinearGradient colors={['#fff8e8', '#fedf9f']} style={s.tileGradient}>
                <View style={[s.iconWrap, { backgroundColor: Colors.primaryFixed }]}>
                  <Feather name="settings" size={20} color={Colors.primary} />
                </View>
                <Text style={s.tileTitle}>{Copy.admin.title}</Text>
                <Text style={s.tileSub}>Správa hostí, obsah, funkcie.</Text>
                <View style={s.tileCta}>
                  <Feather name="arrow-right" size={13} color={Colors.primary} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Calendar banner ───────────────────────────────────── */}
        <TouchableOpacity
          style={s.banner}
          activeOpacity={0.8}
          onPress={() => {
            Linking.openURL(
              'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Svadba+Matky+a+Dusana&dates=20260905T133000Z/20260905T230000Z&location=Penzion+Zemiansky+Dvor,+Surovce&details=Tesime+sa+na+teba+na+svadbe.'
            ).catch(() => undefined);
          }}
        >
          <LinearGradient colors={['#fedf9f', '#e0c385']} style={s.bannerGradient}>
            <View style={s.bannerRow}>
              <View style={s.bannerIconWrap}>
                <Feather name="calendar" size={18} color={Colors.primary} />
              </View>
              <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                <Text style={s.bannerTitle}>{Copy.dashboard.addToCalendar}</Text>
                <Text style={s.bannerSub}>{Copy.dashboard.addToCalendarSubtitle}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.primary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Footer signature ─────────────────────────────────── */}
        <View style={s.footer}>
          <OrnamentDivider />
          <Text style={s.footerText}>Maťka &amp; Dušan · 5.9.2026</Text>
          <Text style={s.footerVenue}>Penzión Zemiansky Dvor, Šúrovce</Text>
        </View>

      </View>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  contentWide: {
    maxWidth: 960,
    alignSelf: 'center' as any,
    width: '100%',
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroPatternRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.04,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    margin: 14,
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xl,
  },
  heroGreeting: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.3,
  },
  logoutBtn: {
    padding: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroNames: {
    fontFamily: Typography.heading,
    fontSize: 34,
    color: '#fff',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroDateText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.sm,
    letterSpacing: 0.5,
  },
  heroVenueText: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
    letterSpacing: 0.2,
  },

  // Countdown inside hero
  countdownSection: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  countdownLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: Spacing.md,
  },
  cdRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  cdUnit: {
    alignItems: 'center',
    minWidth: 64,
  },
  cdBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cdNumber: {
    fontFamily: Typography.heading,
    fontSize: 30,
    color: '#fff',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  cdLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 8,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 6,
  },

  // ── Section header ───────────────────────────────────────────────────────
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },

  // ── Feature grid ─────────────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tile: {
    width: '47.5%' as any,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  tileWide: { width: '23%' as any },
  tileLocked: {
    shadowOpacity: 0,
    elevation: 0,
  },
  tileGradient: {
    padding: Spacing.md,
    minHeight: 148,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  chipLocked: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: Spacing.xs,
  },
  chipLockedText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 8,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  tileTitle: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 20,
    marginBottom: 4,
  },
  tileTitleLocked: { color: Colors.onSurfaceVariant },
  tileSub: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
    flex: 1,
  },
  tileCta: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },

  // ── Calendar banner ──────────────────────────────────────────────────────
  banner: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  bannerGradient: {
    padding: Spacing.md,
  },
  bannerRow: { flexDirection: 'row', alignItems: 'center' },
  bannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 14,
    color: '#3d2a00',
    lineHeight: 20,
  },
  bannerSub: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: '#6b4f12',
    marginTop: 2,
    lineHeight: 18,
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  footerText: {
    fontFamily: Typography.heading,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.3,
    marginTop: Spacing.sm,
  },
  footerVenue: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.outline,
    letterSpacing: 0.2,
  },
});

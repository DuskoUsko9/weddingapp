import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

// ─── Feature grid config ─────────────────────────────────────────────────────
type FeatherIcon = React.ComponentProps<typeof Feather>['name'];

type DashboardFeature = {
  key: string;
  title: string;
  description: string;
  icon: FeatherIcon;
  iconBg: string;
  iconColor: string;
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
    route: '/(guest)/schedule',
  },
  {
    key: 'questionnaire',
    title: Copy.features.questionnaire,
    description: Copy.features.questionnaireDesc,
    icon: 'edit-3',
    iconBg: Colors.primaryFixed,
    iconColor: Colors.primary,
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
    route: '/(guest)/parking',
  },
  {
    key: 'accommodation',
    title: Copy.features.accommodation,
    description: Copy.features.accommodationDesc,
    icon: 'home',
    iconBg: Colors.secondaryContainer,
    iconColor: Colors.secondary,
    route: '/(guest)/accommodation',
  },
  {
    key: 'playlist',
    title: Copy.features.playlist,
    description: Copy.features.playlistDesc,
    icon: 'music',
    iconBg: Colors.secondaryContainer,
    iconColor: Colors.secondary,
    route: '/(guest)/playlist',
  },
  {
    key: 'love_story',
    title: Copy.features.loveStory,
    description: Copy.features.loveStoryDesc,
    icon: 'heart',
    iconBg: '#fde8e8',
    iconColor: '#c0504d',
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
    route: '/(guest)/menu',
  },
  {
    key: 'seating',
    title: Copy.features.seating,
    description: Copy.features.seatingDesc,
    icon: 'grid',
    iconBg: Colors.surfaceContainerLow,
    iconColor: Colors.onSurfaceVariant,
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
  // Wide = desktop browser or large tablet; use 4-column grid and centered content
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
    <ScrollView style={s.scroll}>
      <View style={[s.content, isWide && s.contentWide]}>

      {/* ── Header ────────────────────────────────────────────── */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Vitaj,</Text>
          <Text style={s.userName}>{user?.guestName}</Text>
        </View>
        <TouchableOpacity style={s.monogram} onPress={logout} activeOpacity={0.7}>
          <Text style={s.monogramText}>M&D</Text>
        </TouchableOpacity>
      </View>

      {/* ── Countdown — Hero Card ─────────────────────────────── */}
      <LinearGradient colors={['#faf9f6', '#f0ede8']} style={s.hero}>
        <Text style={s.heroLabel}>{Copy.dashboard.countdown}</Text>
        <View style={s.cdRow}>
          {([
            [cd.days, Copy.dashboard.days],
            [cd.hours, Copy.dashboard.hours],
            [cd.minutes, Copy.dashboard.minutes],
            [cd.seconds, Copy.dashboard.seconds],
          ] as const).map(([val, label]) => (
            <View key={label} style={s.cdUnit}>
              <Text style={s.cdNumber}>{String(val).padStart(2, '0')}</Text>
              <Text style={s.cdLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={s.heroDivider} />
        <Text style={s.heroDate}>{Copy.dashboard.weddingDate}</Text>
        <Text style={s.heroVenue}>{Copy.dashboard.weddingVenue}</Text>
      </LinearGradient>

      {/* ── Feature grid ──────────────────────────────────────── */}
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
              {/* Icon */}
              <View style={[s.iconWrap, { backgroundColor: on ? f.iconBg : Colors.surfaceContainerLow }]}>
                <Feather name={f.icon} size={22} color={on ? f.iconColor : Colors.onSurfaceVariant} />
              </View>

              {/* Status chip */}
              {on
                ? <View style={s.chipAvailable}>
                    <Text style={s.chipAvailableText}>{Copy.dashboard.available}</Text>
                  </View>
                : <View style={s.chipLocked}>
                    <Feather name="lock" size={9} color={Colors.onSurfaceVariant} />
                    <Text style={s.chipLockedText}>{lock ?? Copy.dashboard.locked}</Text>
                  </View>
              }

              {/* Title + desc */}
              <Text style={[s.tileTitle, !on && s.tileTitleLocked]} numberOfLines={1}>{f.title}</Text>
              <Text style={s.tileSub} numberOfLines={2}>{f.description}</Text>

              {/* CTA */}
              {on && (
                <View style={s.tileCta}>
                  <Feather name="chevron-right" size={14} color={Colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Admin shortcut */}
        {(user?.role === 'Admin' || user?.role === 'MasterOfCeremony') && (
          <TouchableOpacity
            style={[s.tile, isWide && s.tileWide, s.tileAdmin]}
            activeOpacity={0.72}
            onPress={() => router.push('/(admin)/dashboard' as never)}
          >
            <View style={[s.iconWrap, { backgroundColor: Colors.primaryFixed }]}>
              <Feather name="settings" size={22} color={Colors.primary} />
            </View>
            <View style={s.chipAvailable}>
              <Text style={s.chipAvailableText}>{Copy.dashboard.available}</Text>
            </View>
            <Text style={s.tileTitle}>{Copy.admin.title}</Text>
            <Text style={s.tileSub}>Správa hostí, obsah, funkcie.</Text>
            <View style={s.tileCta}>
              <Feather name="chevron-right" size={14} color={Colors.primary} />
            </View>
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
      </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingTop: Spacing.gallery, paddingBottom: Spacing.xxl },
  // On wide screens: center content and constrain max width for readability
  contentWide: {
    maxWidth: 960,
    alignSelf: 'center' as any,
    width: '100%',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontFamily: Typography.heading,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.2,
  },
  userName: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
    lineHeight: 36,
    letterSpacing: 0.2,
  },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: { fontFamily: Typography.heading, fontSize: 12, color: Colors.primary },

  // Hero countdown
  hero: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  cdRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  cdUnit: { alignItems: 'center', minWidth: 60 },
  cdNumber: {
    fontFamily: Typography.heading,
    fontSize: 40,
    color: Colors.onSurface,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  cdLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 2,
  },
  heroDivider: {
    width: 32,
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginBottom: Spacing.sm,
  },
  heroDate: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  heroVenue: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 18,
  },

  // Feature grid — 2 columns
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tile: {
    width: '47.5%' as any,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    minHeight: 160,
    ...Shadow.card,
  },
  // 4-column layout on wide screens
  tileWide: {
    width: '23%' as any,
  },
  tileLocked: {
    backgroundColor: Colors.surfaceContainerLow,
    shadowOpacity: 0,
    elevation: 0,
  },
  tileAdmin: {
    backgroundColor: Colors.surface,
  },

  // Icon
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  // Status chips
  chipAvailable: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: Spacing.sm,
  },
  chipAvailableText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 9,
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chipLocked: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: Spacing.sm,
  },
  chipLockedText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Tile text
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

  // Calendar banner
  banner: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.card,
    padding: Spacing.md,
  },
  bannerRow: { flexDirection: 'row', alignItems: 'center' },
  bannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 14,
    color: '#4d3a08',
    lineHeight: 20,
  },
  bannerSub: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 18,
  },
});
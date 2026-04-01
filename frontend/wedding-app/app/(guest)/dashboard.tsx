import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../store/AuthContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { FeatureFlag } from '../../types/api';

const WEDDING_DATE = new Date('2026-09-05T13:30:00Z'); // 15:30 CEST = 13:30 UTC

function useCountdown() {
  const [diff, setDiff] = useState(WEDDING_DATE.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setDiff(WEDDING_DATE.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const total = Math.max(0, diff);
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

const FEATURE_ROUTES: Record<string, string> = {
  schedule: '/(guest)/schedule',
  menu: '/(guest)/menu',
  parking: '/(guest)/parking',
  accommodation: '/(guest)/accommodation',
  questionnaire: '/(guest)/questionnaire',
  playlist: '/(guest)/playlist',
  seating: '/(guest)/seating',
  photo_upload: '/(guest)/photos',
  photo_bingo: '/(guest)/bingo',
  gallery: '/(guest)/gallery',
  love_story: '/(guest)/love-story',
  thank_you: '/(guest)/thank-you',
};

const FEATURE_LABELS: Record<string, string> = {
  schedule: Copy.features.schedule,
  menu: Copy.features.menu,
  parking: Copy.features.parking,
  accommodation: Copy.features.accommodation,
  questionnaire: Copy.features.questionnaire,
  playlist: Copy.features.playlist,
  seating: Copy.features.seating,
  photo_upload: Copy.features.photos,
  photo_bingo: Copy.features.bingo,
  gallery: Copy.features.gallery,
  love_story: Copy.features.loveStory,
  thank_you: Copy.features.thankYou,
};

const FEATURE_ICONS: Record<string, string> = {
  schedule: '📋',
  menu: '🍽️',
  parking: '🚗',
  accommodation: '🏨',
  questionnaire: '📝',
  playlist: '🎵',
  seating: '💺',
  photo_upload: '📷',
  photo_bingo: '🎯',
  gallery: '🖼️',
  love_story: '💑',
  thank_you: '💌',
};

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const countdown = useCountdown();

  const { data: flags = [] } = useQuery<FeatureFlag[]>({
    queryKey: ['feature-flags'],
    queryFn: async () => (await apiClient.get('/feature-flags')).data,
  });

  const enabledFlags = flags.filter((f) => f.isEnabled);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{Copy.dashboard.title}</Text>
        <Text style={styles.userName}>{user?.guestName}</Text>
      </View>

      {/* Countdown */}
      <View style={styles.countdownCard}>
        <Text style={styles.countdownLabel}>{Copy.dashboard.countdown}</Text>
        <View style={styles.countdownRow}>
          {[
            { value: countdown.days, label: Copy.dashboard.days },
            { value: countdown.hours, label: Copy.dashboard.hours },
            { value: countdown.minutes, label: Copy.dashboard.minutes },
            { value: countdown.seconds, label: Copy.dashboard.seconds },
          ].map(({ value, label }) => (
            <View key={label} style={styles.countdownUnit}>
              <Text style={styles.countdownNumber}>{String(value).padStart(2, '0')}</Text>
              <Text style={styles.countdownUnitLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.weddingDate}>{Copy.dashboard.weddingDate}</Text>
        <Text style={styles.weddingVenue}>{Copy.dashboard.weddingVenue}</Text>
      </View>

      {/* Feature grid */}
      <View style={styles.grid}>
        {enabledFlags.map((flag) => {
          const route = FEATURE_ROUTES[flag.key];
          const label = FEATURE_LABELS[flag.key];
          const icon = FEATURE_ICONS[flag.key];
          if (!route || !label) return null;

          return (
            <TouchableOpacity
              key={flag.key}
              style={styles.featureCard}
              onPress={() => router.push(route as never)}
            >
              <Text style={styles.featureIcon}>{icon}</Text>
              <Text style={styles.featureLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Admin link */}
        {(user?.role === 'Admin' || user?.role === 'MasterOfCeremony') && (
          <TouchableOpacity
            style={[styles.featureCard, styles.adminCard]}
            onPress={() => router.push('/(admin)/dashboard' as never)}
          >
            <Text style={styles.featureIcon}>⚙️</Text>
            <Text style={styles.featureLabel}>{Copy.admin.title}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Odhlásiť sa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  header: { marginBottom: Spacing.lg, paddingTop: Spacing.md },
  greeting: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.textPrimary,
  },
  userName: {
    fontFamily: Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  countdownCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadow.card,
  },
  countdownLabel: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  countdownRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  countdownUnit: { alignItems: 'center', minWidth: 56 },
  countdownNumber: {
    fontFamily: Typography.heading,
    fontSize: 32,
    color: Colors.primary,
    lineHeight: 38,
  },
  countdownUnitLabel: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weddingDate: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  weddingVenue: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  featureCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
    ...Shadow.card,
  },
  adminCard: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  featureIcon: { fontSize: 28, marginBottom: Spacing.sm },
  featureLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  logoutButton: { marginTop: Spacing.xl, alignItems: 'center' },
  logoutText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

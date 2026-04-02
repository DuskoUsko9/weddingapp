import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { AdminStats } from '../../types/api';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 768;

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => (await apiClient.get('/admin/stats')).data,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, isWide && styles.contentWide]}>
      <Text style={styles.title}>{Copy.admin.title}</Text>

      {/* Stats */}
      {isLoading
        ? <ActivityIndicator color={Colors.primary} />
        : stats && (
          <View style={styles.statsGrid}>
            {[
              { label: 'Celkom hostí', value: stats.totalGuests },
              { label: Copy.admin.attending, value: stats.attending },
              { label: Copy.admin.notAttending, value: stats.notAttending },
              { label: 'Čaká na dotazník', value: stats.pendingQuestionnaire },
              { label: 'Hudobné priania', value: stats.totalSongRequests },
              { label: 'Čakajúce priania', value: stats.pendingSongRequests },
            ].map(({ label, value }) => (
              <View key={label} style={[styles.statCard, isWide && { width: '31%' }]}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        )
      }

      {/* Admin actions */}
      <Text style={styles.sectionTitle}>Správa</Text>
      {[
        { label: '👥 ' + Copy.admin.guests, route: '/(admin)/guests' },
        { label: '🚩 ' + Copy.admin.featureFlags, route: '/(admin)/feature-toggles' },
        { label: '📝 Dotazníky', route: '/(admin)/questionnaire-responses' },
        { label: '🎵 Hudobné priania', route: '/(admin)/song-requests' },
      ].map(({ label, route }) => (
        <TouchableOpacity
          key={route}
          style={styles.menuItem}
          onPress={() => router.push(route as never)}
        >
          <Text style={styles.menuItemText}>{label}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  contentWide: {
    maxWidth: 960,
    alignSelf: 'center' as any,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  statValue: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.primary,
  },
  statLabel: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  menuItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.card,
  },
  menuItemText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  chevron: {
    fontFamily: Typography.body,
    fontSize: 20,
    color: Colors.textSecondary,
  },
});

import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { SongRequest } from '../../types/api';

type Filter = 'all' | 'Pending' | 'Played' | 'Skipped';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',     label: 'Všetky' },
  { key: 'Pending', label: 'Čakajúce' },
  { key: 'Played',  label: 'Zahrané' },
  { key: 'Skipped', label: 'Preskočené' },
];

function statusColor(st: SongRequest['status']): string {
  if (st === 'Played')  return Colors.secondary;
  if (st === 'Skipped') return Colors.onSurfaceVariant;
  return Colors.primary;
}

function statusBg(st: SongRequest['status']): string {
  if (st === 'Played')  return Colors.secondaryContainer;
  if (st === 'Skipped') return Colors.surfaceContainerLow;
  return Colors.primaryFixed;
}

function statusLabel(st: SongRequest['status']): string {
  if (st === 'Played')  return 'Zahrané';
  if (st === 'Skipped') return 'Preskočené';
  return 'Čaká';
}

export default function AdminSongRequestsScreen() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>('all');

  const { data: requests = [], isLoading } = useQuery<SongRequest[]>({
    queryKey: ['admin-song-requests'],
    queryFn: async () => (await apiClient.get('/song-requests')).data,
  });

  const { mutate } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/song-requests/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-song-requests'] }),
  });

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  const pending = requests.filter((r) => r.status === 'Pending').length;

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  return (
    <FlatList
      style={s.container}
      data={filtered}
      keyExtractor={(r) => r.id}
      contentContainerStyle={s.list}
      ListHeaderComponent={
        <>
          {/* ── Stats row ──────────────────────────────────────── */}
          <View style={s.statsRow}>
            <View style={[s.statChip, { backgroundColor: Colors.primaryFixed }]}>
              <Feather name="music" size={12} color={Colors.primary} />
              <Text style={[s.statChipText, { color: Colors.primary }]}>{requests.length} celkom</Text>
            </View>
            {pending > 0 && (
              <View style={[s.statChip, { backgroundColor: Colors.secondaryContainer }]}>
                <Feather name="clock" size={12} color={Colors.secondary} />
                <Text style={[s.statChipText, { color: Colors.secondary }]}>{pending} čaká na DJ</Text>
              </View>
            )}
          </View>

          {/* ── Filter tabs ────────────────────────────────────── */}
          <View style={s.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[s.filterTab, filter === f.key && s.filterTabActive]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.7}
              >
                <Text style={[s.filterTabText, filter === f.key && s.filterTabTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={s.empty}>
          <Feather name="music" size={32} color={Colors.outlineVariant} />
          <Text style={s.emptyText}>
            {filter === 'all' ? 'Žiadne priania zatiaľ' : `Žiadne ${filter === 'Pending' ? 'čakajúce' : filter === 'Played' ? 'zahrané' : 'preskočené'} priania`}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={s.card}>
          {/* Music icon */}
          <View style={[s.iconWrap, { backgroundColor: statusBg(item.status) }]}>
            <Feather name="music" size={18} color={statusColor(item.status)} />
          </View>

          {/* Content */}
          <View style={s.cardBody}>
            <Text style={s.song}>{item.songName}</Text>
            {item.artist && <Text style={s.artist}>{item.artist}</Text>}
            {item.dedication && (
              <View style={s.dedicationRow}>
                <Feather name="message-circle" size={11} color={Colors.onSurfaceVariant} />
                <Text style={s.dedication}>{item.dedication}</Text>
              </View>
            )}
            <Text style={s.guest}>{item.guestName}</Text>
          </View>

          {/* Right side: status + actions */}
          <View style={s.right}>
            <View style={[s.statusBadge, { backgroundColor: statusBg(item.status) }]}>
              <Text style={[s.statusText, { color: statusColor(item.status) }]}>
                {statusLabel(item.status)}
              </Text>
            </View>

            {item.status === 'Pending' && (
              <View style={s.actions}>
                <TouchableOpacity
                  style={s.playBtn}
                  onPress={() => mutate({ id: item.id, status: 'Played' })}
                  activeOpacity={0.75}
                >
                  <Feather name="check" size={16} color={Colors.onSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.skipBtn}
                  onPress={() => mutate({ id: item.id, status: 'Skipped' })}
                  activeOpacity={0.75}
                >
                  <Feather name="x" size={16} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  // Stats
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  statChipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: Colors.surface,
    ...Shadow.card,
  },
  filterTabText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  filterTabTextActive: {
    color: Colors.onSurface,
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  cardBody: { flex: 1 },
  song: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  artist: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  dedicationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginTop: 5,
  },
  dedication: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 18,
  },
  guest: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.primary,
    marginTop: 5,
  },

  // Right side
  right: { alignItems: 'flex-end', gap: Spacing.sm },
  statusBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  actions: { flexDirection: 'row', gap: Spacing.xs },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

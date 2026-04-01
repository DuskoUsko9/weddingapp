import { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../store/AuthContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { SongRequest } from '../../types/api';

const SIGNALR_URL = process.env.EXPO_PUBLIC_SIGNALR_URL ?? 'http://localhost:5000';

export default function DjQueueScreen() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery<SongRequest[]>({
    queryKey: ['song-requests'],
    queryFn: async () => (await apiClient.get('/song-requests?status=Pending')).data,
    refetchInterval: 15_000,
  });

  // SignalR real-time updates
  useEffect(() => {
    let connection: unknown;
    let active = true;

    const connect = async () => {
      try {
        const signalRModule = (await import('@microsoft/signalr' as never)) as any;
        const { HubConnectionBuilder, LogLevel } = signalRModule;
        const token = user?.token;
        connection = new HubConnectionBuilder()
          .withUrl(`${SIGNALR_URL}/hubs/song-requests`, {
            accessTokenFactory: () => token ?? '',
          })
          .configureLogging(LogLevel.Warning)
          .withAutomaticReconnect()
          .build();

        (connection as { on: (e: string, cb: () => void) => void }).on('NewSongRequest', () => {
          if (active) qc.invalidateQueries({ queryKey: ['song-requests'] });
        });
        (connection as { on: (e: string, cb: () => void) => void }).on('SongRequestUpdated', () => {
          if (active) qc.invalidateQueries({ queryKey: ['song-requests'] });
        });

        await (connection as { start: () => Promise<void> }).start();
      } catch {
        // Polling fallback is active via refetchInterval
      }
    };

    connect();
    return () => {
      active = false;
      if (connection) (connection as { stop: () => void }).stop();
    };
  }, [user?.token]);

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/song-requests/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['song-requests'] }),
  });

  const pending = requests.filter((r) => r.status === 'Pending');

  return (
    <View style={s.container}>

      {/* ── Header ─────────────────────────────────────────── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.liveIndicator}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>{Copy.dj.live}</Text>
          </View>
          <Text style={s.title}>{Copy.dj.title}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={s.logoutBtn} activeOpacity={0.7}>
          <Feather name="log-out" size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* ── Count ──────────────────────────────────────────── */}
      <View style={s.countRow}>
        <Text style={s.countText}>
          {pending.length === 0
            ? Copy.dj.empty
            : `${pending.length} ${pending.length === 1 ? Copy.dj.oneRequest : Copy.dj.requests}`
          }
        </Text>
      </View>

      {/* ── Queue ──────────────────────────────────────────── */}
      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        : (
          <FlatList
            data={pending}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ paddingBottom: Spacing.xxl }}
            ListEmptyComponent={() => (
              <View style={s.emptyState}>
                <View style={s.emptyIconWrap}>
                  <Feather name="music" size={32} color={Colors.onSurfaceVariant} />
                </View>
                <Text style={s.emptyTitle}>{Copy.dj.empty}</Text>
                <Text style={s.emptySubtitle}>Priania sa zobrazia tu v reálnom čase.</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={s.card}>
                <View style={s.cardIcon}>
                  <Feather name="music" size={18} color={Colors.primary} />
                </View>
                <View style={s.cardContent}>
                  <Text style={s.songName}>{item.songName}</Text>
                  {item.artist && <Text style={s.artist}>{item.artist}</Text>}
                  {item.dedication && (
                    <Text style={s.dedication}>"{item.dedication}"</Text>
                  )}
                  <Text style={s.guest}>{Copy.dj.fromGuest} {item.guestName}</Text>
                </View>
                <View style={s.actions}>
                  <TouchableOpacity
                    style={[s.actionBtn, s.playedBtn]}
                    onPress={() => updateStatus({ id: item.id, status: 'Played' })}
                    activeOpacity={0.8}
                  >
                    <Feather name="check" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.actionBtn, s.skipBtn]}
                    onPress={() => updateStatus({ id: item.id, status: 'Skipped' })}
                    activeOpacity={0.8}
                  >
                    <Feather name="x" size={18} color={Colors.onSurface} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )
      }
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.gallery,
    paddingBottom: Spacing.md,
  },
  headerLeft: { flex: 1 },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  liveText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
    letterSpacing: 0.2,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },

  // Count
  countRow: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  countText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  cardContent: { flex: 1 },
  songName: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 16,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  artist: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  dedication: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 20,
  },
  guest: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.primary,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexShrink: 0,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playedBtn: { backgroundColor: Colors.secondary },
  skipBtn: { backgroundColor: Colors.surfaceContainerHigh },
});
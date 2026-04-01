import { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useAuth } from '../../store/AuthContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { SongRequest } from '../../types/api';

const SIGNALR_URL = (Constants.expoConfig?.extra?.signalrUrl as string) ?? 'http://localhost:5000';

export default function DjQueueScreen() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery<SongRequest[]>({
    queryKey: ['song-requests'],
    queryFn: async () => (await apiClient.get('/song-requests?status=Pending')).data,
    refetchInterval: 15_000,
  });

  // SignalR: reconnect on mount (web-compatible)
  useEffect(() => {
    let connection: unknown;
    let active = true;

    const connect = async () => {
      try {
        // Dynamically import to avoid issues when @microsoft/signalr is not installed
        const { HubConnectionBuilder, LogLevel } = await import('@microsoft/signalr' as never);
        const token = user?.token;
        connection = new (HubConnectionBuilder as never)()
          .withUrl(`${SIGNALR_URL}/hubs/song-requests`, {
            accessTokenFactory: () => token ?? '',
          })
          .configureLogging(LogLevel.Warning)
          .withAutomaticReconnect()
          .build();

        (connection as { on: (event: string, cb: () => void) => void }).on('NewSongRequest', () => {
          if (active) qc.invalidateQueries({ queryKey: ['song-requests'] });
        });
        (connection as { on: (event: string, cb: () => void) => void }).on('SongRequestUpdated', () => {
          if (active) qc.invalidateQueries({ queryKey: ['song-requests'] });
        });

        await (connection as { start: () => Promise<void> }).start();
      } catch {
        // SignalR optional — polling fallback is active via refetchInterval
      }
    };

    connect();
    return () => {
      active = false;
      if (connection) {
        (connection as { stop: () => void }).stop();
      }
    };
  }, [user?.token]);

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/song-requests/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['song-requests'] }),
  });

  const pending = requests.filter((r) => r.status === 'Pending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎧 DJ Fronta</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Odhlásiť</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.count}>
        {pending.length === 0 ? 'Žiadne priania' : `${pending.length} prianí`}
      </Text>

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        : (
          <FlatList
            data={pending}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ paddingBottom: Spacing.xxl }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.songName}>{item.songName}</Text>
                  {item.artist && <Text style={styles.artist}>{item.artist}</Text>}
                  {item.dedication && (
                    <Text style={styles.dedication}>💬 {item.dedication}</Text>
                  )}
                  <Text style={styles.guest}>{item.guestName}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.playedBtn]}
                    onPress={() => updateStatus({ id: item.id, status: 'Played' })}
                  >
                    <Text style={styles.actionBtnText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.skipBtn]}
                    onPress={() => updateStatus({ id: item.id, status: 'Skipped' })}
                  >
                    <Text style={styles.actionBtnText}>✕</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.textPrimary,
  },
  logout: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  count: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
  },
  cardContent: { flex: 1 },
  songName: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  artist: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dedication: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  guest: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playedBtn: { backgroundColor: Colors.accent },
  skipBtn: { backgroundColor: Colors.border },
  actionBtnText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});

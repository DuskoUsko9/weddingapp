import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { SongRequest } from '../../types/api';

export default function AdminSongRequestsScreen() {
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery<SongRequest[]>({
    queryKey: ['admin-song-requests'],
    queryFn: async () => (await apiClient.get('/song-requests')).data,
  });

  const { mutate } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/song-requests/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-song-requests'] }),
  });

  const statusColor = (s: SongRequest['status']) => {
    if (s === 'Played') return Colors.accent;
    if (s === 'Skipped') return Colors.textSecondary;
    return Colors.primary;
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={requests}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{ padding: Spacing.md }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <Text style={styles.song}>{item.songName}</Text>
            {item.artist && <Text style={styles.artist}>{item.artist}</Text>}
            {item.dedication && <Text style={styles.dedication}>💬 {item.dedication}</Text>}
            <Text style={styles.guest}>{item.guestName}</Text>
          </View>
          <View style={styles.actions}>
            <Text style={[styles.status, { color: statusColor(item.status) }]}>{item.status}</Text>
            {item.status === 'Pending' && (
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.btn, styles.playedBtn]}
                  onPress={() => mutate({ id: item.id, status: 'Played' })}
                >
                  <Text style={styles.btnText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.skipBtn]}
                  onPress={() => mutate({ id: item.id, status: 'Skipped' })}
                >
                  <Text style={styles.btnText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Shadow.card,
  },
  cardBody: { flex: 1 },
  song: { fontFamily: Typography.bodyMedium, fontSize: 15, color: Colors.textPrimary },
  artist: { fontFamily: Typography.body, fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  dedication: { fontFamily: Typography.body, fontSize: 13, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  guest: { fontFamily: Typography.body, fontSize: 12, color: Colors.primary, marginTop: 4 },
  actions: { alignItems: 'flex-end', gap: Spacing.xs },
  status: { fontFamily: Typography.bodyMedium, fontSize: 12 },
  buttons: { flexDirection: 'row', gap: Spacing.xs },
  btn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  playedBtn: { backgroundColor: Colors.accent },
  skipBtn: { backgroundColor: Colors.border },
  btnText: { fontFamily: Typography.bodyMedium, fontSize: 14, color: Colors.textPrimary },
});

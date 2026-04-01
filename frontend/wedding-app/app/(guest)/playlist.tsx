import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { SongRequest } from '../../types/api';

export default function PlaylistScreen() {
  const qc = useQueryClient();
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [dedication, setDedication] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: myRequests = [], isLoading } = useQuery<SongRequest[]>({
    queryKey: ['my-song-requests'],
    queryFn: async () => (await apiClient.get('/song-requests/my')).data,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      apiClient.post('/song-requests', {
        songName: songName.trim(),
        artist: artist.trim() || null,
        dedication: dedication.trim() || null,
      }),
    onSuccess: () => {
      setSongName(''); setArtist(''); setDedication('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      qc.invalidateQueries({ queryKey: ['my-song-requests'] });
    },
  });

  const statusLabel = (s: SongRequest['status']) =>
    Copy.playlist.statuses[s] ?? s;

  const statusColor = (s: SongRequest['status']) => {
    if (s === 'Played') return Colors.accent;
    if (s === 'Skipped') return Colors.textSecondary;
    return Colors.primary;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{Copy.playlist.title}</Text>

      {/* Add form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={Copy.playlist.songNamePlaceholder}
          placeholderTextColor={Colors.textSecondary}
          value={songName}
          onChangeText={setSongName}
        />
        <TextInput
          style={styles.input}
          placeholder={Copy.playlist.artistPlaceholder}
          placeholderTextColor={Colors.textSecondary}
          value={artist}
          onChangeText={setArtist}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder={Copy.playlist.dedicationPlaceholder}
          placeholderTextColor={Colors.textSecondary}
          value={dedication}
          onChangeText={setDedication}
          multiline
          numberOfLines={3}
        />
        {success && <Text style={styles.success}>{Copy.playlist.sent}</Text>}
        <TouchableOpacity
          style={[styles.button, (!songName.trim() || isPending) && styles.buttonDisabled]}
          onPress={() => mutate()}
          disabled={!songName.trim() || isPending}
        >
          {isPending
            ? <ActivityIndicator color={Colors.surface} />
            : <Text style={styles.buttonText}>{Copy.playlist.send}</Text>
          }
        </TouchableOpacity>
      </View>

      {/* My requests */}
      <Text style={styles.sectionTitle}>{Copy.playlist.myRequests}</Text>
      {isLoading
        ? <ActivityIndicator color={Colors.primary} />
        : (
          <FlatList
            data={myRequests}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.songName}>{item.songName}</Text>
                  {item.artist && <Text style={styles.songMeta}>{item.artist}</Text>}
                </View>
                <Text style={[styles.status, { color: statusColor(item.status) }]}>
                  {statusLabel(item.status)}
                </Text>
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
  screenTitle: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  success: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.accent,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.surface,
  },
  sectionTitle: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  requestCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
  },
  songName: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  songMeta: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  status: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
  },
});

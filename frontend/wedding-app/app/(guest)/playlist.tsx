import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

  const statusColor = (st: SongRequest['status']) => {
    if (st === 'Played') return Colors.secondary;
    if (st === 'Skipped') return Colors.onSurfaceVariant;
    return Colors.primary;
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* ── Hero header ───────────────────────────────────────── */}
      <View style={s.hero}>
        <Text style={s.title}>{Copy.playlist.title}</Text>
        <Text style={s.subtitle}>{Copy.playlist.addSong}</Text>
      </View>

      {/* ── Request form ─────────────────────────────────────── */}
      <View style={s.card}>
        <View style={s.inputGroup}>
          <Feather name="music" size={16} color={Colors.onSurfaceVariant} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder={Copy.playlist.songNamePlaceholder}
            placeholderTextColor={Colors.onSurfaceVariant}
            value={songName}
            onChangeText={setSongName}
          />
        </View>
        <View style={s.inputGroup}>
          <Feather name="user" size={16} color={Colors.onSurfaceVariant} style={s.inputIcon} />
          <TextInput
            style={s.input}
            placeholder={Copy.playlist.artistPlaceholder}
            placeholderTextColor={Colors.onSurfaceVariant}
            value={artist}
            onChangeText={setArtist}
          />
        </View>
        <View style={[s.inputGroup, { alignItems: 'flex-start', paddingTop: Spacing.sm }]}>
          <Feather name="message-square" size={16} color={Colors.onSurfaceVariant} style={[s.inputIcon, { marginTop: 2 }]} />
          <TextInput
            style={[s.input, s.multiline]}
            placeholder={Copy.playlist.dedicationPlaceholder}
            placeholderTextColor={Colors.onSurfaceVariant}
            value={dedication}
            onChangeText={setDedication}
            multiline
            numberOfLines={3}
          />
        </View>

        {success && (
          <View style={s.successBanner}>
            <Feather name="check-circle" size={14} color={Colors.secondary} />
            <Text style={s.successText}>{Copy.playlist.sent}</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={(!songName.trim() || isPending) ? 1 : 0.85}
          onPress={() => mutate()}
          disabled={!songName.trim() || isPending}
          style={(!songName.trim() || isPending) ? { opacity: 0.45 } : undefined}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.submitBtn}
          >
            {isPending
              ? <ActivityIndicator color="#fff" />
              : (
                <>
                  <Feather name="send" size={16} color="#fff" />
                  <Text style={s.submitBtnText}>{Copy.playlist.send}</Text>
                </>
              )
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── My requests ──────────────────────────────────────── */}
      {myRequests.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{Copy.playlist.myRequests}</Text>
          {isLoading
            ? <ActivityIndicator color={Colors.primary} />
            : myRequests.map((item) => (
              <View key={item.id} style={s.requestCard}>
                <View style={s.requestIconWrap}>
                  <Feather name="music" size={16} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.songName}>{item.songName}</Text>
                  {item.artist && <Text style={s.songMeta}>{item.artist}</Text>}
                </View>
                <View style={[s.statusChip, { backgroundColor: `${statusColor(item.status)}18` }]}>
                  <Text style={[s.statusText, { color: statusColor(item.status) }]}>
                    {Copy.playlist.statuses[item.status] ?? item.status}
                  </Text>
                </View>
              </View>
            ))
          }
        </View>
      )}

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },

  // Hero
  hero: {
    paddingTop: Spacing.gallery,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 32,
    color: Colors.onSurface,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },

  // Form card — no borders
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    paddingVertical: Spacing.sm,
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },

  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  successText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.secondary,
  },

  submitBtn: {
    borderRadius: Radius.button,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  submitBtnText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.3,
  },

  // Section
  section: { paddingHorizontal: Spacing.md },
  sectionTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: Spacing.md,
    letterSpacing: 0.2,
  },
  requestCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  requestIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songName: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.onSurface,
  },
  songMeta: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  statusChip: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Platform, Alert,
} from 'react-native';
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { apiClient } from '../../services/api';
import type { GuestPhoto } from '../../types/api';

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function PhotoUploadScreen() {
  const { isEnabled, isLoading: flagLoading } = useFeatureFlag('photo_upload');
  const qc = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const { data: myPhotos = [], isLoading: photosLoading } = useQuery<GuestPhoto[]>({
    queryKey: ['my-photos'],
    queryFn: async () => {
      const all: GuestPhoto[] = (await apiClient.get('/photos')).data;
      // Filter to own photos — guestName will be empty for own photos from backend
      // We use all as the feed is small
      return all;
    },
    enabled: isEnabled,
  });

  const uploadMut = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return apiClient.post('/photos', form, {
        // Do NOT set Content-Type manually — axios sets it with the correct multipart boundary
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
    },
    onSuccess: () => {
      setUploadProgress(null);
      qc.invalidateQueries({ queryKey: ['my-photos'] });
    },
    onError: () => setUploadProgress(null),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/photos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-photos'] }),
  });

  const pickAndUpload = () => {
    if (Platform.OS !== 'web') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`Súbor ${file.name} je príliš veľký (max 10 MB).`);
          continue;
        }
        await uploadMut.mutateAsync(file);
      }
    };
    input.click();
  };

  if (flagLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!isEnabled) {
    return (
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Feather name="camera" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.lockedTitle}>{Copy.photoUpload.lockedTitle}</Text>
        <Text style={s.lockedSubtitle}>{Copy.photoUpload.lockedSubtitle}</Text>
        <View style={s.dateBadge}>
          <Feather name="calendar" size={13} color={Colors.primary} />
          <Text style={s.dateText}>5. september 2026</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>{Copy.photoUpload.title}</Text>
        <Text style={s.subtitle}>{Copy.photoUpload.subtitle}</Text>
      </View>

      {/* Upload area */}
      <TouchableOpacity
        style={s.uploadArea}
        activeOpacity={0.75}
        onPress={pickAndUpload}
        disabled={uploadMut.isPending}
      >
        {uploadMut.isPending ? (
          <View style={s.uploadingState}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={s.uploadingText}>
              {uploadProgress !== null ? `Nahrávam... ${uploadProgress}%` : 'Nahrávam...'}
            </Text>
            {uploadProgress !== null && (
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${uploadProgress}%` as any }]} />
              </View>
            )}
          </View>
        ) : (
          <View style={s.uploadPrompt}>
            <View style={s.uploadIconWrap}>
              <Feather name="upload-cloud" size={32} color={Colors.primary} />
            </View>
            <Text style={s.uploadPromptTitle}>Vybrať fotky</Text>
            <Text style={s.uploadPromptSub}>JPG, PNG, HEIC, WebP · max 10 MB</Text>
          </View>
        )}
      </TouchableOpacity>

      {uploadMut.isError && (
        <Text style={s.errorText}>{Copy.common.error}</Text>
      )}

      {/* My uploaded photos */}
      {photosLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.lg }} />
      ) : myPhotos.length > 0 ? (
        <View style={s.section}>
          <Text style={s.sectionLabel}>NAHRANÉ FOTKY</Text>
          <View style={s.photoGrid}>
            {myPhotos.map((photo) => (
              <View key={photo.id} style={s.photoThumb}>
                <Image source={{ uri: photo.url }} style={s.photoImg} resizeMode="cover" />
                <View style={s.photoMeta}>
                  <Text style={s.photoTime}>{fmtTime(photo.uploadedAt)}</Text>
                  <Text style={s.photoSize}>{fmtSize(photo.fileSizeBytes)}</Text>
                </View>
                <TouchableOpacity
                  style={s.deleteBtn}
                  onPress={() => deleteMut.mutate(photo.id)}
                  disabled={deleteMut.isPending}
                >
                  <Feather name="trash-2" size={14} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={s.emptyText}>Zatiaľ žiadne nahrané fotky.</Text>
      )}

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },

  center: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  lockedTitle: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: Spacing.sm,
  },
  lockedSubtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: Spacing.lg,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dateText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.primary,
  },

  header: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  uploadArea: {
    margin: Spacing.md,
    borderRadius: Radius.card,
    backgroundColor: Colors.surface,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  uploadPrompt: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  uploadIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  uploadPromptTitle: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  uploadPromptSub: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  uploadingState: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
    width: '100%',
  },
  uploadingText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.primary,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  errorText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.md,
  },

  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoThumb: {
    width: '31%' as any,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    ...Shadow.card,
  },
  photoImg: {
    width: '100%',
    aspectRatio: 1,
  },
  photoMeta: {
    padding: 6,
  },
  photoTime: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    color: Colors.onSurface,
  },
  photoSize: {
    fontFamily: Typography.body,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  deleteBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 4,
  },
  emptyText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

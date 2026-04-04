import {
  View, Text, ScrollView, Image, TouchableOpacity, Modal,
  StyleSheet, ActivityIndicator, useWindowDimensions, Platform,
} from 'react-native';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { apiClient } from '../../services/api';
import type { GuestPhoto } from '../../types/api';

function fmtDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('sk-SK', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function GalleryScreen() {
  const { isEnabled, isLoading: flagLoading } = useFeatureFlag('gallery');
  const { width } = useWindowDimensions();
  const [lightbox, setLightbox] = useState<GuestPhoto | null>(null);

  const cols = Platform.OS === 'web' && width >= 768 ? 4 : 3;
  const thumbSize = (width - Spacing.md * 2 - Spacing.xs * (cols - 1)) / cols;

  const { data: photos = [], isLoading: photosLoading } = useQuery<GuestPhoto[]>({
    queryKey: ['gallery-photos'],
    queryFn: async () => (await apiClient.get('/photos')).data,
    enabled: isEnabled,
    refetchInterval: 30_000, // auto-refresh every 30s
  });

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
          <Feather name="image" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.lockedTitle}>{Copy.gallery.lockedTitle}</Text>
        <Text style={s.lockedSubtitle}>{Copy.gallery.lockedSubtitle}</Text>
        <View style={s.dateBadge}>
          <Feather name="calendar" size={13} color={Colors.primary} />
          <Text style={s.dateText}>6. september 2026, 8:00</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>{Copy.gallery.title}</Text>
          {photos.length > 0 && (
            <Text style={s.count}>{photos.length} {photos.length === 1 ? 'fotka' : 'fotiek'}</Text>
          )}
        </View>

        {photosLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : photos.length === 0 ? (
          <View style={s.emptyState}>
            <View style={s.emptyIcon}>
              <Feather name="image" size={32} color={Colors.onSurfaceVariant} />
            </View>
            <Text style={s.emptyTitle}>Žiadne fotky zatiaľ</Text>
            <Text style={s.emptySub}>Hostia môžu nahrávať fotky cez sekciu „Fotky".</Text>
          </View>
        ) : (
          <View style={s.grid}>
            {photos.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                onPress={() => setLightbox(photo)}
                activeOpacity={0.85}
                style={[s.thumb, { width: thumbSize, height: thumbSize }]}
              >
                <Image source={{ uri: photo.url }} style={s.thumbImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Lightbox */}
      <Modal
        visible={lightbox !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setLightbox(null)}
      >
        <View style={s.lightboxOverlay}>
          <TouchableOpacity style={s.lightboxClose} onPress={() => setLightbox(null)}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>

          {lightbox && (
            <>
              <Image
                source={{ uri: lightbox.url }}
                style={s.lightboxImg}
                resizeMode="contain"
              />
              <View style={s.lightboxMeta}>
                <Text style={s.lightboxName}>{lightbox.guestName || 'Hosť'}</Text>
                <Text style={s.lightboxTime}>{fmtDateTime(lightbox.uploadedAt)}</Text>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
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
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
  },
  count: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
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
    fontSize: 18,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  emptySub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  thumb: {
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLow,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },

  // Lightbox
  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxClose: {
    position: 'absolute',
    top: 48,
    right: Spacing.lg,
    zIndex: 10,
    padding: Spacing.sm,
  },
  lightboxImg: {
    width: '100%',
    height: '75%',
  },
  lightboxMeta: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  lightboxName: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: '#fff',
  },
  lightboxTime: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
});

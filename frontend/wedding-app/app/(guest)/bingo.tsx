import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { apiClient } from '../../services/api';
import type { BingoChallengeWithProgress } from '../../types/api';

function pickImageWeb(onPicked: (file: File) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) onPicked(file);
  };
  input.click();
}

export default function BingoScreen() {
  const { isEnabled, isLoading: flagLoading } = useFeatureFlag('photo_bingo');
  const qc = useQueryClient();

  const { data: challenges = [], isLoading: challengesLoading } = useQuery<BingoChallengeWithProgress[]>({
    queryKey: ['bingo-progress'],
    queryFn: async () => (await apiClient.get('/bingo-challenges/progress')).data,
    enabled: isEnabled,
  });

  const completeMut = useMutation({
    mutationFn: async ({ id, file }: { id: string; file?: File }) => {
      const form = new FormData();
      if (file) form.append('photo', file);
      // Do NOT set Content-Type manually — axios sets it with the correct multipart boundary
      return apiClient.post(`/bingo-challenges/${id}/complete`, form);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bingo-progress'] }),
  });

  const handleComplete = (challenge: BingoChallengeWithProgress) => {
    if (challenge.isCompleted) return;
    if (Platform.OS === 'web') {
      pickImageWeb((file) => completeMut.mutate({ id: challenge.challengeId, file }));
    } else {
      // Without file (native case — can extend with ImagePicker later)
      completeMut.mutate({ id: challenge.challengeId });
    }
  };

  const completed = challenges.filter((c) => c.isCompleted).length;
  const total = challenges.length;

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
          <Feather name="target" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.lockedTitle}>{Copy.bingo.lockedTitle}</Text>
        <Text style={s.lockedSubtitle}>{Copy.bingo.lockedSubtitle}</Text>
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
        <Text style={s.title}>{Copy.bingo.title}</Text>
        {total > 0 && (
          <View style={s.progress}>
            <Text style={s.progressText}>{completed} / {total} splnených</Text>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${(completed / total) * 100}%` as any }]} />
            </View>
          </View>
        )}
      </View>

      {challengesLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <View style={s.grid}>
          {challenges.map((ch) => (
            <TouchableOpacity
              key={ch.challengeId}
              style={[s.card, ch.isCompleted && s.cardDone]}
              activeOpacity={ch.isCompleted ? 1 : 0.75}
              disabled={completeMut.isPending}
              onPress={() => handleComplete(ch)}
            >
              {ch.isCompleted && ch.photoUrl ? (
                <Image source={{ uri: ch.photoUrl }} style={s.cardPhoto} resizeMode="cover" />
              ) : null}

              {ch.isCompleted && (
                <View style={s.doneOverlay}>
                  <Feather name="check-circle" size={20} color={Colors.secondary} />
                </View>
              )}

              <View style={s.cardBody}>
                <Text style={[s.cardTitle, ch.isCompleted && s.cardTitleDone]} numberOfLines={3}>
                  {ch.title}
                </Text>
                {ch.description ? (
                  <Text style={s.cardDesc} numberOfLines={2}>{ch.description}</Text>
                ) : null}

                {!ch.isCompleted && (
                  <View style={s.captureBtn}>
                    <Feather name="camera" size={13} color={Colors.secondary} />
                    <Text style={s.captureBtnText}>Zachytiť</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: Spacing.lg,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
  },
  progress: {
    gap: Spacing.xs,
  },
  progressText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  card: {
    width: '47.5%' as any,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  cardDone: {
    backgroundColor: Colors.secondaryContainer,
  },
  cardPhoto: {
    width: '100%',
    height: 100,
  },
  doneOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 2,
  },
  cardBody: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  cardTitle: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 13,
    color: Colors.onSurface,
    lineHeight: 18,
  },
  cardTitleDone: {
    color: Colors.secondary,
  },
  cardDesc: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  captureBtnText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.secondary,
  },
});

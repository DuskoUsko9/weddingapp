import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { QuestionnaireAllData, QuestionnaireAdminResponse } from '../../types/api';

function alcoholLabel(value: QuestionnaireAdminResponse['alcoholPreference']): string {
  switch (value) {
    case 'Drinks':      return 'Pije alkohol';
    case 'WineOnly':    return 'Iba víno / šampanské';
    case 'BeerOnly':    return 'Iba pivo';
    case 'NonDrinker':  return 'Nepije alkohol';
    default: return value;
  }
}

function alcoholIcon(value: QuestionnaireAdminResponse['alcoholPreference']): string {
  switch (value) {
    case 'Drinks':      return '🍷';
    case 'WineOnly':    return '🥂';
    case 'BeerOnly':    return '🍺';
    case 'NonDrinker':  return '🧃';
    default: return '🍷';
  }
}

export default function AdminQuestionnairesScreen() {
  const { data, isLoading } = useQuery<QuestionnaireAllData>({
    queryKey: ['admin-questionnaires'],
    queryFn: async () => (await apiClient.get('/questionnaire/all')).data,
  });

  const submitted = data?.submitted ?? 0;
  const totalGuests = data?.totalGuests ?? 0;
  const responses = data?.responses ?? [];
  const notSubmitted = data?.notSubmitted ?? [];
  const progress = totalGuests > 0 ? submitted / totalGuests : 0;

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  return (
    <FlatList
      style={s.container}
      data={responses}
      keyExtractor={(r) => r.guestId}
      contentContainerStyle={s.list}
      ListHeaderComponent={
        <>
          {/* ── Progress card ────────────────────────────────── */}
          <View style={s.progressCard}>
            <View style={s.progressRow}>
              <Text style={s.progressTitle}>Vyplnené dotazníky</Text>
              <Text style={s.progressCount}>
                <Text style={s.progressHighlight}>{submitted}</Text>
                {' / '}{totalGuests}
              </Text>
            </View>

            {/* Progress bar */}
            <View style={s.progressBarTrack}>
              <View style={[s.progressBarFill, { width: `${Math.round(progress * 100)}%` as any }]} />
            </View>

            {/* Stat chips */}
            <View style={s.statChips}>
              <View style={[s.statChip, { backgroundColor: Colors.secondaryContainer }]}>
                <Feather name="check-circle" size={12} color={Colors.secondary} />
                <Text style={[s.statChipText, { color: Colors.secondary }]}>{submitted} vyplnených</Text>
              </View>
              <View style={[s.statChip, { backgroundColor: Colors.primaryFixed }]}>
                <Feather name="clock" size={12} color={Colors.primary} />
                <Text style={[s.statChipText, { color: Colors.primary }]}>{Math.max(totalGuests - submitted, 0)} čaká</Text>
              </View>
            </View>
          </View>

          {responses.length > 0 && (
            <Text style={s.sectionLabel}>ODPOVEDE</Text>
          )}
        </>
      }
      renderItem={({ item }) => (
        <View style={s.card}>
          {/* Header */}
          <View style={s.cardHeader}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{item.guestName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{item.guestName}</Text>
              <Text style={s.timestamp}>
                {new Date(item.submittedAt).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long' })}
              </Text>
            </View>
            {item.hasAllergy && (
              <View style={s.allergyBadge}>
                <Feather name="alert-triangle" size={11} color={Colors.error} />
                <Text style={s.allergyBadgeText}>Alergia</Text>
              </View>
            )}
          </View>

          {/* Alcohol */}
          <View style={s.detailRow}>
            <Text style={s.detailIcon}>{alcoholIcon(item.alcoholPreference)}</Text>
            <Text style={s.detailText}>{alcoholLabel(item.alcoholPreference)}</Text>
          </View>

          {/* Allergy notes */}
          {item.allergyNotes && (
            <View style={s.allergyNote}>
              <Feather name="alert-circle" size={13} color={Colors.error} />
              <Text style={s.allergyNoteText}>{item.allergyNotes}</Text>
            </View>
          )}
        </View>
      )}
      ListFooterComponent={
        notSubmitted.length > 0 ? (
          <View style={s.notSubmittedCard}>
            <View style={s.notSubmittedHeader}>
              <Feather name="clock" size={14} color={Colors.primary} />
              <Text style={s.notSubmittedTitle}>Nevyplnení hostia ({notSubmitted.length})</Text>
            </View>
            {notSubmitted.map((guest) => (
              <View key={guest.guestId} style={s.notSubmittedRow}>
                <View style={s.notSubmittedDot} />
                <Text style={s.notSubmittedName}>{guest.guestName}</Text>
              </View>
            ))}
          </View>
        ) : null
      }
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  // Progress
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.onSurface,
  },
  progressCount: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  progressHighlight: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.primary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
  },
  statChips: { flexDirection: 'row', gap: Spacing.sm },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  statChipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
  },

  sectionLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },

  // Response card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.heading,
    fontSize: 15,
    color: Colors.primary,
  },
  name: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.onSurface,
  },
  timestamp: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  allergyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.errorContainer,
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  allergyBadgeText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 11,
    color: Colors.error,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailIcon: { fontSize: 15 },
  detailText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },

  allergyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.errorContainer,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  allergyNoteText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.error,
    flex: 1,
    lineHeight: 19,
  },

  // Not submitted
  notSubmittedCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginTop: Spacing.md,
    ...Shadow.card,
  },
  notSubmittedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  notSubmittedTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.onSurface,
  },
  notSubmittedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 5,
  },
  notSubmittedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
  notSubmittedName: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
});

import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { QuestionnaireAllData, QuestionnaireAdminResponse } from '../../types/api';

export default function AdminQuestionnairesScreen() {
  const { data, isLoading } = useQuery<QuestionnaireAllData>({
    queryKey: ['admin-questionnaires'],
    queryFn: async () => (await apiClient.get('/questionnaire/all')).data,
  });

  const submitted = data?.submitted ?? 0;
  const totalGuests = data?.totalGuests ?? 0;
  const responses = data?.responses ?? [];
  const notSubmitted = data?.notSubmitted ?? [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Vyplnené: <Text style={styles.highlight}>{submitted} / {totalGuests}</Text></Text>
        <Text style={styles.summaryText}>Nevyplnené: <Text style={styles.highlight}>{Math.max(totalGuests - submitted, 0)}</Text></Text>
      </View>

      <FlatList
        data={responses}
        keyExtractor={(r) => r.guestId}
        contentContainerStyle={{ padding: Spacing.md, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.guestName}</Text>
              <Text style={[styles.status, { color: item.hasAllergy ? Colors.error : Colors.accent }] }>
                {item.hasAllergy ? 'Alergia' : 'Bez alergie'}
              </Text>
            </View>
            <Text style={styles.detail}>🍷 {toAlcoholLabel(item.alcoholPreference)}</Text>
            {item.allergyNotes && <Text style={styles.detail}>⚠️ {item.allergyNotes}</Text>}
            <Text style={styles.timestamp}>Odoslané: {new Date(item.submittedAt).toLocaleString('sk-SK')}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.notSubmittedBlock}>
            <Text style={styles.notSubmittedTitle}>Nevyplnení hostia ({notSubmitted.length})</Text>
            {notSubmitted.map((guest) => (
              <Text key={guest.guestId} style={styles.notSubmittedName}>• {guest.guestName}</Text>
            ))}
          </View>
        }
      />
    </View>
  );
}

function toAlcoholLabel(value: QuestionnaireAdminResponse['alcoholPreference']) {
  switch (value) {
    case 'Drinks':
      return 'Pije alkohol';
    case 'WineOnly':
      return 'Iba víno / šampanské';
    case 'BeerOnly':
      return 'Iba pivo';
    case 'NonDrinker':
      return 'Nepije alkohol';
    default:
      return value;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summary: {
    flexDirection: 'row',
    gap: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryText: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  highlight: {
    fontFamily: Typography.bodyMedium,
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  status: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
  },
  detail: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  timestamp: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  notSubmittedBlock: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginTop: Spacing.md,
    ...Shadow.card,
  },
  notSubmittedTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  notSubmittedName: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

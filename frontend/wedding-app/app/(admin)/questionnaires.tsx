import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { QuestionnaireResponse } from '../../types/api';

export default function AdminQuestionnairesScreen() {
  const { data: responses = [], isLoading } = useQuery<QuestionnaireResponse[]>({
    queryKey: ['admin-questionnaires'],
    queryFn: async () => (await apiClient.get('/questionnaire')).data,
  });

  const attending = responses.filter((r) => r.isAttending).length;
  const notAttending = responses.filter((r) => !r.isAttending).length;

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
        <Text style={styles.summaryText}>Prídu: <Text style={styles.highlight}>{attending}</Text></Text>
        <Text style={styles.summaryText}>Neprídu: <Text style={styles.highlight}>{notAttending}</Text></Text>
      </View>
      <FlatList
        data={responses}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: Spacing.md, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.guestName}</Text>
              <Text style={[styles.attending, { color: item.isAttending ? Colors.accent : Colors.error }]}>
                {item.isAttending ? 'Príde' : 'Nepríde'}
              </Text>
            </View>
            {item.mealChoice && <Text style={styles.detail}>🍽 {item.mealChoice}</Text>}
            {item.allergies && <Text style={styles.detail}>⚠️ {item.allergies}</Text>}
            {item.note && <Text style={styles.detail}>💬 {item.note}</Text>}
          </View>
        )}
      />
    </View>
  );
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
  attending: {
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
});

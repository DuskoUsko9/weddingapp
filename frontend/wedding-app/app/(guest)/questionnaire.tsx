import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Switch,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { QuestionnaireResponse } from '../../types/api';

export default function QuestionnaireScreen() {
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery<QuestionnaireResponse | null>({
    queryKey: ['my-questionnaire'],
    queryFn: async () => {
      try {
        return (await apiClient.get('/questionnaire/my')).data;
      } catch {
        return null;
      }
    },
  });

  const [isAttending, setIsAttending] = useState(true);
  const [mealChoice, setMealChoice] = useState('');
  const [allergies, setAllergies] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      setIsAttending(existing.isAttending);
      setMealChoice(existing.mealChoice ?? '');
      setAllergies(existing.allergies ?? '');
      setNote(existing.note ?? '');
    }
  }, [existing]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const body = {
        isAttending,
        mealChoice: mealChoice.trim() || null,
        allergies: allergies.trim() || null,
        note: note.trim() || null,
      };
      return existing
        ? apiClient.put('/questionnaire', body)
        : apiClient.post('/questionnaire', body);
    },
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      qc.invalidateQueries({ queryKey: ['my-questionnaire'] });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{Copy.questionnaire.title}</Text>
      <Text style={styles.subtitle}>{Copy.questionnaire.subtitle}</Text>

      <View style={styles.card}>
        {/* Attendance */}
        <View style={styles.row}>
          <Text style={styles.label}>{Copy.questionnaire.attendance}</Text>
          <Switch
            value={isAttending}
            onValueChange={setIsAttending}
            trackColor={{ true: Colors.accent, false: Colors.border }}
            thumbColor={isAttending ? Colors.primary : Colors.textSecondary}
          />
        </View>
        <Text style={styles.attendanceLabel}>
          {isAttending ? Copy.questionnaire.attendanceYes : Copy.questionnaire.attendanceNo}
        </Text>

        {isAttending && (
          <>
            <Text style={styles.label}>{Copy.questionnaire.mealChoice}</Text>
            <TextInput
              style={styles.input}
              value={mealChoice}
              onChangeText={setMealChoice}
              placeholder="Napr. kurací rezeň, vegetariánske..."
              placeholderTextColor={Colors.textSecondary}
            />

            <Text style={styles.label}>{Copy.questionnaire.allergies}</Text>
            <TextInput
              style={styles.input}
              value={allergies}
              onChangeText={setAllergies}
              placeholder={Copy.questionnaire.allergiesPlaceholder}
              placeholderTextColor={Colors.textSecondary}
              multiline
            />
          </>
        )}

        <Text style={styles.label}>{Copy.questionnaire.note}</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={note}
          onChangeText={setNote}
          placeholder={Copy.questionnaire.notePlaceholder}
          placeholderTextColor={Colors.textSecondary}
          multiline
          numberOfLines={4}
        />

        {saved && <Text style={styles.success}>{Copy.questionnaire.saved}</Text>}

        <TouchableOpacity
          style={[styles.button, isPending && styles.buttonDisabled]}
          onPress={() => mutate()}
          disabled={isPending}
        >
          {isPending
            ? <ActivityIndicator color={Colors.surface} />
            : <Text style={styles.buttonText}>{Copy.common.save}</Text>
          }
        </TouchableOpacity>
      </View>

      <Text style={styles.deadline}>{Copy.questionnaire.deadline}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadow.card,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  attendanceLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
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
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  success: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.accent,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.surface,
  },
  deadline: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});

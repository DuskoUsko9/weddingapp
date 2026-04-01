import { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { FeatureFlag, QuestionnaireMyResponse, AlcoholPreference } from '../../types/api';

type QuestionnairePayload = {
  alcoholPreference: AlcoholPreference;
  hasAllergy: boolean;
  allergyNotes: string | null;
};

const ALCOHOL_OPTIONS: { value: AlcoholPreference; label: string; icon: string }[] = [
  { value: 'Drinks', label: Copy.questionnaire.alcoholDrinks, icon: '🍷' },
  { value: 'WineOnly', label: Copy.questionnaire.alcoholWineOnly, icon: '🥂' },
  { value: 'BeerOnly', label: Copy.questionnaire.alcoholBeerOnly, icon: '🍺' },
  { value: 'NonDrinker', label: Copy.questionnaire.alcoholNonDrinker, icon: '🧃' },
];

export default function QuestionnaireScreen() {
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery<QuestionnaireMyResponse | null>({
    queryKey: ['my-questionnaire'],
    queryFn: async () => (await apiClient.get('/questionnaire/my')).data,
  });

  const { data: flags = [] } = useQuery<FeatureFlag[]>({
    queryKey: ['feature-flags'],
    queryFn: async () => (await apiClient.get('/feature-flags')).data,
  });

  const questionnaireEnabled = useMemo(() => {
    const flag = flags.find((f) => f.key === 'questionnaire');
    return flag?.isEnabled ?? false;
  }, [flags]);

  const [alcoholPreference, setAlcoholPreference] = useState<AlcoholPreference>('Drinks');
  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (existing) {
      setAlcoholPreference(existing.alcoholPreference);
      setHasAllergy(existing.hasAllergy);
      setAllergyNotes(existing.allergyNotes ?? '');
    }
  }, [existing]);

  const { mutate, isPending } = useMutation({
    mutationFn: (method: 'post' | 'put') => {
      const body: QuestionnairePayload = {
        alcoholPreference,
        hasAllergy,
        allergyNotes: hasAllergy ? (allergyNotes.trim() || null) : null,
      };
      if (hasAllergy && !body.allergyNotes) {
        throw new Error(Copy.questionnaire.allergyNotesLabel);
      }
      return method === 'put'
        ? apiClient.put('/questionnaire', body)
        : apiClient.post('/questionnaire', body);
    },
    onMutate: () => { setErrorMessage(null); setSuccessMessage(null); },
    onSuccess: () => {
      setSuccessMessage(Copy.questionnaire.submitted);
      qc.invalidateQueries({ queryKey: ['my-questionnaire'] });
    },
    onError: (error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : Copy.common.error);
    },
  });

  const handleSave = () => {
    if (!questionnaireEnabled) return;
    mutate(existing ? 'put' : 'post');
  };

  const isReadOnly = !questionnaireEnabled;

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  if (isReadOnly && !existing) {
    return (
      <View style={s.lockedContainer}>
        <View style={s.lockIconWrap}>
          <Feather name="lock" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.lockedTitle}>{Copy.questionnaire.title}</Text>
        <Text style={s.lockedSub}>{Copy.questionnaire.lockedMissing}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* ── Hero header ───────────────────────────────────────── */}
      <View style={s.hero}>
        <Text style={s.title}>{Copy.questionnaire.title}</Text>
        <Text style={s.subtitle}>{Copy.questionnaire.subtitle}</Text>
      </View>

      {/* ── Deadline banner ───────────────────────────────────── */}
      <View style={s.deadlineBanner}>
        <Feather name="clock" size={14} color="#4d3a08" />
        <Text style={s.deadlineText}>{Copy.questionnaire.deadline}</Text>
      </View>

      {/* ── Read-only notice ─────────────────────────────────── */}
      {isReadOnly && existing && (
        <View style={s.readonlyBanner}>
          <Feather name="check-circle" size={14} color={Colors.secondary} />
          <Text style={s.readonlyText}>{Copy.questionnaire.lockedSubmitted}</Text>
        </View>
      )}

      {/* ── Main card ─────────────────────────────────────────── */}
      <View style={s.card}>

        {/* Alcohol */}
        <Text style={s.sectionLabel}>{Copy.questionnaire.alcoholTitle}</Text>
        <View style={s.optionsWrap}>
          {ALCOHOL_OPTIONS.map((opt) => {
            const selected = alcoholPreference === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.optionBtn, selected && s.optionBtnSelected]}
                onPress={() => setAlcoholPreference(opt.value)}
                disabled={isReadOnly}
                activeOpacity={0.75}
              >
                <Text style={s.optionIcon}>{opt.icon}</Text>
                <Text style={[s.optionText, selected && s.optionTextSelected]}>{opt.label}</Text>
                {selected && (
                  <View style={s.optionCheck}>
                    <Feather name="check" size={12} color={Colors.secondary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Allergy */}
        <Text style={[s.sectionLabel, { marginTop: Spacing.md }]}>{Copy.questionnaire.allergyQuestion}</Text>
        <View style={s.toggleRow}>
          <TouchableOpacity
            style={[s.toggleBtn, hasAllergy && s.toggleBtnActive]}
            onPress={() => setHasAllergy(true)}
            disabled={isReadOnly}
            activeOpacity={0.75}
          >
            <Text style={[s.toggleText, hasAllergy && s.toggleTextActive]}>{Copy.questionnaire.allergyYes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.toggleBtn, !hasAllergy && s.toggleBtnActive]}
            onPress={() => setHasAllergy(false)}
            disabled={isReadOnly}
            activeOpacity={0.75}
          >
            <Text style={[s.toggleText, !hasAllergy && s.toggleTextActive]}>{Copy.questionnaire.allergyNo}</Text>
          </TouchableOpacity>
        </View>

        {hasAllergy && (
          <>
            <Text style={s.sectionLabel}>{Copy.questionnaire.allergyNotesLabel}</Text>
            <TextInput
              style={[s.textInput, s.multiline]}
              value={allergyNotes}
              onChangeText={setAllergyNotes}
              placeholder={Copy.questionnaire.allergyNotesPlaceholder}
              placeholderTextColor={Colors.onSurfaceVariant}
              multiline
              editable={!isReadOnly}
            />
          </>
        )}

        {errorMessage && (
          <View style={s.errorBanner}>
            <Feather name="alert-circle" size={14} color={Colors.error} />
            <Text style={s.errorText}>{errorMessage}</Text>
          </View>
        )}
        {successMessage && (
          <View style={s.successBanner}>
            <Feather name="check-circle" size={14} color={Colors.secondary} />
            <Text style={s.successText}>{successMessage}</Text>
          </View>
        )}

        {!isReadOnly && (
          <TouchableOpacity
            activeOpacity={isPending ? 1 : 0.85}
            onPress={handleSave}
            disabled={isPending}
            style={{ marginTop: Spacing.md }}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.submitBtn}
            >
              {isPending
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.submitBtnText}>{existing ? Copy.questionnaire.update : Copy.questionnaire.submit}</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Locked state
  lockedContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  lockIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  lockedTitle: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  lockedSub: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },

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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },

  // Banners
  deadlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  deadlineText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: '#4d3a08',
    flex: 1,
    lineHeight: 20,
  },
  readonlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  readonlyText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.secondary,
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorContainer,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  errorText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.error,
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  successText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.secondary,
    flex: 1,
  },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    ...Shadow.card,
  },
  sectionLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },

  // Options
  optionsWrap: { gap: Spacing.sm },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  optionBtnSelected: { backgroundColor: Colors.secondaryContainer },
  optionIcon: { fontSize: 18 },
  optionText: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurface,
  },
  optionTextSelected: { color: Colors.secondary, fontFamily: Typography.bodyMedium },
  optionCheck: { marginLeft: 'auto' as any },

  // Toggle
  toggleRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  toggleBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.secondaryContainer },
  toggleText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  toggleTextActive: { color: Colors.secondary },

  // Text input — no borders
  textInput: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
  },
  multiline: { minHeight: 88, textAlignVertical: 'top' },

  // Submit
  submitBtn: {
    borderRadius: Radius.button,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  submitBtnText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.3,
  },
});
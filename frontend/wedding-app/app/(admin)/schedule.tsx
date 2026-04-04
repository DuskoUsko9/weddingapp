import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { ScheduleItem } from '../../types/api';

type FormState = { timeLabel: string; timeMinutes: string; title: string; description: string; icon: string; displayOrder: string };
const EMPTY: FormState = { timeLabel: '', timeMinutes: '', title: '', description: '', icon: '', displayOrder: '' };

function itemToForm(item: ScheduleItem): FormState {
  return {
    timeLabel: item.timeLabel,
    timeMinutes: String(item.timeMinutes),
    title: item.title,
    description: item.description ?? '',
    icon: item.icon ?? '',
    displayOrder: String(item.displayOrder),
  };
}

export default function AdminScheduleScreen() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ScheduleItem | null | 'new'>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const { data: items = [], isLoading } = useQuery<ScheduleItem[]>({
    queryKey: ['schedule'],
    queryFn: async () => (await apiClient.get('/schedule')).data,
  });

  const createMutation = useMutation({
    mutationFn: (body: object) => apiClient.post('/schedule', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedule'] }); setEditing(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) => apiClient.put(`/schedule/${id}`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedule'] }); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/schedule/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule'] }),
  });

  const openNew = () => { setForm(EMPTY); setEditing('new'); };
  const openEdit = (item: ScheduleItem) => { setForm(itemToForm(item)); setEditing(item); };
  const cancel = () => setEditing(null);

  const save = () => {
    const body = {
      timeLabel: form.timeLabel.trim(),
      timeMinutes: parseInt(form.timeMinutes) || 0,
      title: form.title.trim(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      displayOrder: parseInt(form.displayOrder) || 0,
    };
    if (!body.title || !body.timeLabel) return;
    if (editing === 'new') createMutation.mutate(body);
    else if (editing) updateMutation.mutate({ id: editing.id, body });
  };

  const confirmDelete = (item: ScheduleItem) => {
    Alert.alert('Vymazať?', `Vymazať "${item.title}"?`, [
      { text: 'Zrušiť', style: 'cancel' },
      { text: 'Vymazať', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
    ]);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ── Form view ────────────────────────────────────────────
  if (editing !== null) {
    return (
      <ScrollView style={s.scroll} contentContainerStyle={s.formContent} keyboardShouldPersistTaps="handled">
        <Text style={s.formHeading}>{editing === 'new' ? 'Nová položka' : 'Upraviť položku'}</Text>

        <Text style={s.label}>Čas (napr. 15:30) *</Text>
        <TextInput style={s.input} value={form.timeLabel} onChangeText={(v) => setForm({ ...form, timeLabel: v })} placeholder="15:30" placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Minúty od polnoci *</Text>
        <TextInput style={s.input} value={form.timeMinutes} onChangeText={(v) => setForm({ ...form, timeMinutes: v })} keyboardType="numeric" placeholder="930" placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Názov *</Text>
        <TextInput style={s.input} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="Svadobný obrad" placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Popis</Text>
        <TextInput style={[s.input, s.multiline]} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline placeholder="Popis..." placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Ikona (emoji)</Text>
        <TextInput style={s.input} value={form.icon} onChangeText={(v) => setForm({ ...form, icon: v })} placeholder="⛪" placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Poradie</Text>
        <TextInput style={s.input} value={form.displayOrder} onChangeText={(v) => setForm({ ...form, displayOrder: v })} keyboardType="numeric" placeholder="1" placeholderTextColor={Colors.onSurfaceVariant} />

        <View style={s.formActions}>
          <TouchableOpacity style={s.cancelBtn} onPress={cancel} activeOpacity={0.7}>
            <Text style={s.cancelBtnText}>Zrušiť</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.saveBtn, (!form.title || !form.timeLabel) && s.saveBtnDisabled]} onPress={save} disabled={!form.title || !form.timeLabel || isPending} activeOpacity={0.8}>
            {isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveBtnText}>Uložiť</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── List view ────────────────────────────────────────────
  return (
    <View style={s.container}>
      <TouchableOpacity style={s.addBtn} onPress={openNew} activeOpacity={0.8}>
        <Feather name="plus" size={16} color="#fff" />
        <Text style={s.addBtnText}>Pridať položku</Text>
      </TouchableOpacity>

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        : (
          <ScrollView contentContainerStyle={s.list}>
            {items.map((item) => (
              <View key={item.id} style={s.card}>
                <View style={s.cardLeft}>
                  <Text style={s.cardIcon}>{item.icon ?? '📌'}</Text>
                  <View>
                    <View style={s.cardTopRow}>
                      <View style={s.timePill}>
                        <Text style={s.timePillText}>{item.timeLabel}</Text>
                      </View>
                    </View>
                    <Text style={s.cardTitle}>{item.title}</Text>
                    {item.description && <Text style={s.cardDesc} numberOfLines={1}>{item.description}</Text>}
                  </View>
                </View>
                <View style={s.cardActions}>
                  <TouchableOpacity style={s.actionBtn} onPress={() => openEdit(item)} activeOpacity={0.7}>
                    <Feather name="edit-2" size={15} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => confirmDelete(item)} activeOpacity={0.7}>
                    <Feather name="trash-2" size={15} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )
      }
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  formContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, borderRadius: Radius.button,
    margin: Spacing.md, marginBottom: 0, paddingVertical: 12,
    justifyContent: 'center', ...Shadow.card,
  },
  addBtnText: { fontFamily: Typography.bodySemiBold, fontSize: 14, color: '#fff' },

  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  cardIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 2 },
  timePill: {
    backgroundColor: Colors.primaryFixed, borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  timePillText: { fontFamily: Typography.bodyMedium, fontSize: 11, color: Colors.primary },
  cardTitle: { fontFamily: Typography.bodySemiBold, fontSize: 14, color: Colors.onSurface },
  cardDesc: { fontFamily: Typography.body, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 },
  cardActions: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: {
    width: 34, height: 34, borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center',
  },

  formHeading: {
    fontFamily: Typography.heading, fontSize: 22, color: Colors.onSurface,
    marginBottom: Spacing.lg, letterSpacing: 0.2,
  },
  label: { fontFamily: Typography.bodyMedium, fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontFamily: Typography.body, fontSize: 15, color: Colors.onSurface,
    marginBottom: Spacing.md,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.button,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontFamily: Typography.bodyMedium, fontSize: 15, color: Colors.onSurfaceVariant },
  saveBtn: {
    flex: 2, backgroundColor: Colors.primary, borderRadius: Radius.button,
    paddingVertical: 14, alignItems: 'center', ...Shadow.card,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: '#fff' },
});

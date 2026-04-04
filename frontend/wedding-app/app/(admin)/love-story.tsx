import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { LoveStoryEvent } from '../../types/api';

type FormState = { eventDate: string; title: string; description: string; displayOrder: string };
const EMPTY: FormState = { eventDate: '', title: '', description: '', displayOrder: '' };

function itemToForm(e: LoveStoryEvent): FormState {
  return { eventDate: e.eventDate, title: e.title, description: e.description ?? '', displayOrder: String(e.displayOrder) };
}

function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString('sk-SK', { year: 'numeric', month: 'long' }); }
  catch { return d; }
}

const DOT_COLORS = [Colors.secondary, Colors.primary, Colors.tertiary];

export default function AdminLoveStoryScreen() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<LoveStoryEvent | null | 'new'>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const { data: events = [], isLoading } = useQuery<LoveStoryEvent[]>({
    queryKey: ['love-story'],
    queryFn: async () => (await apiClient.get('/love-story')).data,
  });

  const inv = () => qc.invalidateQueries({ queryKey: ['love-story'] });

  const createMut = useMutation({
    mutationFn: (b: object) => apiClient.post('/love-story', b),
    onSuccess: () => { inv(); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, b }: { id: string; b: object }) => apiClient.put(`/love-story/${id}`, b),
    onSuccess: () => { inv(); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/love-story/${id}`),
    onSuccess: inv,
  });

  const openNew = () => { setForm({ ...EMPTY, displayOrder: String(events.length + 1) }); setEditing('new'); };
  const openEdit = (e: LoveStoryEvent) => { setForm(itemToForm(e)); setEditing(e); };

  const save = () => {
    const b = { eventDate: form.eventDate.trim(), title: form.title.trim(), description: form.description.trim() || null, displayOrder: parseInt(form.displayOrder) || 1 };
    if (!b.title || !b.eventDate) return;
    if (editing === 'new') createMut.mutate(b);
    else if (editing) updateMut.mutate({ id: editing.id, b });
  };

  const isPending = createMut.isPending || updateMut.isPending;

  if (editing !== null) {
    return (
      <ScrollView style={s.scroll} contentContainerStyle={s.formContent} keyboardShouldPersistTaps="handled">
        <Text style={s.formHeading}>{editing === 'new' ? 'Nová udalosť' : 'Upraviť udalosť'}</Text>

        <Text style={s.label}>Dátum (YYYY-MM-DD) *</Text>
        <TextInput style={s.input} value={form.eventDate} onChangeText={(v) => setForm({ ...form, eventDate: v })} placeholder="2017-09-09" placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Názov *</Text>
        <TextInput style={s.input} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="Prvé stretnutie" placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Popis</Text>
        <TextInput style={[s.input, s.multiline]} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline placeholder="Čo sa stalo..." placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Poradie</Text>
        <TextInput style={s.input} value={form.displayOrder} onChangeText={(v) => setForm({ ...form, displayOrder: v })} keyboardType="numeric" placeholderTextColor={Colors.onSurfaceVariant} />

        <View style={s.formActions}>
          <TouchableOpacity style={s.cancelBtn} onPress={() => setEditing(null)} activeOpacity={0.7}>
            <Text style={s.cancelBtnText}>Zrušiť</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.saveBtn, (!form.title || !form.eventDate) && s.saveBtnDisabled]} onPress={save} disabled={!form.title || !form.eventDate || isPending} activeOpacity={0.8}>
            {isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveBtnText}>Uložiť</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={s.container}>
      <TouchableOpacity style={s.addBtn} onPress={openNew} activeOpacity={0.8}>
        <Feather name="plus" size={16} color="#fff" />
        <Text style={s.addBtnText}>Pridať udalosť</Text>
      </TouchableOpacity>

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        : (
          <ScrollView contentContainerStyle={s.list}>
            {events.map((ev, idx) => {
              const dot = DOT_COLORS[idx % DOT_COLORS.length];
              return (
                <View key={ev.id} style={s.card}>
                  <View style={[s.dot, { backgroundColor: dot }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.cardDate, { color: dot }]}>{fmtDate(ev.eventDate)}</Text>
                    <Text style={s.cardTitle}>{ev.title}</Text>
                    {ev.description && <Text style={s.cardDesc} numberOfLines={2}>{ev.description}</Text>}
                  </View>
                  <View style={s.cardActions}>
                    <TouchableOpacity style={s.actionBtn} onPress={() => openEdit(ev)} activeOpacity={0.7}>
                      <Feather name="edit-2" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.actionBtn} onPress={() =>
                      Alert.alert('Vymazať?', `Vymazať "${ev.title}"?`, [
                        { text: 'Zrušiť', style: 'cancel' },
                        { text: 'Vymazať', style: 'destructive', onPress: () => deleteMut.mutate(ev.id) },
                      ])} activeOpacity={0.7}>
                      <Feather name="trash-2" size={14} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
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
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 5, flexShrink: 0 },
  cardDate: { fontFamily: Typography.bodyMedium, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  cardTitle: { fontFamily: Typography.bodySemiBold, fontSize: 14, color: Colors.onSurface },
  cardDesc: { fontFamily: Typography.body, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2, lineHeight: 18 },
  cardActions: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: {
    width: 32, height: 32, borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center',
  },

  formHeading: { fontFamily: Typography.heading, fontSize: 22, color: Colors.onSurface, marginBottom: Spacing.lg },
  label: { fontFamily: Typography.bodyMedium, fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontFamily: Typography.body, fontSize: 15, color: Colors.onSurface, marginBottom: Spacing.md,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  cancelBtn: { flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.button, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { fontFamily: Typography.bodyMedium, fontSize: 15, color: Colors.onSurfaceVariant },
  saveBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: Radius.button, paddingVertical: 14, alignItems: 'center', ...Shadow.card },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: '#fff' },
});

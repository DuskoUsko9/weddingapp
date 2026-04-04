import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

interface BingoChallenge {
  id: string;
  title: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
}

type FormState = { title: string; description: string; displayOrder: string; isActive: boolean };
const EMPTY: FormState = { title: '', description: '', displayOrder: '', isActive: true };

export default function AdminBingoScreen() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<BingoChallenge | null | 'new'>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const { data: challenges = [], isLoading } = useQuery<BingoChallenge[]>({
    queryKey: ['bingo-admin'],
    queryFn: async () => (await apiClient.get('/bingo-challenges')).data,
  });

  const inv = () => qc.invalidateQueries({ queryKey: ['bingo-admin'] });

  const createMut = useMutation({
    mutationFn: (b: object) => apiClient.post('/bingo-challenges', b),
    onSuccess: () => { inv(); setEditing(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, b }: { id: string; b: object }) => apiClient.put(`/bingo-challenges/${id}`, b),
    onSuccess: () => { inv(); setEditing(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/bingo-challenges/${id}`),
    onSuccess: inv,
  });

  const openNew = () => { setForm({ ...EMPTY, displayOrder: String(challenges.length + 1) }); setEditing('new'); };
  const openEdit = (c: BingoChallenge) => { setForm({ title: c.title, description: c.description ?? '', displayOrder: String(c.displayOrder), isActive: c.isActive }); setEditing(c); };

  const save = () => {
    const b = { title: form.title.trim(), description: form.description.trim() || null, displayOrder: parseInt(form.displayOrder) || 1, isActive: form.isActive };
    if (!b.title) return;
    if (editing === 'new') createMut.mutate(b);
    else if (editing) updateMut.mutate({ id: editing.id, b });
  };

  const isPending = createMut.isPending || updateMut.isPending;
  const active = challenges.filter((c) => c.isActive).length;

  if (editing !== null) {
    return (
      <ScrollView style={s.scroll} contentContainerStyle={s.formContent} keyboardShouldPersistTaps="handled">
        <Text style={s.formHeading}>{editing === 'new' ? 'Nová výzva' : 'Upraviť výzvu'}</Text>

        <Text style={s.label}>Výzva *</Text>
        <TextInput style={s.input} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} placeholder="Ženích sa smeje od ucha k uchu" placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Popis</Text>
        <TextInput style={[s.input, s.multiline]} value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline placeholder="Voliteľný popis..." placeholderTextColor={Colors.onSurfaceVariant} />

        <Text style={s.label}>Poradie</Text>
        <TextInput style={s.input} value={form.displayOrder} onChangeText={(v) => setForm({ ...form, displayOrder: v })} keyboardType="numeric" placeholderTextColor={Colors.onSurfaceVariant} />

        <View style={s.switchRow}>
          <Text style={s.switchLabel}>Aktívna výzva</Text>
          <Switch
            value={form.isActive}
            onValueChange={(v) => setForm({ ...form, isActive: v })}
            trackColor={{ true: Colors.secondary, false: Colors.surfaceContainerHighest }}
            thumbColor={form.isActive ? Colors.onSecondary : Colors.outline}
          />
        </View>

        <View style={s.formActions}>
          <TouchableOpacity style={s.cancelBtn} onPress={() => setEditing(null)} activeOpacity={0.7}>
            <Text style={s.cancelBtnText}>Zrušiť</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.saveBtn, !form.title && s.saveBtnDisabled]} onPress={save} disabled={!form.title || isPending} activeOpacity={0.8}>
            {isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveBtnText}>Uložiť</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.topRow}>
        <View style={s.statsChip}>
          <Feather name="target" size={13} color={Colors.secondary} />
          <Text style={s.statsChipText}>{active} / {challenges.length} aktívnych</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={openNew} activeOpacity={0.8}>
          <Feather name="plus" size={15} color="#fff" />
          <Text style={s.addBtnText}>Pridať výzvu</Text>
        </TouchableOpacity>
      </View>

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        : (
          <ScrollView contentContainerStyle={s.list}>
            {challenges.map((c, idx) => (
              <View key={c.id} style={[s.card, !c.isActive && s.cardInactive]}>
                <View style={s.cardNum}>
                  <Text style={s.cardNumText}>{String(idx + 1).padStart(2, '0')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.cardTitle, !c.isActive && s.cardTitleInactive]}>{c.title}</Text>
                  {c.description && <Text style={s.cardDesc} numberOfLines={1}>{c.description}</Text>}
                </View>
                {!c.isActive && (
                  <View style={s.inactiveBadge}>
                    <Text style={s.inactiveBadgeText}>OFF</Text>
                  </View>
                )}
                <View style={s.cardActions}>
                  <TouchableOpacity style={s.actionBtn} onPress={() => openEdit(c)} activeOpacity={0.7}>
                    <Feather name="edit-2" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() =>
                    Alert.alert('Vymazať?', `Vymazať "${c.title}"?`, [
                      { text: 'Zrušiť', style: 'cancel' },
                      { text: 'Vymazať', style: 'destructive', onPress: () => deleteMut.mutate(c.id) },
                    ])} activeOpacity={0.7}>
                    <Feather name="trash-2" size={14} color={Colors.error} />
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

  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  statsChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.secondaryContainer, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 6,
  },
  statsChipText: { fontFamily: Typography.bodyMedium, fontSize: 12, color: Colors.secondary },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: Radius.button,
    paddingVertical: 8, paddingHorizontal: Spacing.md, ...Shadow.card,
  },
  addBtnText: { fontFamily: Typography.bodySemiBold, fontSize: 13, color: '#fff' },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card,
  },
  cardInactive: { backgroundColor: Colors.surfaceContainerLow, shadowOpacity: 0, elevation: 0 },
  cardNum: {
    width: 32, height: 32, borderRadius: Radius.sm,
    backgroundColor: Colors.primaryFixed, alignItems: 'center', justifyContent: 'center',
  },
  cardNumText: { fontFamily: Typography.heading, fontSize: 12, color: Colors.primary },
  cardTitle: { fontFamily: Typography.bodySemiBold, fontSize: 14, color: Colors.onSurface, lineHeight: 20 },
  cardTitleInactive: { color: Colors.onSurfaceVariant },
  cardDesc: { fontFamily: Typography.body, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  inactiveBadge: {
    backgroundColor: Colors.surfaceContainerHighest, borderRadius: Radius.sm,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  inactiveBadgeText: { fontFamily: Typography.bodyMedium, fontSize: 10, color: Colors.outline, letterSpacing: 0.5 },
  cardActions: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: {
    width: 32, height: 32, borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center',
  },

  switchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 10, marginBottom: Spacing.md,
  },
  switchLabel: { fontFamily: Typography.bodyMedium, fontSize: 14, color: Colors.onSurface },

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

import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { MenuSection, MenuItem } from '../../types/api';

type Mode =
  | null
  | { type: 'newSection' }
  | { type: 'editSection'; section: MenuSection }
  | { type: 'newItem'; sectionId: string; sectionName: string }
  | { type: 'editItem'; item: MenuItem; sectionName: string };

export default function AdminMenuScreen() {
  const qc = useQueryClient();
  const [mode, setMode] = useState<Mode>(null);
  const [sectionForm, setSectionForm] = useState({ name: '', displayOrder: '' });
  const [itemForm, setItemForm] = useState({ name: '', description: '', displayOrder: '' });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data: sections = [], isLoading } = useQuery<MenuSection[]>({
    queryKey: ['menu'],
    queryFn: async () => (await apiClient.get('/menu')).data,
  });

  const inv = () => qc.invalidateQueries({ queryKey: ['menu'] });

  const createSection = useMutation({
    mutationFn: (b: object) => apiClient.post('/menu/sections', b),
    onSuccess: () => { inv(); setMode(null); },
  });
  const updateSection = useMutation({
    mutationFn: ({ id, b }: { id: string; b: object }) => apiClient.put(`/menu/sections/${id}`, b),
    onSuccess: () => { inv(); setMode(null); },
  });
  const deleteSection = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/menu/sections/${id}`),
    onSuccess: inv,
  });
  const createItem = useMutation({
    mutationFn: ({ sectionId, b }: { sectionId: string; b: object }) =>
      apiClient.post(`/menu/sections/${sectionId}/items`, b),
    onSuccess: () => { inv(); setMode(null); },
  });
  const updateItem = useMutation({
    mutationFn: ({ id, b }: { id: string; b: object }) => apiClient.put(`/menu/items/${id}`, b),
    onSuccess: () => { inv(); setMode(null); },
  });
  const deleteItem = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/menu/items/${id}`),
    onSuccess: inv,
  });

  const openNewSection = () => { setSectionForm({ name: '', displayOrder: String(sections.length + 1) }); setMode({ type: 'newSection' }); };
  const openEditSection = (sec: MenuSection) => { setSectionForm({ name: sec.name, displayOrder: String(sec.displayOrder) }); setMode({ type: 'editSection', section: sec }); };
  const openNewItem = (sec: MenuSection) => { setItemForm({ name: '', description: '', displayOrder: String(sec.items.length + 1) }); setMode({ type: 'newItem', sectionId: sec.id, sectionName: sec.name }); };
  const openEditItem = (item: MenuItem, sec: MenuSection) => { setItemForm({ name: item.name, description: item.description ?? '', displayOrder: String(item.displayOrder) }); setMode({ type: 'editItem', item, sectionName: sec.name }); };

  const saveSection = () => {
    const b = { name: sectionForm.name.trim(), displayOrder: parseInt(sectionForm.displayOrder) || 1 };
    if (!b.name) return;
    if (mode?.type === 'newSection') createSection.mutate(b);
    else if (mode?.type === 'editSection') updateSection.mutate({ id: mode.section.id, b });
  };

  const saveItem = () => {
    const b = { name: itemForm.name.trim(), description: itemForm.description.trim() || null, displayOrder: parseInt(itemForm.displayOrder) || 1 };
    if (!b.name) return;
    if (mode?.type === 'newItem') createItem.mutate({ sectionId: mode.sectionId, b });
    else if (mode?.type === 'editItem') updateItem.mutate({ id: mode.item.id, b });
  };

  const isPending = createSection.isPending || updateSection.isPending || createItem.isPending || updateItem.isPending;

  // ── Form view ─────────────────────────────────────────────
  if (mode !== null) {
    const isSection = mode.type === 'newSection' || mode.type === 'editSection';
    const heading = mode.type === 'newSection' ? 'Nová sekcia'
      : mode.type === 'editSection' ? 'Upraviť sekciu'
      : mode.type === 'newItem' ? `Nová položka — ${mode.sectionName}`
      : `Upraviť položku — ${(mode as any).sectionName}`;

    return (
      <ScrollView style={s.scroll} contentContainerStyle={s.formContent} keyboardShouldPersistTaps="handled">
        <Text style={s.formHeading}>{heading}</Text>

        {isSection ? (
          <>
            <Text style={s.label}>Názov sekcie *</Text>
            <TextInput style={s.input} value={sectionForm.name} onChangeText={(v) => setSectionForm({ ...sectionForm, name: v })} placeholder="Predjedlá" placeholderTextColor={Colors.onSurfaceVariant} />
            <Text style={s.label}>Poradie</Text>
            <TextInput style={s.input} value={sectionForm.displayOrder} onChangeText={(v) => setSectionForm({ ...sectionForm, displayOrder: v })} keyboardType="numeric" placeholderTextColor={Colors.onSurfaceVariant} />
          </>
        ) : (
          <>
            <Text style={s.label}>Názov jedla *</Text>
            <TextInput style={s.input} value={itemForm.name} onChangeText={(v) => setItemForm({ ...itemForm, name: v })} placeholder="Slepačia polievka" placeholderTextColor={Colors.onSurfaceVariant} />
            <Text style={s.label}>Popis</Text>
            <TextInput style={[s.input, s.multiline]} value={itemForm.description} onChangeText={(v) => setItemForm({ ...itemForm, description: v })} multiline placeholder="Popis jedla..." placeholderTextColor={Colors.onSurfaceVariant} />
            <Text style={s.label}>Poradie</Text>
            <TextInput style={s.input} value={itemForm.displayOrder} onChangeText={(v) => setItemForm({ ...itemForm, displayOrder: v })} keyboardType="numeric" placeholderTextColor={Colors.onSurfaceVariant} />
          </>
        )}

        <View style={s.formActions}>
          <TouchableOpacity style={s.cancelBtn} onPress={() => setMode(null)} activeOpacity={0.7}>
            <Text style={s.cancelBtnText}>Zrušiť</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.saveBtn, isPending && s.saveBtnDisabled]} onPress={isSection ? saveSection : saveItem} disabled={isPending} activeOpacity={0.8}>
            {isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveBtnText}>Uložiť</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── List view ─────────────────────────────────────────────
  return (
    <View style={s.container}>
      <TouchableOpacity style={s.addBtn} onPress={openNewSection} activeOpacity={0.8}>
        <Feather name="plus" size={16} color="#fff" />
        <Text style={s.addBtnText}>Pridať sekciu</Text>
      </TouchableOpacity>

      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        : (
          <ScrollView contentContainerStyle={s.list}>
            {sections.map((sec) => (
              <View key={sec.id} style={s.sectionCard}>
                {/* Section header */}
                <TouchableOpacity
                  style={s.sectionHeader}
                  onPress={() => setExpanded({ ...expanded, [sec.id]: !expanded[sec.id] })}
                  activeOpacity={0.7}
                >
                  <Feather name={expanded[sec.id] ? 'chevron-down' : 'chevron-right'} size={16} color={Colors.onSurfaceVariant} />
                  <Text style={s.sectionName}>{sec.name}</Text>
                  <Text style={s.sectionCount}>{sec.items.length} pol.</Text>
                  <TouchableOpacity style={s.iconBtn} onPress={() => openEditSection(sec)} activeOpacity={0.7}>
                    <Feather name="edit-2" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.iconBtn} onPress={() =>
                    Alert.alert('Vymazať sekciu?', `Vymaže sa aj ${sec.items.length} položiek.`, [
                      { text: 'Zrušiť', style: 'cancel' },
                      { text: 'Vymazať', style: 'destructive', onPress: () => deleteSection.mutate(sec.id) },
                    ])} activeOpacity={0.7}>
                    <Feather name="trash-2" size={14} color={Colors.error} />
                  </TouchableOpacity>
                </TouchableOpacity>

                {/* Items */}
                {expanded[sec.id] && (
                  <View style={s.itemsWrap}>
                    {sec.items.map((item, i) => (
                      <View key={item.id} style={[s.itemRow, i < sec.items.length - 1 && s.itemBorder]}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.itemName}>{item.name}</Text>
                          {item.description && <Text style={s.itemDesc} numberOfLines={1}>{item.description}</Text>}
                        </View>
                        <TouchableOpacity style={s.iconBtn} onPress={() => openEditItem(item, sec)} activeOpacity={0.7}>
                          <Feather name="edit-2" size={14} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={s.iconBtn} onPress={() =>
                          Alert.alert('Vymazať?', `Vymazať "${item.name}"?`, [
                            { text: 'Zrušiť', style: 'cancel' },
                            { text: 'Vymazať', style: 'destructive', onPress: () => deleteItem.mutate(item.id) },
                          ])} activeOpacity={0.7}>
                          <Feather name="trash-2" size={14} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity style={s.addItemBtn} onPress={() => openNewItem(sec)} activeOpacity={0.7}>
                      <Feather name="plus" size={13} color={Colors.secondary} />
                      <Text style={s.addItemBtnText}>Pridať jedlo</Text>
                    </TouchableOpacity>
                  </View>
                )}
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

  sectionCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    marginBottom: Spacing.sm, overflow: 'hidden', ...Shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.sm,
  },
  sectionName: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: Colors.onSurface, flex: 1 },
  sectionCount: { fontFamily: Typography.body, fontSize: 12, color: Colors.onSurfaceVariant },
  iconBtn: {
    width: 32, height: 32, borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center',
  },

  itemsWrap: { borderTopWidth: 1, borderTopColor: Colors.surfaceContainerLow },
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 10, gap: Spacing.sm,
  },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerLow },
  itemName: { fontFamily: Typography.bodyMedium, fontSize: 14, color: Colors.onSurface },
  itemDesc: { fontFamily: Typography.body, fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 1 },
  addItemBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    backgroundColor: Colors.secondaryContainer,
  },
  addItemBtnText: { fontFamily: Typography.bodyMedium, fontSize: 13, color: Colors.secondary },

  formHeading: { fontFamily: Typography.heading, fontSize: 22, color: Colors.onSurface, marginBottom: Spacing.lg },
  label: { fontFamily: Typography.bodyMedium, fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontFamily: Typography.body, fontSize: 15, color: Colors.onSurface, marginBottom: Spacing.md,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  formActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  cancelBtn: {
    flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: Radius.button,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontFamily: Typography.bodyMedium, fontSize: 15, color: Colors.onSurfaceVariant },
  saveBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: Radius.button, paddingVertical: 14, alignItems: 'center', ...Shadow.card },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: '#fff' },
});

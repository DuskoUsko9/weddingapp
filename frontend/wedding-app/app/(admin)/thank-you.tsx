import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { ThankYouMessage, GuestDto } from '../../types/api';

type Form = { message: string; photoUrl: string };
const EMPTY: Form = { message: '', photoUrl: '' };

export default function AdminThankYouScreen() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null); // guestId
  const [form, setForm] = useState<Form>(EMPTY);
  const [search, setSearch] = useState('');
  const [guestPickerVisible, setGuestPickerVisible] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  const { data: messages = [], isLoading } = useQuery<ThankYouMessage[]>({
    queryKey: ['admin-thankyou'],
    queryFn: async () => (await apiClient.get('/thank-you')).data,
  });

  const { data: allGuests = [] } = useQuery<GuestDto[]>({
    queryKey: ['admin-guests'],
    queryFn: async () => (await apiClient.get('/admin/guests')).data,
    enabled: guestPickerVisible,
  });

  const inv = () => qc.invalidateQueries({ queryKey: ['admin-thankyou'] });

  const upsertMut = useMutation({
    mutationFn: ({ guestId, body }: { guestId: string; body: object }) =>
      apiClient.put(`/thank-you/${guestId}`, body),
    onSuccess: () => { inv(); setEditing(null); },
  });

  const deleteMut = useMutation({
    mutationFn: (guestId: string) => apiClient.delete(`/thank-you/${guestId}`),
    onSuccess: inv,
  });

  const openNew = (guestId: string) => {
    setEditing(guestId);
    setForm(EMPTY);
    setGuestPickerVisible(false);
  };

  const openEdit = (m: ThankYouMessage) => {
    setEditing(m.guestId);
    setForm({ message: m.message, photoUrl: m.photoUrl ?? '' });
  };

  const save = () => {
    if (!editing || !form.message.trim()) return;
    upsertMut.mutate({
      guestId: editing,
      body: { message: form.message.trim(), photoUrl: form.photoUrl.trim() || null },
    });
  };

  const filtered = messages.filter((m) =>
    m.guestName.toLowerCase().includes(search.toLowerCase())
  );

  const withMessageIds = new Set(messages.map((m) => m.guestId));
  const guestsWithoutMessage = allGuests.filter(
    (g) => !withMessageIds.has(g.id) && g.fullName.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Poďakovania</Text>
          <TouchableOpacity style={s.addBtn} onPress={() => setGuestPickerVisible(true)}>
            <Feather name="plus" size={16} color={Colors.onPrimary} />
            <Text style={s.addBtnText}>Pridať</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.hint}>
          Každý hosť vidí len svoju správu po 6.9.2026 o 8:00.
        </Text>

        {/* Search */}
        <View style={s.searchWrap}>
          <Feather name="search" size={15} color={Colors.outline} />
          <TextInput
            style={s.searchInput}
            placeholder="Hľadaj hosťa..."
            placeholderTextColor={Colors.outline}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isLoading && <ActivityIndicator color={Colors.primary} style={{ margin: Spacing.xl }} />}

        {filtered.length > 0 && (
          <View style={[s.card, { marginHorizontal: Spacing.md, marginBottom: Spacing.md }]}>
            {filtered.map((m, i) => (
              <View key={m.guestId} style={[s.row, i < filtered.length - 1 && s.rowBorder]}>
                <View style={s.rowIcon}>
                  <Feather name="heart" size={14} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.guestName}>{m.guestName}</Text>
                  <Text style={s.messagePreview} numberOfLines={1}>{m.message}</Text>
                </View>
                <TouchableOpacity onPress={() => openEdit(m)} style={s.actionBtn}>
                  <Feather name="edit-2" size={15} color={Colors.outline} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMut.mutate(m.guestId)} style={s.actionBtn}>
                  <Feather name="trash-2" size={15} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {!isLoading && messages.length === 0 && (
          <Text style={s.empty}>Žiadne správy. Pridaj poďakovanie pomocou tlačidla.</Text>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit modal */}
      <Modal visible={editing !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditing(null)}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Poďakovanie</Text>
            <TouchableOpacity onPress={() => setEditing(null)}>
              <Feather name="x" size={22} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <View style={s.formField}>
              <Text style={s.label}>Správa *</Text>
              <TextInput
                style={[s.input, s.textarea]}
                placeholder="Napíš osobné poďakovanie..."
                placeholderTextColor={Colors.outline}
                value={form.message}
                onChangeText={(v) => setForm({ ...form, message: v })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            <View style={s.formField}>
              <Text style={s.label}>URL fotky (voliteľné)</Text>
              <TextInput
                style={s.input}
                placeholder="https://..."
                placeholderTextColor={Colors.outline}
                value={form.photoUrl}
                onChangeText={(v) => setForm({ ...form, photoUrl: v })}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <TouchableOpacity
              style={[s.saveBtn, (!form.message.trim() || upsertMut.isPending) && s.saveBtnDisabled]}
              onPress={save}
              disabled={!form.message.trim() || upsertMut.isPending}
            >
              {upsertMut.isPending
                ? <ActivityIndicator color={Colors.onPrimary} size="small" />
                : <Text style={s.saveBtnText}>Uložiť</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Guest picker modal */}
      <Modal visible={guestPickerVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setGuestPickerVisible(false)}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Vybrať hosťa</Text>
            <TouchableOpacity onPress={() => setGuestPickerVisible(false)}>
              <Feather name="x" size={22} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>
          <View style={s.searchWrap}>
            <Feather name="search" size={15} color={Colors.outline} />
            <TextInput
              style={s.searchInput}
              placeholder="Hľadaj..."
              placeholderTextColor={Colors.outline}
              value={filterSearch}
              onChangeText={setFilterSearch}
              autoFocus
            />
          </View>
          <FlatList
            data={guestsWithoutMessage}
            keyExtractor={(g) => g.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={s.guestPickerRow} onPress={() => openNew(item.id)}>
                <View style={s.rowIcon}>
                  <Feather name="user" size={14} color={Colors.secondary} />
                </View>
                <Text style={s.guestName}>{item.fullName}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.surfaceContainerLow }} />}
            ListEmptyComponent={<Text style={s.empty}>Všetci hostia majú správu.</Text>}
          />
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xs,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.onSurface,
  },
  hint: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  addBtnText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.onPrimary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    margin: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadow.card,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    paddingVertical: Spacing.md,
    outlineStyle: 'none' as any,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: Spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestName: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.onSurface,
  },
  messagePreview: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  actionBtn: { padding: 6 },
  empty: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },

  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  modalTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.onSurface,
  },
  formField: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  label: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs,
  },
  input: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.md,
    padding: Spacing.md,
    outlineStyle: 'none' as any,
  },
  textarea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  saveBtn: {
    margin: Spacing.lg,
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    padding: Spacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Colors.onPrimary,
  },
  guestPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    gap: Spacing.md,
  },
});

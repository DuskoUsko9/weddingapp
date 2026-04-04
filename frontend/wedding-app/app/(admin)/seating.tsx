import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { SeatingAssignment, GuestDto } from '../../types/api';

type Form = { tableNumber: string; tableName: string; seatNote: string };
const EMPTY: Form = { tableNumber: '', tableName: '', seatNote: '' };

export default function AdminSeatingScreen() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null); // guestId being edited
  const [form, setForm] = useState<Form>(EMPTY);
  const [search, setSearch] = useState('');
  const [guestPickerVisible, setGuestPickerVisible] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  const { data: assignments = [], isLoading } = useQuery<SeatingAssignment[]>({
    queryKey: ['admin-seating'],
    queryFn: async () => (await apiClient.get('/seating')).data,
  });

  const { data: allGuests = [] } = useQuery<GuestDto[]>({
    queryKey: ['admin-guests'],
    queryFn: async () => (await apiClient.get('/admin/guests')).data,
    enabled: guestPickerVisible,
  });

  const inv = () => qc.invalidateQueries({ queryKey: ['admin-seating'] });

  const upsertMut = useMutation({
    mutationFn: ({ guestId, body }: { guestId: string; body: object }) =>
      apiClient.put(`/seating/${guestId}`, body),
    onSuccess: () => { inv(); setEditing(null); },
  });

  const deleteMut = useMutation({
    mutationFn: (guestId: string) => apiClient.delete(`/seating/${guestId}`),
    onSuccess: inv,
  });

  const openNew = (guestId: string, guestName: string) => {
    setEditing(guestId);
    setForm({ tableNumber: '', tableName: '', seatNote: '' });
    setGuestPickerVisible(false);
  };

  const openEdit = (a: SeatingAssignment) => {
    setEditing(a.guestId);
    setForm({ tableNumber: String(a.tableNumber), tableName: a.tableName ?? '', seatNote: a.seatNote ?? '' });
  };

  const save = () => {
    if (!editing || !form.tableNumber) return;
    upsertMut.mutate({
      guestId: editing,
      body: {
        tableNumber: parseInt(form.tableNumber),
        tableName: form.tableName.trim() || null,
        seatNote: form.seatNote.trim() || null,
      },
    });
  };

  const filtered = assignments.filter((a) =>
    a.guestName.toLowerCase().includes(search.toLowerCase())
  );

  // Group by table
  const byTable = filtered.reduce<Record<number, SeatingAssignment[]>>((acc, a) => {
    (acc[a.tableNumber] ??= []).push(a);
    return acc;
  }, {});
  const tables = Object.keys(byTable).map(Number).sort((a, b) => a - b);

  const assignedGuestIds = new Set(assignments.map((a) => a.guestId));
  const unassignedGuests = allGuests.filter(
    (g) => !assignedGuestIds.has(g.id) && g.fullName.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Zasadací poriadok</Text>
          <TouchableOpacity style={s.addBtn} onPress={() => setGuestPickerVisible(true)}>
            <Feather name="plus" size={16} color={Colors.onPrimary} />
            <Text style={s.addBtnText}>Pridať</Text>
          </TouchableOpacity>
        </View>

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

        {tables.map((tableNum) => (
          <View key={tableNum} style={s.tableGroup}>
            <View style={s.tableHeader}>
              <Text style={s.tableLabel}>Stôl {tableNum}</Text>
              {byTable[tableNum][0]?.tableName ? (
                <Text style={s.tableNameLabel}>{byTable[tableNum][0].tableName}</Text>
              ) : null}
            </View>
            <View style={s.card}>
              {byTable[tableNum].map((a, i) => (
                <View key={a.guestId} style={[s.row, i < byTable[tableNum].length - 1 && s.rowBorder]}>
                  <View style={s.rowIcon}>
                    <Feather name="user" size={14} color={Colors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.guestName}>{a.guestName}</Text>
                    {a.seatNote ? <Text style={s.seatNote}>{a.seatNote}</Text> : null}
                  </View>
                  <TouchableOpacity onPress={() => openEdit(a)} style={s.actionBtn}>
                    <Feather name="edit-2" size={15} color={Colors.outline} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteMut.mutate(a.guestId)} style={s.actionBtn}>
                    <Feather name="trash-2" size={15} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}

        {!isLoading && assignments.length === 0 && (
          <Text style={s.empty}>Žiadne priradenia. Pridaj hostí pomocou tlačidla vyššie.</Text>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit modal */}
      <Modal visible={editing !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditing(null)}>
        <View style={s.modal}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Priradenie miesta</Text>
            <TouchableOpacity onPress={() => setEditing(null)}>
              <Feather name="x" size={22} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          <View style={s.formField}>
            <Text style={s.label}>Číslo stola *</Text>
            <TextInput
              style={s.input}
              placeholder="napr. 5"
              placeholderTextColor={Colors.outline}
              value={form.tableNumber}
              onChangeText={(v) => setForm({ ...form, tableNumber: v })}
              keyboardType="number-pad"
            />
          </View>
          <View style={s.formField}>
            <Text style={s.label}>Názov stola (voliteľné)</Text>
            <TextInput
              style={s.input}
              placeholder="napr. Zlatý stôl"
              placeholderTextColor={Colors.outline}
              value={form.tableName}
              onChangeText={(v) => setForm({ ...form, tableName: v })}
            />
          </View>
          <View style={s.formField}>
            <Text style={s.label}>Poznámka (voliteľné)</Text>
            <TextInput
              style={s.input}
              placeholder="napr. Vedľa okna"
              placeholderTextColor={Colors.outline}
              value={form.seatNote}
              onChangeText={(v) => setForm({ ...form, seatNote: v })}
            />
          </View>

          <TouchableOpacity
            style={[s.saveBtn, (!form.tableNumber || upsertMut.isPending) && s.saveBtnDisabled]}
            onPress={save}
            disabled={!form.tableNumber || upsertMut.isPending}
          >
            {upsertMut.isPending ? (
              <ActivityIndicator color={Colors.onPrimary} size="small" />
            ) : (
              <Text style={s.saveBtnText}>Uložiť</Text>
            )}
          </TouchableOpacity>
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
            data={unassignedGuests}
            keyExtractor={(g) => g.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={s.guestPickerRow} onPress={() => openNew(item.id, item.fullName)}>
                <View style={s.rowIcon}>
                  <Feather name="user" size={14} color={Colors.secondary} />
                </View>
                <Text style={s.guestName}>{item.fullName}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.surfaceContainerLow }} />}
            ListEmptyComponent={<Text style={s.empty}>Všetci hostia sú priradení.</Text>}
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
    paddingBottom: Spacing.sm,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.onSurface,
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
  tableGroup: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
    paddingHorizontal: 2,
  },
  tableLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tableNameLabel: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
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
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestName: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
  },
  seatNote: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  actionBtn: {
    padding: 6,
  },
  empty: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },

  // Modal
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
  saveBtn: {
    margin: Spacing.lg,
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    padding: Spacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
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

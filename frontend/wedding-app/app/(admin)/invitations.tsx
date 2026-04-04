import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert, Modal, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

type GuestInvitationStatus = {
  guestId: string;
  fullName: string;
  email: string | null;
  invitationSent: boolean;
  invitationSentAt: string | null;
};

function formatSentAt(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('sk-SK', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function InvitationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 768;

  const [search, setSearch] = useState('');
  const [editingGuest, setEditingGuest] = useState<GuestInvitationStatus | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [filterSent, setFilterSent] = useState<'all' | 'sent' | 'unsent'>('all');

  const { data: guests = [], isLoading } = useQuery<GuestInvitationStatus[]>({
    queryKey: ['invitations'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/invitations');
      return res.data as GuestInvitationStatus[];
    },
  });

  const sendOne = useMutation({
    mutationFn: (guestId: string) => apiClient.post(`/admin/invitations/${guestId}/send`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invitations'] }),
    onError: (err: any) => Alert.alert('Chyba', err.message),
  });

  const sendAll = useMutation({
    mutationFn: (resend: boolean) =>
      apiClient.post('/admin/invitations/send-all', { resendAlreadySent: resend }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      const r = res.data as any;
      Alert.alert(
        'Odoslané!',
        `Odoslaných: ${r.sent}\nPreskočených: ${r.skipped}${r.errors?.length ? `\nChyby (${r.errors.length}):\n${r.errors.slice(0, 3).join('\n')}` : ''}`,
      );
    },
    onError: (err: any) => Alert.alert('Chyba', err.message),
  });

  const updateEmail = useMutation({
    mutationFn: ({ guestId, email }: { guestId: string; email: string | null }) =>
      apiClient.patch(`/admin/guests/${guestId}/email`, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      setEditingGuest(null);
    },
    onError: (err: any) => Alert.alert('Chyba', err.message),
  });

  const filtered = guests.filter((g) => {
    const matchesSearch =
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (g.email ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterSent === 'all' ||
      (filterSent === 'sent' && g.invitationSent) ||
      (filterSent === 'unsent' && !g.invitationSent);
    return matchesSearch && matchesFilter;
  });

  const sentCount = guests.filter((g) => g.invitationSent).length;
  const withEmailCount = guests.filter((g) => g.email).length;
  const pendingCount = guests.filter((g) => g.email && !g.invitationSent).length;

  const confirmSendAll = (resend: boolean) => {
    const msg = resend
      ? `Odoslať pozvánky VŠETKÝM hostím s emailom (vrátane tých, ktorým už bola odoslaná)? Celkom: ${withEmailCount}`
      : `Odoslať pozvánky ${pendingCount} hosťom, ktorí ešte nedostali pozvánku?`;
    Alert.alert('Potvrdiť odoslanie', msg, [
      { text: 'Zrušiť', style: 'cancel' },
      { text: 'Odoslať', style: 'default', onPress: () => sendAll.mutate(resend) },
    ]);
  };

  const openEditEmail = (guest: GuestInvitationStatus) => {
    setEditingGuest(guest);
    setEditEmail(guest.email ?? '');
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Pozvánky</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{sentCount}</Text>
            <Text style={styles.statLabel}>Odoslaných</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{withEmailCount}</Text>
            <Text style={styles.statLabel}>Má email</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, pendingCount > 0 && { color: Colors.primary }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Čaká</Text>
          </View>
        </View>

        {/* Bulk actions */}
        <View style={styles.bulkRow}>
          <TouchableOpacity
            style={[styles.bulkBtn, styles.bulkBtnPrimary, (sendAll.isPending || pendingCount === 0) && styles.btnDisabled]}
            onPress={() => confirmSendAll(false)}
            disabled={sendAll.isPending || pendingCount === 0}
          >
            {sendAll.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="send" size={16} color="#fff" />
            )}
            <Text style={styles.bulkBtnTextWhite}>Odoslať nevyriešené ({pendingCount})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bulkBtn, styles.bulkBtnOutline, sendAll.isPending && styles.btnDisabled]}
            onPress={() => confirmSendAll(true)}
            disabled={sendAll.isPending}
          >
            <Feather name="refresh-cw" size={16} color={Colors.primary} />
            <Text style={styles.bulkBtnTextGold}>Odoslať všetkým</Text>
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {(['all', 'unsent', 'sent'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filterSent === f && styles.filterTabActive]}
              onPress={() => setFilterSent(f)}
            >
              <Text style={[styles.filterTabText, filterSent === f && styles.filterTabTextActive]}>
                {f === 'all' ? 'Všetci' : f === 'sent' ? 'Odoslaní' : 'Neodoslaní'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Hľadaj meno alebo email..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* List */}
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : (
          <View style={styles.listContainer}>
            {filtered.map((item) => (
              <View key={item.guestId} style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={[
                    styles.statusDot,
                    item.invitationSent ? styles.dotSent : item.email ? styles.dotPending : styles.dotNoEmail,
                  ]} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.guestName}>{item.fullName}</Text>
                    <TouchableOpacity onPress={() => openEditEmail(item)} style={styles.emailRow}>
                      {item.email ? (
                        <Text style={styles.emailText}>{item.email}</Text>
                      ) : (
                        <Text style={styles.noEmailText}>+ Pridať email</Text>
                      )}
                      <Feather name="edit-2" size={12} color={Colors.primary} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                    {item.invitationSentAt && (
                      <Text style={styles.sentAtText}>Odoslaná {formatSentAt(item.invitationSentAt)}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.rowActions}>
                  {item.email && (
                    <TouchableOpacity
                      style={[styles.sendBtn, item.invitationSent && styles.resendBtn]}
                      onPress={() => {
                        if (item.invitationSent) {
                          Alert.alert('Znova odoslať?', `Hosťovi ${item.fullName} už bola pozvánka odoslaná. Odoslať znova?`, [
                            { text: 'Zrušiť', style: 'cancel' },
                            { text: 'Odoslať', onPress: () => sendOne.mutate(item.guestId) },
                          ]);
                        } else {
                          sendOne.mutate(item.guestId);
                        }
                      }}
                      disabled={sendOne.isPending}
                    >
                      <Feather name={item.invitationSent ? 'refresh-cw' : 'send'} size={14} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            {filtered.length === 0 && (
              <Text style={styles.emptyText}>Žiadni hostia nenájdení.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit email modal */}
      <Modal visible={!!editingGuest} transparent animationType="fade" onRequestClose={() => setEditingGuest(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Email pre {editingGuest?.fullName}</Text>
            <TextInput
              style={styles.modalInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="meno@gmail.com"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditingGuest(null)}>
                <Text style={styles.modalCancelText}>Zrušiť</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={() => updateEmail.mutate({ guestId: editingGuest!.guestId, email: editEmail.trim() || null })}
                disabled={updateEmail.isPending}
              >
                {updateEmail.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Uložiť</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  backBtn: { padding: Spacing.xs },
  title: { fontFamily: Typography.heading, fontSize: 24, color: Colors.textPrimary },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: 40 },
  contentWide: { maxWidth: 720, alignSelf: 'center', width: '100%' },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', ...Shadow.card,
  },
  statNum: { fontFamily: Typography.heading, fontSize: 28, color: Colors.primary },
  statLabel: { fontFamily: Typography.body, fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },

  bulkRow: { gap: Spacing.sm, marginBottom: Spacing.md },
  bulkBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, padding: Spacing.md, borderRadius: Radius.button,
  },
  bulkBtnPrimary: { backgroundColor: Colors.primary },
  bulkBtnOutline: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.primary },
  bulkBtnTextWhite: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: '#fff' },
  bulkBtnTextGold: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: Colors.primary },
  btnDisabled: { opacity: 0.4 },

  filterRow: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.md },
  filterTab: {
    flex: 1, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center',
  },
  filterTabActive: { backgroundColor: Colors.primaryFixed },
  filterTabText: { fontFamily: Typography.body, fontSize: 12, color: Colors.textSecondary },
  filterTabTextActive: { fontFamily: Typography.bodySemiBold, fontSize: 12, color: Colors.primary },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    gap: Spacing.sm, marginBottom: Spacing.md, ...Shadow.card,
  },
  searchInput: { flex: 1, fontFamily: Typography.body, fontSize: 15, color: Colors.textPrimary },

  listContainer: { gap: Spacing.xs },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, ...Shadow.card,
  },
  rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  dotSent: { backgroundColor: '#4caf50' },
  dotPending: { backgroundColor: Colors.primary },
  dotNoEmail: { backgroundColor: Colors.textSecondary },
  rowInfo: { flex: 1 },
  guestName: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: Colors.textPrimary },
  emailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  emailText: { fontFamily: Typography.body, fontSize: 12, color: Colors.textSecondary },
  noEmailText: { fontFamily: Typography.body, fontSize: 12, color: Colors.primary },
  sentAtText: { fontFamily: Typography.body, fontSize: 11, color: '#4caf50', marginTop: 2 },
  rowActions: { marginLeft: Spacing.sm },
  sendBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  resendBtn: { backgroundColor: Colors.textSecondary },

  emptyText: { fontFamily: Typography.body, fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xl },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  modalCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.lg, width: '100%', maxWidth: 400 },
  modalTitle: { fontFamily: Typography.heading, fontSize: 18, color: Colors.textPrimary, marginBottom: Spacing.md },
  modalInput: {
    borderWidth: 1.5, borderColor: Colors.surfaceContainerLow, borderRadius: Radius.lg,
    padding: Spacing.md, fontFamily: Typography.body, fontSize: 15, color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  modalActions: { flexDirection: 'row', gap: Spacing.sm },
  modalCancel: { flex: 1, padding: Spacing.md, borderRadius: Radius.button, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center' },
  modalCancelText: { fontFamily: Typography.body, fontSize: 15, color: Colors.textSecondary },
  modalSave: { flex: 1, padding: Spacing.md, borderRadius: Radius.button, backgroundColor: Colors.primary, alignItems: 'center' },
  modalSaveText: { fontFamily: Typography.bodySemiBold, fontSize: 15, color: '#fff' },
});

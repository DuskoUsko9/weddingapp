import { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

interface GuestDto {
  id: string;
  fullName: string;
  side: string;
  isChild: boolean;
  isConfirmed: boolean;
  category: string;
}

const SIDE_LABELS: Record<string, string> = {
  Bride: 'Nevesta',
  Groom: 'Ženích',
};

const CATEGORY_LABELS: Record<string, string> = {
  Family: 'Rodina',
  Friends: 'Priatelia',
  Colleagues: 'Kolegovia',
  Other: 'Ostatní',
};

export default function AdminGuestsScreen() {
  const [search, setSearch] = useState('');

  const { data: guests = [], isLoading } = useQuery<GuestDto[]>({
    queryKey: ['admin-guests', search],
    queryFn: async () =>
      (await apiClient.get('/admin/guests', { params: { search: search || undefined } })).data,
  });

  const confirmed = guests.filter((g) => g.isConfirmed).length;

  return (
    <View style={s.container}>

      {/* ── Search bar ─────────────────────────────────────── */}
      <View style={s.searchWrap}>
        <Feather name="search" size={16} color={Colors.onSurfaceVariant} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Hľadaj hosťa..."
          placeholderTextColor={Colors.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="words"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <Feather
            name="x"
            size={16}
            color={Colors.onSurfaceVariant}
            onPress={() => setSearch('')}
          />
        )}
      </View>

      {/* ── Summary chips ──────────────────────────────────── */}
      <View style={s.chips}>
        <View style={[s.chip, { backgroundColor: Colors.surfaceContainerLow }]}>
          <Feather name="users" size={13} color={Colors.onSurfaceVariant} />
          <Text style={s.chipText}>{guests.length} hostí</Text>
        </View>
        <View style={[s.chip, { backgroundColor: Colors.secondaryContainer }]}>
          <Feather name="check-circle" size={13} color={Colors.secondary} />
          <Text style={[s.chipText, { color: Colors.secondary }]}>{confirmed} potvrdených</Text>
        </View>
        {guests.length - confirmed > 0 && (
          <View style={[s.chip, { backgroundColor: Colors.primaryFixed }]}>
            <Feather name="clock" size={13} color={Colors.primary} />
            <Text style={[s.chipText, { color: Colors.primary }]}>{guests.length - confirmed} čaká</Text>
          </View>
        )}
      </View>

      {/* ── Guest list ─────────────────────────────────────── */}
      {isLoading
        ? <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        : (
          <FlatList
            data={guests}
            keyExtractor={(g) => g.id}
            contentContainerStyle={s.list}
            renderItem={({ item }) => (
              <View style={s.card}>
                {/* Avatar */}
                <View style={[s.avatar, { backgroundColor: item.side === 'Bride' ? Colors.secondaryContainer : Colors.primaryFixed }]}>
                  <Text style={[s.avatarText, { color: item.side === 'Bride' ? Colors.secondary : Colors.primary }]}>
                    {item.fullName.charAt(0)}
                  </Text>
                </View>

                {/* Name + meta */}
                <View style={s.cardBody}>
                  <Text style={s.name}>{item.fullName}</Text>
                  <View style={s.metaRow}>
                    <Text style={s.meta}>{CATEGORY_LABELS[item.category] ?? item.category}</Text>
                    <Text style={s.metaDot}>·</Text>
                    <Text style={s.meta}>{SIDE_LABELS[item.side] ?? item.side}</Text>
                    {item.isChild && (
                      <>
                        <Text style={s.metaDot}>·</Text>
                        <Text style={s.meta}>dieťa</Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Confirmed chip */}
                {item.isConfirmed
                  ? (
                    <View style={s.confirmedChip}>
                      <Feather name="check" size={11} color={Colors.secondary} />
                    </View>
                  )
                  : (
                    <View style={s.pendingChip}>
                      <Feather name="clock" size={11} color={Colors.outline} />
                    </View>
                  )
                }
              </View>
            )}
          />
        )
      }
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.md,
    margin: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    paddingVertical: 0,
  },

  // Chips
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  chipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },

  // List
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.card,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: Typography.heading,
    fontSize: 16,
  },
  cardBody: { flex: 1 },
  name: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1, flexWrap: 'wrap' },
  meta: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  metaDot: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.outlineVariant,
  },
  confirmedChip: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingChip: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

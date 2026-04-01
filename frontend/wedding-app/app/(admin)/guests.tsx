import { useState } from 'react';
import {
  View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
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

export default function AdminGuestsScreen() {
  const [search, setSearch] = useState('');

  const { data: guests = [], isLoading } = useQuery<GuestDto[]>({
    queryKey: ['admin-guests', search],
    queryFn: async () =>
      (await apiClient.get('/admin/guests', { params: { search: search || undefined } })).data,
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Hľadaj hosťa..."
        placeholderTextColor={Colors.textSecondary}
        value={search}
        onChangeText={setSearch}
      />
      <Text style={styles.count}>{guests.length} hostí</Text>
      {isLoading
        ? <ActivityIndicator color={Colors.primary} />
        : (
          <FlatList
            data={guests}
            keyExtractor={(g) => g.id}
            renderItem={({ item }) => (
              <View style={styles.guestCard}>
                <View>
                  <Text style={styles.name}>{item.fullName}</Text>
                  <Text style={styles.meta}>
                    {item.category} · {item.side}{item.isChild ? ' · dieťa' : ''}
                  </Text>
                </View>
                {item.isConfirmed && (
                  <Text style={styles.confirmed}>✓</Text>
                )}
              </View>
            )}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  search: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  count: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  guestCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadow.card,
  },
  name: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  meta: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  confirmed: {
    fontFamily: Typography.bodyMedium,
    fontSize: 18,
    color: Colors.accent,
  },
});

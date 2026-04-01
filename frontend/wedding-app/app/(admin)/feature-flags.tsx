import { View, Text, FlatList, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { FeatureFlag } from '../../types/api';

export default function FeatureFlagsScreen() {
  const qc = useQueryClient();

  const { data: flags = [], isLoading } = useQuery<FeatureFlag[]>({
    queryKey: ['feature-flags-admin'],
    queryFn: async () => (await apiClient.get('/feature-flags')).data,
  });

  const { mutate } = useMutation({
    mutationFn: ({ key, isManuallyEnabled, isManuallyDisabled }: {
      key: string; isManuallyEnabled: boolean; isManuallyDisabled: boolean;
    }) =>
      apiClient.patch(`/feature-flags/${key}`, { isManuallyEnabled, isManuallyDisabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feature-flags-admin'] }),
  });

  const toggle = (flag: FeatureFlag, value: boolean) => {
    mutate({
      key: flag.key,
      isManuallyEnabled: value,
      isManuallyDisabled: !value,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={flags}
        keyExtractor={(f) => f.key}
        contentContainerStyle={{ padding: Spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.flagCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.key}>{item.key}</Text>
              <Text style={[styles.status, { color: item.isEnabled ? Colors.accent : Colors.textSecondary }]}>
                {item.isEnabled ? 'Aktívne' : 'Neaktívne'}
              </Text>
            </View>
            <Switch
              value={item.isManuallyEnabled && !item.isManuallyDisabled}
              onValueChange={(v) => toggle(item, v)}
              trackColor={{ true: Colors.accent, false: Colors.border }}
              thumbColor={item.isEnabled ? Colors.primary : Colors.textSecondary}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flagCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
  },
  key: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  status: {
    fontFamily: Typography.body,
    fontSize: 12,
    marginTop: 2,
  },
});

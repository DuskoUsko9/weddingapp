import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { ScheduleItem } from '../../types/api';

export default function ScheduleScreen() {
  const { data: items = [], isLoading } = useQuery<ScheduleItem[]>({
    queryKey: ['schedule'],
    queryFn: async () => (await apiClient.get('/schedule')).data,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{Copy.schedule.title}</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.timeCol}>
            <Text style={styles.timeLabel}>{item.timeLabel}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailCol}>
            <Text style={styles.itemTitle}>
              {item.icon ? `${item.icon} ` : ''}{item.title}
            </Text>
            {item.description && (
              <Text style={styles.itemDescription}>{item.description}</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  timeCol: { width: 56, justifyContent: 'flex-start', paddingTop: 2 },
  timeLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.primary,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  detailCol: { flex: 1 },
  itemTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  itemDescription: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
});

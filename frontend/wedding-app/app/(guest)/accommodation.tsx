import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { StaticContent } from '../../types/api';

export default function AccommodationScreen() {
  const { data, isLoading } = useQuery<StaticContent>({
    queryKey: ['static', 'accommodation'],
    queryFn: async () => (await apiClient.get('/static-content/accommodation')).data,
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
      <Text style={styles.title}>🏨 {data?.title ?? 'Ubytovanie'}</Text>
      <View style={styles.card}>
        <Text style={styles.body}>{data?.content}</Text>
      </View>
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadow.card,
  },
  body: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
});

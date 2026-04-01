import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { MenuSection } from '../../types/api';

export default function MenuScreen() {
  const { data: sections = [], isLoading } = useQuery<MenuSection[]>({
    queryKey: ['menu'],
    queryFn: async () => (await apiClient.get('/menu')).data,
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
      <Text style={styles.title}>{Copy.menu.title}</Text>
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionName}>{section.name}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.itemDescription}>{item.description}</Text>
              )}
            </View>
          ))}
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
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  sectionName: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  item: { marginBottom: Spacing.sm },
  itemName: {
    fontFamily: Typography.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  itemDescription: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 20,
  },
});

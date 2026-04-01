import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { LoveStoryEvent } from '../../types/api';

export default function LoveStoryScreen() {
  const { data: events = [], isLoading } = useQuery<LoveStoryEvent[]>({
    queryKey: ['love-story'],
    queryFn: async () => (await apiClient.get('/love-story')).data,
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
      <Text style={styles.title}>{Copy.loveStory.title}</Text>
      <View style={styles.timeline}>
        {events.map((event, idx) => (
          <View key={event.id} style={styles.eventRow}>
            <View style={styles.lineCol}>
              <View style={styles.dot} />
              {idx < events.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.eventCard}>
              <Text style={styles.eventDate}>{event.eventDate}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
              {event.description && (
                <Text style={styles.eventDescription}>{event.description}</Text>
              )}
            </View>
          </View>
        ))}
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
  timeline: {},
  eventRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  lineCol: { width: 24, alignItems: 'center' },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
    minHeight: 24,
  },
  eventCard: {
    flex: 1,
    marginLeft: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
    ...Shadow.card,
  },
  eventDate: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontFamily: Typography.heading,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  eventDescription: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

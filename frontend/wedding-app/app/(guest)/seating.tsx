import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { apiClient } from '../../services/api';
import type { MySeating } from '../../types/api';

export default function SeatingScreen() {
  const { isEnabled, isLoading: flagLoading } = useFeatureFlag('seating');

  const { data: seating, isLoading: seatingLoading } = useQuery<MySeating | null>({
    queryKey: ['seating-my'],
    queryFn: async () => (await apiClient.get('/seating/my')).data,
    enabled: isEnabled,
  });

  if (flagLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!isEnabled) {
    return (
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Feather name="lock" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.title}>{Copy.seating.lockedTitle}</Text>
        <Text style={s.subtitle}>{Copy.seating.lockedSubtitle}</Text>
        <View style={s.dateBadge}>
          <Feather name="calendar" size={13} color={Colors.primary} />
          <Text style={s.dateText}>5. september 2026</Text>
        </View>
      </View>
    );
  }

  if (seatingLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!seating) {
    return (
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Feather name="info" size={32} color={Colors.onSurfaceVariant} />
        </View>
        <Text style={s.title}>Miesto ešte nie je priradené</Text>
        <Text style={s.subtitle}>
          Tvoje miesto v sále bude čoskoro zverejnené. Sleduj aplikáciu.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>{Copy.seating.title}</Text>
      </View>

      {/* Table badge */}
      <View style={s.tableBadge}>
        <Text style={s.tableBadgeLabel}>VÁŠ STÔL</Text>
        <Text style={s.tableNumber}>{seating.tableNumber}</Text>
        {seating.tableName ? (
          <Text style={s.tableName}>{seating.tableName}</Text>
        ) : null}
      </View>

      {seating.seatNote ? (
        <View style={s.noteCard}>
          <Feather name="info" size={14} color={Colors.primary} style={{ marginTop: 1 }} />
          <Text style={s.noteText}>{seating.seatNote}</Text>
        </View>
      ) : null}

      {/* Tablemates */}
      {seating.tablemates.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>SPOLUSTOLUJÚCI</Text>
          <View style={s.card}>
            {seating.tablemates.map((name, i) => (
              <View key={name} style={[s.tablematRow, i < seating.tablemates.length - 1 && s.tablematBorder]}>
                <View style={s.tablematIcon}>
                  <Feather name="user" size={14} color={Colors.secondary} />
                </View>
                <Text style={s.tablematName}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },

  center: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: Spacing.lg,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dateText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.primary,
  },

  hero: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
  },

  tableBadge: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.card,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.floating,
  },
  tableBadgeLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.70)',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  tableNumber: {
    fontFamily: Typography.heading,
    fontSize: 72,
    color: Colors.onPrimary,
    lineHeight: 80,
  },
  tableName: {
    fontFamily: Typography.body,
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.xs,
  },

  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  noteText: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
  },

  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  sectionLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  tablematRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  tablematBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  tablematIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tablematName: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
  },
});

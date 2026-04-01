import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { MenuSection } from '../../types/api';

const ORDINALS = ['01', '02', '03', '04', '05', '06'];

export default function MenuScreen() {
  const { data: sections = [], isLoading } = useQuery<MenuSection[]>({
    queryKey: ['menu'],
    queryFn: async () => (await apiClient.get('/menu')).data,
  });

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* ── Hero header ─────────────────────────────────────── */}
      <View style={s.heroHeader}>
        <Text style={s.categoryLabel}>{Copy.menu.category.toUpperCase()}</Text>
        <Text style={s.heroTitle}>{Copy.menu.title}</Text>
        <View style={s.heroDivider} />
        <Text style={s.heroSub}>{Copy.menu.subtitle}</Text>
      </View>

      {/* ── Menu sections ───────────────────────────────────── */}
      {sections.map((section, idx) => (
        <View key={section.id} style={s.section}>
          {/* Section heading */}
          <View style={s.sectionHeader}>
            <Text style={s.ordinal}>{ORDINALS[idx] ?? String(idx + 1).padStart(2, '0')}</Text>
            <Text style={s.sectionName}>{section.name}</Text>
          </View>

          {/* Items */}
          {section.items.map((item, iIdx) => (
            <View
              key={item.id}
              style={[s.itemCard, iIdx === 0 && { marginTop: 0 }]}
            >
              <Text style={s.itemName}>{item.name}</Text>
              {item.description ? (
                <Text style={s.itemDesc}>{item.description}</Text>
              ) : null}
              {item.tags && item.tags.length > 0 && (
                <View style={s.tagRow}>
                  {item.tags.map((tag) => (
                    <View key={tag} style={s.tag}>
                      <Text style={s.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      ))}

      {/* ── Drinks footer ───────────────────────────────────── */}
      <View style={s.drinksFooter}>
        <View style={s.drinksCircle}>
          <Feather name="coffee" size={28} color={Colors.primary} />
          <Text style={s.drinksTitle}>{Copy.menu.drinks}</Text>
          <Text style={s.drinksNote}>{Copy.menu.drinksNote.toUpperCase()}</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Hero
  heroHeader: {
    alignItems: 'center',
    paddingTop: Spacing.gallery,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  categoryLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.secondary,
    letterSpacing: 3,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 40,
    color: Colors.onSurface,
    fontStyle: 'normal',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 48,
  },
  heroDivider: {
    width: 32,
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: Spacing.md,
  },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  ordinal: {
    fontFamily: Typography.headingItalic,
    fontSize: 28,
    color: Colors.primaryContainer,
    lineHeight: 34,
  },
  sectionName: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.onSurface,
    letterSpacing: 0.3,
  },

  // Item card — no borders
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    ...Shadow.card,
  },
  itemName: {
    fontFamily: Typography.heading,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 6,
    lineHeight: 26,
  },
  itemDesc: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Drinks
  drinksFooter: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  drinksCircle: {
    width: 200,
    height: 200,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  drinksTitle: {
    fontFamily: Typography.headingItalic,
    fontSize: 18,
    color: Colors.primary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  drinksNote: {
    fontFamily: Typography.bodyMedium,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginTop: Spacing.xs,
    lineHeight: 14,
  },
});
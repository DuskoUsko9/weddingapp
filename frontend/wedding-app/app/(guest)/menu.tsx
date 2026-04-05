import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { MenuSection } from '../../types/api';

const ORDINALS = ['01', '02', '03', '04', '05', '06'];

// Section emoji icons based on ordinal position / name keywords
function getSectionEmoji(name: string, idx: number): string {
  const n = name.toLowerCase();
  if (n.includes('polievka') || n.includes('polévka')) return '🍲';
  if (n.includes('predjedlo') || n.includes('predkrm')) return '🥗';
  if (n.includes('hlavné') || n.includes('hlavne') || n.includes('mäso')) return '🍖';
  if (n.includes('dezert') || n.includes('torta') || n.includes('sladké')) return '🍰';
  if (n.includes('nápoj') || n.includes('nápoje') || n.includes('drink')) return '🥂';
  if (n.includes('príloha') || n.includes('priloha')) return '🫘';
  const fallbacks = ['🍽️', '🥂', '🍖', '🥗', '🍰', '☕'];
  return fallbacks[idx % fallbacks.length];
}

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
    <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1a1208', '#3a2a10', '#725b28']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={s.hero}
      >
        {/* Bokeh */}
        <View style={s.bokehWrap} pointerEvents="none">
          {[
            { top: 15, left: '8%', size: 70, opacity: 0.04 },
            { top: 50, right: '6%', size: 55, opacity: 0.05 },
            { bottom: 25, left: '35%', size: 45, opacity: 0.03 },
          ].map((d, i) => (
            <View
              key={i}
              style={[s.bokehDot, {
                top: d.top as any, left: d.left as any, right: (d as any).right,
                bottom: (d as any).bottom, width: d.size, height: d.size,
                borderRadius: d.size / 2, opacity: d.opacity,
              }]}
            />
          ))}
        </View>

        <View style={s.heroBadge}>
          <Text style={s.heroBadgeEmoji}>🍽️</Text>
        </View>
        <Text style={s.heroEyebrow}>{Copy.menu.category.toUpperCase()}</Text>
        <Text style={s.heroTitle}>{Copy.menu.title}</Text>
        <View style={s.heroDividerRow}>
          <View style={s.heroDivLine} />
          <Text style={s.heroDivDots}>✦ ✦ ✦</Text>
          <View style={s.heroDivLine} />
        </View>
        <Text style={s.heroSub}>{Copy.menu.subtitle}</Text>
      </LinearGradient>

      {/* ── Menu sections ───────────────────────────────────── */}
      {sections.map((section, idx) => (
        <View key={section.id} style={s.section}>
          {/* Section heading */}
          <View style={s.sectionHeader}>
            <Text style={s.ordinal}>{ORDINALS[idx] ?? String(idx + 1).padStart(2, '0')}</Text>
            <Text style={s.sectionName}>{section.name}</Text>
            <Text style={s.sectionEmoji}>{getSectionEmoji(section.name, idx)}</Text>
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
        <LinearGradient
          colors={[Colors.primaryFixed, '#fedf9f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.drinksCard}
        >
          <Text style={s.drinksEmoji}>🥂</Text>
          <Text style={s.drinksTitle}>{Copy.menu.drinks}</Text>
          <Text style={s.drinksNote}>{Copy.menu.drinksNote.toUpperCase()}</Text>
          <View style={s.drinksChips}>
            {['Víno', 'Pivo', 'Nealkoholické', 'Horúce nápoje'].map((d) => (
              <View key={d} style={s.drinkChip}>
                <Text style={s.drinkChipText}>{d}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Hero
  hero: {
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    overflow: 'hidden',
  },
  bokehWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bokehDot: { position: 'absolute', backgroundColor: '#fff' },
  heroBadge: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroBadgeEmoji: { fontSize: 26 },
  heroEyebrow: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontFamily: Typography.heading,
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 48,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '65%',
    marginVertical: Spacing.md,
  },
  heroDivLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  heroDivDots: { color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: 6 },
  heroSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    fontStyle: 'italic',
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
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
    flex: 1,
  },
  sectionEmoji: { fontSize: 22 },

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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  drinksCard: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.card,
  },
  drinksEmoji: { fontSize: 36, marginBottom: Spacing.sm },
  drinksTitle: {
    fontFamily: Typography.headingItalic,
    fontSize: 22,
    color: Colors.primary,
    textAlign: 'center',
  },
  drinksNote: {
    fontFamily: Typography.bodyMedium,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
    lineHeight: 14,
  },
  drinksChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  drinkChip: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  drinkChipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.primary,
  },
});
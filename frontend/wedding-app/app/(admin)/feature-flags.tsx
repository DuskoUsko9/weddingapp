import { View, Text, FlatList, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import type { FeatureFlag } from '../../types/api';

type FeatherIcon = React.ComponentProps<typeof Feather>['name'];

const FLAG_META: Record<string, { label: string; description: string; icon: FeatherIcon }> = {
  questionnaire:  { label: 'Dotazník',           description: 'Hostia môžu vyplniť dotazník o preferenciách',        icon: 'clipboard' },
  seating:        { label: 'Zasadací plán',       description: 'Zobrazenie stola v svadobnej sále',                   icon: 'grid' },
  photo_upload:   { label: 'Nahrávanie fotiek',   description: 'Hostia môžu nahrávať fotky v deň svadby',             icon: 'camera' },
  photo_bingo:    { label: 'Svadobné bingo',      description: 'Foto bingo výzvy pre hostí',                          icon: 'target' },
  gallery:        { label: 'Galéria',             description: 'Spoločné spomienky po svadbe',                        icon: 'image' },
  thank_you:      { label: 'Poďakovanie',         description: 'Personalizované správy pre každého hosťa',            icon: 'mail' },
  love_story:     { label: 'Náš príbeh',          description: 'Časová os príbehu Maťky a Dušana',                   icon: 'heart' },
  cocktails:      { label: 'Koktejly',            description: 'Hlasovanie za koktejl večera',                        icon: 'coffee' },
};

function formatTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString('sk-SK', {
      day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return null; }
}

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
    mutate({ key: flag.key, isManuallyEnabled: value, isManuallyDisabled: !value });
  };

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  const active = flags.filter((f) => f.isEnabled).length;

  return (
    <FlatList
      style={s.container}
      data={flags}
      keyExtractor={(f) => f.key}
      contentContainerStyle={s.list}
      ListHeaderComponent={
        <View style={s.header}>
          <View style={[s.headerChip, { backgroundColor: Colors.secondaryContainer }]}>
            <Feather name="zap" size={12} color={Colors.secondary} />
            <Text style={[s.headerChipText, { color: Colors.secondary }]}>{active} aktívnych</Text>
          </View>
          <View style={[s.headerChip, { backgroundColor: Colors.surfaceContainerLow }]}>
            <Feather name="lock" size={12} color={Colors.onSurfaceVariant} />
            <Text style={s.headerChipText}>{flags.length - active} neaktívnych</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => {
        const meta = FLAG_META[item.key];
        const icon: FeatherIcon = meta?.icon ?? 'toggle-right';
        const label = meta?.label ?? item.key;
        const description = meta?.description ?? '';
        const scheduledAt = item.isEnabled ? null : formatTime(item.availableFrom);

        return (
          <View style={[s.card, item.isEnabled && s.cardActive]}>
            {/* Icon */}
            <View style={[s.iconWrap, { backgroundColor: item.isEnabled ? Colors.secondaryContainer : Colors.surfaceContainerLow }]}>
              <Feather name={icon} size={18} color={item.isEnabled ? Colors.secondary : Colors.onSurfaceVariant} />
            </View>

            {/* Text */}
            <View style={s.textWrap}>
              <View style={s.labelRow}>
                <Text style={s.label}>{label}</Text>
                {item.isEnabled
                  ? <View style={s.activeBadge}><Text style={s.activeBadgeText}>AKTÍVNE</Text></View>
                  : scheduledAt
                    ? <View style={s.scheduledBadge}><Text style={s.scheduledBadgeText}>NAPLÁNOVANÉ</Text></View>
                    : null
                }
              </View>
              {description ? <Text style={s.description}>{description}</Text> : null}
              {scheduledAt && (
                <Text style={s.scheduledTime}>
                  <Feather name="clock" size={10} color={Colors.outline} /> od {scheduledAt}
                </Text>
              )}
            </View>

            {/* Switch */}
            <Switch
              value={item.isManuallyEnabled && !item.isManuallyDisabled}
              onValueChange={(v) => toggle(item, v)}
              trackColor={{ true: Colors.secondary, false: Colors.surfaceContainerHighest }}
              thumbColor={item.isEnabled ? Colors.onSecondary : Colors.outline}
            />
          </View>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  // Header chips
  header: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  headerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  headerChipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },

  // Card
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
  cardActive: {
    backgroundColor: Colors.surface,
  },

  // Icon
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Text
  textWrap: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 2 },
  label: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
  },
  description: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  scheduledTime: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.outline,
    marginTop: 2,
  },

  // Badges
  activeBadge: {
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeBadgeText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 8,
    color: Colors.secondary,
    letterSpacing: 1,
  },
  scheduledBadge: {
    backgroundColor: Colors.primaryFixed,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  scheduledBadgeText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 8,
    color: Colors.primary,
    letterSpacing: 1,
  },
});

import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { StaticContent } from '../../types/api';

const MAP_URL = 'https://maps.google.com/?q=Penz%C3%ADon+Zemiansky+Dvor+Surovce';

export default function ParkingScreen() {
  const { data, isLoading } = useQuery<StaticContent>({
    queryKey: ['static', 'parking'],
    queryFn: async () => (await apiClient.get('/static-content/parking')).data,
  });

  if (isLoading) {
    return <View style={s.center}><ActivityIndicator color={Colors.primary} /></View>;
  }

  const openMap = () => {
    const url = (data?.metadata as any)?.mapUrl ?? MAP_URL;
    Linking.openURL(url).catch(() => undefined);
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* ── Hero header ───────────────────────────────────────── */}
      <View style={s.hero}>
        <View style={s.iconWrap}>
          <Feather name="map-pin" size={28} color={Colors.primary} />
        </View>
        <Text style={s.title}>{data?.title ?? Copy.parking.title}</Text>
        <Text style={s.address}>{Copy.parking.address}</Text>
      </View>

      {/* ── Info card ─────────────────────────────────────────── */}
      <View style={s.card}>
        <Text style={s.body}>{data?.content}</Text>
      </View>

      {/* ── Navigate CTA ──────────────────────────────────────── */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openMap}
        style={s.btnWrap}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.navBtn}
        >
          <Feather name="navigation" size={18} color="#fff" />
          <Text style={s.navBtnText}>{Copy.parking.navigateBtn}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ── Info chips ────────────────────────────────────────── */}
      <View style={s.chips}>
        <View style={s.chip}>
          <Feather name="check-circle" size={14} color={Colors.secondary} />
          <Text style={s.chipText}>Parkovanie zdarma</Text>
        </View>
        <View style={s.chip}>
          <Feather name="check-circle" size={14} color={Colors.secondary} />
          <Text style={s.chipText}>Dostatočná kapacita</Text>
        </View>
        <View style={s.chip}>
          <Feather name="check-circle" size={14} color={Colors.secondary} />
          <Text style={s.chipText}>Priamo pri penzióne</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  hero: {
    paddingTop: Spacing.gallery,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 32,
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: Spacing.xs,
  },
  address: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  body: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 26,
  },

  btnWrap: { marginHorizontal: Spacing.md, marginBottom: Spacing.lg },
  navBtn: {
    borderRadius: Radius.button,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  navBtnText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 0.3,
  },

  chips: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chipText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.secondary,
  },
});
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { AdminStats } from '../../types/api';

type FeatherIcon = React.ComponentProps<typeof Feather>['name'];

type StatConfig = {
  label: string;
  key: keyof AdminStats;
  icon: FeatherIcon;
  iconColor: string;
  iconBg: string;
  accent: string;
};

const STATS: StatConfig[] = [
  { label: 'Celkom hostí',      key: 'totalGuests',         icon: 'users',       iconColor: Colors.primary,   iconBg: Colors.primaryFixed,        accent: Colors.primary },
  { label: Copy.admin.attending,  key: 'attending',           icon: 'check-circle',iconColor: Colors.secondary, iconBg: Colors.secondaryContainer,  accent: Colors.secondary },
  { label: Copy.admin.notAttending,key:'notAttending',        icon: 'x-circle',    iconColor: '#ba1a1a',        iconBg: '#ffdad6',                  accent: '#ba1a1a' },
  { label: 'Čaká na dotazník',  key: 'pendingQuestionnaire', icon: 'clock',       iconColor: Colors.tertiary,  iconBg: Colors.primaryFixed,        accent: Colors.tertiary },
  { label: 'Hudobné priania',   key: 'totalSongRequests',    icon: 'music',       iconColor: Colors.secondary, iconBg: Colors.secondaryContainer,  accent: Colors.secondary },
  { label: 'Čakajúce priania',  key: 'pendingSongRequests',  icon: 'bell',        iconColor: Colors.primary,   iconBg: Colors.primaryFixed,        accent: Colors.primary },
];

type MenuItem = {
  label: string;
  sublabel: string;
  icon: FeatherIcon;
  route: string;
  iconBg: string;
  iconColor: string;
};

const MENU: MenuItem[] = [
  { label: Copy.admin.guests,      sublabel: 'Správa a prehľad hostí',    icon: 'users',       route: '/(admin)/guests',                  iconBg: Colors.secondaryContainer, iconColor: Colors.secondary },
  { label: Copy.admin.featureFlags,sublabel: 'Zapínanie funkcií aplikácie',icon: 'toggle-right',route: '/(admin)/feature-toggles',          iconBg: Colors.primaryFixed,       iconColor: Colors.primary },
  { label: 'Dotazníky',            sublabel: 'Odpovede hostí na dotazník', icon: 'clipboard',   route: '/(admin)/questionnaire-responses',  iconBg: Colors.primaryFixed,       iconColor: Colors.primary },
  { label: 'Hudobné priania',      sublabel: 'Požiadavky na pesničky',     icon: 'music',       route: '/(admin)/song-requests',            iconBg: Colors.secondaryContainer, iconColor: Colors.secondary },
];

const CONTENT: MenuItem[] = [
  { label: 'Program svadby',  sublabel: 'Pridaj / uprav / vymaž položky programu', icon: 'calendar',     route: '/(admin)/schedule',       iconBg: Colors.secondaryContainer, iconColor: Colors.secondary },
  { label: 'Menu',            sublabel: 'Sekcie a jedlá svadobného menu',           icon: 'book-open',    route: '/(admin)/menu',           iconBg: Colors.primaryFixed,       iconColor: Colors.primary },
  { label: 'Statický obsah',  sublabel: 'Parkovanie a ubytovanie',                  icon: 'file-text',    route: '/(admin)/static-content', iconBg: Colors.primaryFixed,       iconColor: Colors.primary },
  { label: 'Náš príbeh',      sublabel: 'Udalosti v časovej osi',                   icon: 'heart',        route: '/(admin)/love-story',     iconBg: '#fde8e8',                 iconColor: '#c0504d' },
  { label: 'Svadobné bingo',  sublabel: 'Foto výzvy pre hostí',                     icon: 'target',       route: '/(admin)/bingo',          iconBg: Colors.secondaryContainer, iconColor: Colors.secondary },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 768;

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => (await apiClient.get('/admin/stats')).data,
  });

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

      {/* ── Branded header ──────────────────────────────────────── */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={s.headerInner}>
          <View>
            <Text style={s.headerBrand}>MadU</Text>
            <Text style={s.headerRole}>Admin panel</Text>
          </View>
          <TouchableOpacity style={s.logoutBtn} onPress={logout} activeOpacity={0.75}>
            <Feather name="log-out" size={16} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={[s.content, isWide && s.contentWide]}>

        {/* ── Stats grid ──────────────────────────────────────────── */}
        <Text style={s.sectionLabel}>ŠTATISTIKY</Text>
        {isLoading
          ? <ActivityIndicator color={Colors.primary} style={{ marginVertical: Spacing.lg }} />
          : stats && (
            <View style={s.statsGrid}>
              {STATS.map(({ label, key, icon, iconColor, iconBg, accent }) => (
                <View key={key} style={[s.statCard, isWide && s.statCardWide]}>
                  <View style={s.statTop}>
                    <View style={[s.statIconWrap, { backgroundColor: iconBg }]}>
                      <Feather name={icon} size={16} color={iconColor} />
                    </View>
                    <Text style={[s.statValue, { color: accent }]}>{stats[key]}</Text>
                  </View>
                  <Text style={s.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
          )
        }

        {/* ── Management section ──────────────────────────────────── */}
        <Text style={s.sectionLabel}>SPRÁVA</Text>
        <View style={s.menuList}>
          {MENU.map(({ label, sublabel, icon, route, iconBg, iconColor }, i) => (
            <TouchableOpacity
              key={route}
              style={[s.menuItem, i < MENU.length - 1 && s.menuItemBorder]}
              activeOpacity={0.7}
              onPress={() => router.push(route as never)}
            >
              <View style={[s.menuIconWrap, { backgroundColor: iconBg }]}>
                <Feather name={icon} size={18} color={iconColor} />
              </View>
              <View style={s.menuText}>
                <Text style={s.menuLabel}>{label}</Text>
                <Text style={s.menuSublabel}>{sublabel}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.outline} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Content management section ───────────────────────────── */}
        <Text style={s.sectionLabel}>OBSAH</Text>
        <View style={s.menuList}>
          {CONTENT.map(({ label, sublabel, icon, route, iconBg, iconColor }, i) => (
            <TouchableOpacity
              key={route}
              style={[s.menuItem, i < CONTENT.length - 1 && s.menuItemBorder]}
              activeOpacity={0.7}
              onPress={() => router.push(route as never)}
            >
              <View style={[s.menuIconWrap, { backgroundColor: iconBg }]}>
                <Feather name={icon} size={18} color={iconColor} />
              </View>
              <View style={s.menuText}>
                <Text style={s.menuLabel}>{label}</Text>
                <Text style={s.menuSublabel}>{sublabel}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.outline} />
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    paddingTop: Platform.OS === 'web' ? Spacing.xl : 48,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBrand: {
    fontFamily: Typography.headingItalic,
    fontSize: 36,
    color: Colors.onPrimary,
    letterSpacing: 1,
    lineHeight: 42,
  },
  headerRole: {
    fontFamily: Typography.bodyMedium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.70)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content wrapper
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  contentWide: {
    maxWidth: 960,
    alignSelf: 'center' as any,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },

  // Section label
  sectionLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 2,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: '47.5%' as any,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadow.card,
  },
  statCardWide: {
    width: '31%' as any,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: Typography.heading,
    fontSize: 32,
    lineHeight: 36,
  },
  statLabel: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },

  // Management menu
  menuList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Shadow.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1 },
  menuLabel: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  menuSublabel: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginTop: 1,
  },
});

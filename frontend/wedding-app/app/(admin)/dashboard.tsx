import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, useWindowDimensions, Modal, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../store/AuthContext';
import { useSimulatedTime } from '../../store/SimulatedTimeContext';
import { useImpersonation } from '../../store/ImpersonationContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { AdminStats, GuestDto, AuthUser } from '../../types/api';

// Wedding day = 5.9.2026 15:30 CEST = 13:30 UTC
// Post-wedding = 6.9.2026 08:00 CEST = 06:00 UTC
const TIME_PRESETS = [
  { label: 'Teraz',       value: null,                      color: Colors.secondary },
  { label: 'Deň svadby', value: '2026-09-05T13:30:00.000Z', color: Colors.primary },
  { label: 'Po svadbe',  value: '2026-09-06T06:00:00.000Z', color: '#725b28' },
] as const;

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
  { label: 'Pozvánky',             sublabel: 'Odoslanie emailov s QR',     icon: 'mail',        route: '/(admin)/invitations',             iconBg: Colors.primaryFixed,       iconColor: Colors.primary },
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
  { label: 'Zasadací plán',  sublabel: 'Priradenie miest pri stoloch',              icon: 'grid',         route: '/(admin)/seating',        iconBg: Colors.primaryFixed,       iconColor: Colors.primary },
  { label: 'Poďakovania',    sublabel: 'Osobné správy pre každého hosťa',           icon: 'mail',         route: '/(admin)/thank-you',      iconBg: Colors.primaryFixed,       iconColor: Colors.primary },
];

// Special roles that can be impersonated (not in guest DB)
const SPECIAL_ROLES = [
  { id: '__dj__',        label: 'DJ (djmiles)',  role: 'DJ'              as const },
  { id: '__starejsi__',  label: 'Starejší',      role: 'MasterOfCeremony' as const },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, logout, login } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 768;
  const { simulatedTime, setSimulatedTime } = useSimulatedTime();
  const { adminUser, saveAdmin } = useImpersonation();
  const queryClient = useQueryClient();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [impersonating, setImpersonating] = useState(false);

  const activePreset = TIME_PRESETS.find((p) => p.value === simulatedTime) ?? TIME_PRESETS[0];

  const handlePreset = (value: string | null) => {
    setSimulatedTime(value);
    queryClient.invalidateQueries();
  };

  const { data: guests } = useQuery<GuestDto[]>({
    queryKey: ['admin-guests'],
    queryFn: async () => (await apiClient.get('/admin/guests')).data,
    enabled: pickerVisible,
  });

  const filteredGuests = guests?.filter((g) =>
    g.fullName.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleImpersonate = async (guestId: string | null, role?: string) => {
    if (!user) return;
    setImpersonating(true);
    try {
      const payload = guestId ? { guestId } : { role };
      const res = await apiClient.post('/admin/impersonate', payload);
      const token: string = res.data.token;

      // Decode the name from JWT payload (base64 middle part)
      const payloadB64 = token.split('.')[1];
      const decoded = JSON.parse(atob(payloadB64));
      const guestName: string = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? decoded.name ?? '';
      const guestRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'Guest';
      const guestIdClaim: string | null = decoded.guestId ?? null;

      const impersonatedUser: AuthUser = {
        guestId: guestIdClaim,
        guestName,
        role: guestRole,
        token,
      };

      saveAdmin(user);
      setPickerVisible(false);
      setSearch('');
      await login(impersonatedUser);
      // RootNavigator will redirect based on the new role
    } catch (e: any) {
      console.error('Impersonation failed:', e?.message);
    } finally {
      setImpersonating(false);
    }
  };

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => (await apiClient.get('/admin/stats')).data,
  });

  return (
    <>
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

        {/* ── Time simulation ──────────────────────────────────────── */}
        <Text style={s.sectionLabel}>TESTOVANIE</Text>
        <View style={s.simCard}>
          <View style={s.simHeader}>
            <View style={s.simIconWrap}>
              <Feather name="clock" size={16} color={Colors.primary} />
            </View>
            <View style={s.simHeaderText}>
              <Text style={s.simTitle}>Simulácia času</Text>
              <Text style={s.simSubtitle}>
                {simulatedTime
                  ? `Aktívna: ${activePreset.label}`
                  : 'Vypnutá — zobrazuje sa reálny čas'}
              </Text>
            </View>
            {simulatedTime && (
              <View style={s.simBadge}>
                <Text style={s.simBadgeText}>AKTÍVNA</Text>
              </View>
            )}
          </View>
          <View style={s.simPresets}>
            {TIME_PRESETS.map((preset) => {
              const isActive = simulatedTime === preset.value;
              return (
                <TouchableOpacity
                  key={preset.label}
                  style={[s.simPresetBtn, isActive && { backgroundColor: preset.color }]}
                  activeOpacity={0.7}
                  onPress={() => handlePreset(preset.value)}
                >
                  <Text style={[s.simPresetLabel, isActive && s.simPresetLabelActive]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Impersonation ────────────────────────────────────────── */}
        <View style={[s.simCard, { marginTop: Spacing.sm }]}>
          <View style={s.simHeader}>
            <View style={[s.simIconWrap, { backgroundColor: Colors.secondaryContainer }]}>
              <Feather name="user-check" size={16} color={Colors.secondary} />
            </View>
            <View style={s.simHeaderText}>
              <Text style={s.simTitle}>Impersonácia hosťa</Text>
              <Text style={s.simSubtitle}>Zobraz aplikáciu očami konkrétneho hosťa</Text>
            </View>
          </View>
          <TouchableOpacity
            style={s.impersonateBtn}
            activeOpacity={0.75}
            onPress={() => setPickerVisible(true)}
          >
            <Feather name="user" size={15} color={Colors.secondary} />
            <Text style={s.impersonateBtnText}>Vybrať hosťa alebo rolu</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>

    {/* ── Guest picker modal ───────────────────────────────────── */}
    <Modal
      visible={pickerVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setPickerVisible(false)}
    >
      <View style={s.modal}>
        <View style={s.modalHeader}>
          <Text style={s.modalTitle}>Vybrať hosťa</Text>
          <TouchableOpacity onPress={() => { setPickerVisible(false); setSearch(''); }}>
            <Feather name="x" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={s.searchWrap}>
          <Feather name="search" size={16} color={Colors.outline} style={s.searchIcon} />
          <TextInput
            style={s.searchInput}
            placeholder="Hľadaj hosťa..."
            placeholderTextColor={Colors.outline}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>

        <FlatList
          data={[
            ...SPECIAL_ROLES.map((r) => ({ ...r, isSpecial: true })),
            ...filteredGuests.map((g) => ({ id: g.id, label: g.fullName, role: undefined, isSpecial: false })),
          ]}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={s.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.guestRow}
              activeOpacity={0.7}
              disabled={impersonating}
              onPress={() => {
                if (item.isSpecial) {
                  handleImpersonate(null, item.role);
                } else {
                  handleImpersonate(item.id);
                }
              }}
            >
              <View style={[s.guestIcon, item.isSpecial && s.guestIconSpecial]}>
                <Feather
                  name={item.isSpecial ? 'star' : 'user'}
                  size={16}
                  color={item.isSpecial ? Colors.primary : Colors.secondary}
                />
              </View>
              <Text style={s.guestName}>{item.label}</Text>
              {impersonating
                ? <ActivityIndicator size="small" color={Colors.outline} />
                : <Feather name="chevron-right" size={16} color={Colors.outline} />
              }
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={s.emptyText}>
              {guests ? 'Žiadny hosť nevyhovuje hľadaniu' : 'Načítava sa...'}
            </Text>
          }
        />
      </View>
    </Modal>
    </>
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

  // Time simulation
  simCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    ...Shadow.card,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  simIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simHeaderText: { flex: 1 },
  simTitle: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  simSubtitle: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    marginTop: 1,
  },
  simBadge: {
    backgroundColor: '#fde8a0',
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  simBadgeText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: '#725b28',
    letterSpacing: 1,
  },
  simPresets: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  simPresetBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
  },
  simPresetLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  simPresetLabelActive: {
    color: '#ffffff',
  },

  // Impersonation button
  impersonateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondaryContainer,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  impersonateBtnText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 13,
    color: Colors.secondary,
  },

  // Guest picker modal
  modal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: Platform.OS === 'web' ? Spacing.lg : 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  modalTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.onSurface,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadow.card,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
    paddingVertical: Spacing.md,
    outlineStyle: 'none' as any,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  guestIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestIconSpecial: {
    backgroundColor: Colors.primaryFixed,
  },
  guestName: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurface,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.surfaceContainerLow,
    marginLeft: Spacing.lg + 36 + Spacing.md,
  },
  emptyText: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.outline,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

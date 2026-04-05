import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { LoginResponse, GuestMatch } from '../../types/api';

// ── Animated hero badge ──────────────────────────────────────────────────────
function HeroBadge() {
  const ring1 = useSharedValue(0.8);
  const ring2 = useSharedValue(0.65);
  const ring3 = useSharedValue(0.5);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    ring1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ), -1,
    );
    ring2.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.65, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ), -1,
    );
    ring3.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ), -1,
    );
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 500, easing: Easing.in(Easing.quad) }),
        withTiming(1.1, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 400, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 1600 }),
      ), -1,
    );
  }, []);

  const r1Style = useAnimatedStyle(() => ({
    opacity: ring1.value * 0.15,
    transform: [{ scale: ring1.value }],
  }));
  const r2Style = useAnimatedStyle(() => ({
    opacity: ring2.value * 0.2,
    transform: [{ scale: ring2.value }],
  }));
  const r3Style = useAnimatedStyle(() => ({
    opacity: ring3.value * 0.25,
    transform: [{ scale: ring3.value }],
  }));
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <View style={badge.container}>
      <Animated.View style={[badge.ring, badge.ring3, r3Style]} />
      <Animated.View style={[badge.ring, badge.ring2, r2Style]} />
      <Animated.View style={[badge.ring, badge.ring1, r1Style]} />
      <LinearGradient
        colors={['#fedf9f', '#e0c385', '#c0a469']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={badge.core}
      >
        <Text style={badge.monogram}>M&D</Text>
      </LinearGradient>
      <Animated.View style={[badge.heartBadge, heartStyle]}>
        <Text style={badge.heartText}>♥</Text>
      </Animated.View>
    </View>
  );
}

const badge = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  ring: {
    position: 'absolute',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
  },
  ring1: { width: 160, height: 160 },
  ring2: { width: 200, height: 200 },
  ring3: { width: 240, height: 240 },
  core: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    fontFamily: Typography.headingItalic,
    fontSize: 28,
    color: '#3d2a00',
    letterSpacing: 2,
  },
  heartBadge: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  heartText: { fontSize: 14, color: '#c0504d', lineHeight: 16 },
});

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<GuestMatch[] | null>(null);

  const handleLogin = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<LoginResponse>('/auth/login', { name: name.trim() });
      const result = res.data;
      if (result.type === 'token') {
        await login({
          token: result.token!,
          role: result.role!,
          guestId: result.guestId ?? null,
          guestName: result.guestName!,
        });
      } else if (result.type === 'disambiguation') {
        setMatches(result.matches ?? []);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : Copy.common.error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (guestId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<LoginResponse>('/auth/confirm', { guestId });
      const result = res.data;
      await login({
        token: result.token!,
        role: result.role!,
        guestId: result.guestId ?? null,
        guestName: result.guestName!,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : Copy.common.error);
    } finally {
      setLoading(false);
    }
  };

  // ── Disambiguation view ──────────────────────────────────────
  if (matches) {
    return (
      <ScrollView contentContainerStyle={s.disambig}>
        <Text style={s.disambigTitle}>{Copy.auth.disambiguationTitle}</Text>
        <Text style={s.disambigSub}>{Copy.auth.disambiguationSubtitle}</Text>
        {matches.map((m) => (
          <TouchableOpacity
            key={m.guestId}
            style={s.matchCard}
            activeOpacity={0.75}
            onPress={() => handleConfirm(m.guestId)}
            disabled={loading}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.matchName}>{m.fullName}</Text>
              <Text style={s.matchMeta}>{m.category} · {m.side}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={Colors.primary} />
          </TouchableOpacity>
        ))}
        {error && <Text style={s.error}>{error}</Text>}
        <TouchableOpacity onPress={() => setMatches(null)} style={s.backBtn}>
          <Feather name="arrow-left" size={16} color={Colors.primary} />
          <Text style={s.backText}>{Copy.common.back}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Login view ───────────────────────────────────────────────
  const Wrapper: React.ComponentType<any> = Platform.OS === 'web' ? View : KeyboardAvoidingView;
  return (
    <Wrapper
      style={{ flex: 1 }}
      {...(Platform.OS !== 'web' ? { behavior: Platform.OS === 'ios' ? 'padding' : undefined } : {})}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

        {/* ── Hero ────────────────────────────────────────────── */}
        <LinearGradient
          colors={['#2a1f0a', '#4a3515', '#725b28', Colors.background]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={s.hero}
        >
          {/* Decorative dots texture */}
          <View style={s.heroPattern} pointerEvents="none">
            {Array.from({ length: 24 }).map((_, i) => (
              <View key={i} style={s.heroDot} />
            ))}
          </View>

          {/* Decorative corner flourishes */}
          <Text style={[s.flourish, s.flourishTL]}>✦</Text>
          <Text style={[s.flourish, s.flourishTR]}>✦</Text>

          <HeroBadge />
          <Text style={s.brand}>{Copy.auth.brand}</Text>
          <Text style={s.couple}>Maťka {'&'} Dušan</Text>
          <View style={s.heroDivRow}>
            <View style={s.heroDivLine} />
            <Text style={s.heroDivDots}>✦</Text>
            <View style={s.heroDivLine} />
          </View>
          <Text style={s.heroDate}>5. september 2026 · Šúrovce</Text>
        </LinearGradient>

        {/* ── Form ────────────────────────────────────────────── */}
        <View style={s.form}>
          <Text style={s.welcomeTitle}>{Copy.auth.welcomeTitle}</Text>
          <Text style={s.welcomeSub}>{Copy.auth.welcomeSubtitle}</Text>

          {/* Input */}
          <Text style={s.inputLabel}>{Copy.auth.nameLabel.toUpperCase()}</Text>
          <View style={s.inputWrap}>
            <Feather name="user" size={18} color={Colors.onSurfaceVariant} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder={Copy.auth.namePlaceholder}
              placeholderTextColor={Colors.onSurfaceVariant}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          {error && <Text style={s.error}>{error}</Text>}

          {/* Primary CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading || !name.trim()}
            style={(!name.trim() || loading) ? s.btnDisabledWrap : undefined}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.button}
            >
              {loading
                ? <ActivityIndicator color="#ffffff" />
                : (
                  <>
                    <Text style={s.buttonText}>{Copy.auth.loginButton}</Text>
                    <Feather name="arrow-right" size={18} color="#ffffff" />
                  </>
                )
              }
            </LinearGradient>
          </TouchableOpacity>

          <Text style={s.hint}>{Copy.auth.loginHint}</Text>
        </View>

        {/* ── Special roles ────────────────────────────────────── */}
        <View style={s.roles}>
          <View style={s.rolesDivider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerLabel}>{Copy.auth.specialRolesLabel.toUpperCase()}</Text>
            <View style={s.dividerLine} />
          </View>
          <Text style={s.rolesHint}>{Copy.auth.specialRolesHint}</Text>
        </View>

      </ScrollView>
    </Wrapper>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  heroPattern: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.035,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    margin: 14,
  },
  flourish: {
    position: 'absolute',
    fontSize: 18,
    color: 'rgba(255,255,255,0.25)',
  },
  flourishTL: { top: 20, left: 20 },
  flourishTR: { top: 20, right: 20 },
  brand: {
    fontFamily: Typography.headingItalic,
    fontSize: 52,
    color: '#fff',
    letterSpacing: 2,
    lineHeight: 60,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  couple: {
    fontFamily: Typography.headingRegular,
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  heroDivRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '60%',
    marginVertical: Spacing.sm,
  },
  heroDivLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  heroDivDots: { color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 4 },
  heroDate: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Form
  form: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
    letterSpacing: 0.2,
  },
  welcomeSub: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },

  inputLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 10,
    color: Colors.outline,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.md,
    height: 56,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 17,
    color: Colors.onSurface,
  },

  error: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  btnDisabledWrap: { opacity: 0.45 },
  button: {
    borderRadius: Radius.button,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  buttonText: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 16,
    color: '#ffffff',
    letterSpacing: 0.3,
  },

  hint: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.sm,
  },

  // Special roles
  roles: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  rolesDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  dividerLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: 9,
    color: Colors.outline,
    letterSpacing: 2,
  },
  rolesHint: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.outline,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },

  // Disambiguation
  disambig: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    paddingTop: Spacing.gallery,
  },
  disambigTitle: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
    letterSpacing: 0.2,
  },
  disambigSub: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
  },
  matchName: {
    fontFamily: Typography.bodySemiBold,
    fontSize: 16,
    color: Colors.onSurface,
  },
  matchMeta: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    alignSelf: 'center',
  },
  backText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 14,
    color: Colors.primary,
  },
});
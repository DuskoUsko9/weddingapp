import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../store/AuthContext';
import { apiClient } from '../services/api';
import { Colors, Typography, Spacing } from '../constants/theme';

export default function MagicLoginScreen() {
  const { t } = useLocalSearchParams<{ t: string }>();
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!t) {
      setError('Neplatný prihlasovací odkaz.');
      return;
    }
    attemptMagicLogin(t);
  }, [t]);

  const attemptMagicLogin = async (token: string) => {
    try {
      const res = await apiClient.get(`/auth/magic-login?t=${token}`);
      const result = res.data as any;
      await login({
        token: result.token,
        role: result.role,
        guestId: result.guestId ?? null,
        name: result.guestName,
      });
      if (result.role === 'DJ') {
        router.replace('/(dj)/queue');
      } else {
        router.replace('/(guest)/dashboard');
      }
    } catch (err: any) {
      setError(err.message ?? 'Prihlásenie zlyhalo. Skontroluj odkaz alebo kontaktuj organizátora.');
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>😕</Text>
        <Text style={styles.title}>Ups, niečo sa pokazilo</Text>
        <Text style={styles.message}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Prihlasujeme ťa...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});

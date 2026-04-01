import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import { apiClient } from '../../services/api';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { Copy } from '../../constants/copy';
import type { LoginResponse, GuestMatch, AuthUser } from '../../types/api';

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
        const user: AuthUser = {
          token: result.token!,
          role: result.role!,
          guestId: result.guestId ?? null,
          guestName: result.guestName!,
        };
        await login(user);
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
      const user: AuthUser = {
        token: result.token!,
        role: result.role!,
        guestId: result.guestId ?? null,
        guestName: result.guestName!,
      };
      await login(user);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : Copy.common.error);
    } finally {
      setLoading(false);
    }
  };

  if (matches) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{Copy.auth.disambiguationTitle}</Text>
        <Text style={styles.subtitle}>{Copy.auth.disambiguationSubtitle}</Text>
        {matches.map((m) => (
          <TouchableOpacity
            key={m.guestId}
            style={styles.matchCard}
            onPress={() => handleConfirm(m.guestId)}
            disabled={loading}
          >
            <Text style={styles.matchName}>{m.fullName}</Text>
            <Text style={styles.matchMeta}>{m.category} · {m.side}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => setMatches(null)}>
          <Text style={styles.backLink}>{Copy.common.back}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{Copy.auth.title}</Text>
        <Text style={styles.subtitle}>{Copy.auth.subtitle}</Text>

        <TextInput
          style={styles.input}
          placeholder={Copy.auth.namePlaceholder}
          placeholderTextColor={Colors.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading || !name.trim()}
        >
          {loading
            ? <ActivityIndicator color={Colors.surface} />
            : <Text style={styles.buttonText}>{Copy.auth.loginButton}</Text>
          }
        </TouchableOpacity>

        <Text style={styles.hint}>{Copy.auth.loginHint}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontFamily: Typography.heading,
    fontSize: 36,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontFamily: Typography.body,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  error: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Colors.surface,
    letterSpacing: 0.5,
  },
  hint: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  matchCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchName: {
    fontFamily: Typography.bodyMedium,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  matchMeta: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  backLink: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.primary,
    marginTop: Spacing.md,
  },
});

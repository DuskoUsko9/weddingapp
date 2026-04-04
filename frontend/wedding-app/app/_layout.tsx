import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { SimulatedTimeProvider } from '../store/SimulatedTimeContext';
import { ImpersonationProvider } from '../store/ImpersonationContext';
import { ImpersonationBanner } from '../components/ImpersonationBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inMagicLogin = segments[0] === 'magic-login';

    if (!user && !inAuth && !inMagicLogin) {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      if (user.role === 'DJ') {
        router.replace('/(dj)/queue');
      } else {
        router.replace('/(guest)/dashboard');
      }
    }
  }, [user, isLoading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SimulatedTimeProvider>
          <ImpersonationProvider>
            <StatusBar style="dark" backgroundColor="#faf9f6" />
            <View style={styles.appShell}>
              <RootNavigator />
              <ImpersonationBanner />
            </View>
          </ImpersonationProvider>
        </SimulatedTimeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: '#faf9f6',
  },
});

import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../store/AuthContext';

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

    if (!user && !inAuth) {
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
        <StatusBar style="dark" backgroundColor="#faf9f6" />
        <View style={styles.appShell}>
          <RootNavigator />
        </View>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: '#faf9f6',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 430,
          marginHorizontal: 'auto',
          minHeight: '100vh' as any,
          // subtle shadow to frame the "phone" on desktop
          boxShadow: '0px 0px 40px rgba(26, 28, 26, 0.08)',
        }
      : {}),
  },
});

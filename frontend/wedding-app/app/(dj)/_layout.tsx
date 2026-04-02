import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../store/AuthContext';

export default function DjLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'DJ') {
      router.replace('/(guest)/dashboard');
    }
  }, [user, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}

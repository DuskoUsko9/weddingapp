import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../store/AuthContext';

export default function GuestLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return; // root layout handles unauthenticated
    if (user.role === 'DJ') {
      router.replace('/(dj)/queue');
    } else if (user.role === 'Admin') {
      router.replace('/(admin)/dashboard');
    }
  }, [user, isLoading]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontFamily: 'NotoSerif_700Bold', fontSize: 18 },
        headerShadowVisible: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Domov',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Program',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color, size }) => <Feather name="music" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        }}
      />
      {/* Hidden from tabs — accessible via navigation only */}
      <Tabs.Screen name="parking" options={{ href: null }} />
      <Tabs.Screen name="accommodation" options={{ href: null }} />
      <Tabs.Screen name="questionnaire" options={{ href: null }} />
      <Tabs.Screen name="seating" options={{ href: null }} />
      <Tabs.Screen name="photo-upload" options={{ href: null }} />
      <Tabs.Screen name="photos" options={{ href: null }} />
      <Tabs.Screen name="gallery" options={{ href: null }} />
      <Tabs.Screen name="bingo" options={{ href: null }} />
      <Tabs.Screen name="love-story" options={{ href: null }} />
      <Tabs.Screen name="thank-you" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(250, 249, 246, 0.80)',
    borderTopWidth: 0,
    height: 64,
    paddingBottom: 8,
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } as any
      : {}),
  },
});

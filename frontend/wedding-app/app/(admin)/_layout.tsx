import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../store/AuthContext';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user || (user.role !== 'Admin' && user.role !== 'MasterOfCeremony')) {
      router.replace('/(guest)/dashboard');
    }
  }, [user, isLoading]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.onSurface,
        headerTitleStyle: { fontFamily: 'NotoSerif_700Bold', fontSize: 18 },
        headerShadowVisible: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarLabelStyle: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Prehľad',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feature-flags"
        options={{
          title: 'Funkcie',
          tabBarIcon: ({ color, size }) => <Feather name="toggle-right" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guests"
        options={{
          title: 'Hostia',
          tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="questionnaires"
        options={{
          title: 'Dotazníky',
          tabBarIcon: ({ color, size }) => <Feather name="clipboard" size={size} color={color} />,
        }}
      />
      {/* Hidden from tabs — accessible via dashboard content section */}
      <Tabs.Screen name="song-requests"       options={{ href: null, title: 'Hudobné priania' }} />
      <Tabs.Screen name="feature-toggles"     options={{ href: null }} />
      <Tabs.Screen name="questionnaire-responses" options={{ href: null }} />
      <Tabs.Screen name="schedule"            options={{ href: null, title: 'Program svadby' }} />
      <Tabs.Screen name="menu"                options={{ href: null, title: 'Menu' }} />
      <Tabs.Screen name="static-content"      options={{ href: null, title: 'Statický obsah' }} />
      <Tabs.Screen name="love-story"          options={{ href: null, title: 'Náš príbeh' }} />
      <Tabs.Screen name="bingo"               options={{ href: null, title: 'Svadobné bingo' }} />
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

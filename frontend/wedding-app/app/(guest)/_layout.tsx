import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { Platform, StyleSheet, View, Pressable } from 'react-native';
import { Colors, Radius } from '../../constants/theme';
import { useAuth } from '../../store/AuthContext';

function PhotoTabButton({ children, onPress, accessibilityState }: any) {
  const focused = accessibilityState?.selected;
  return (
    <Pressable onPress={onPress} style={styles.photoTabOuter}>
      <View style={[styles.photoTabInner, focused && styles.photoTabInnerFocused]}>
        <Feather name="camera" size={24} color={focused ? Colors.onPrimary : Colors.onPrimary} />
      </View>
    </Pressable>
  );
}

export default function GuestLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;
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
        name="photo-upload"
        options={{
          title: 'Fotky',
          tabBarButton: (props) => <PhotoTabButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="bingo"
        options={{
          title: 'Bingo',
          tabBarIcon: ({ color, size }) => <Feather name="target" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color, size }) => <Feather name="music" size={size} color={color} />,
        }}
      />

      {/* Hidden from tabs — accessible via dashboard feature cards only */}
      <Tabs.Screen name="menu" options={{ href: null }} />
      <Tabs.Screen name="parking" options={{ href: null }} />
      <Tabs.Screen name="accommodation" options={{ href: null }} />
      <Tabs.Screen name="questionnaire" options={{ href: null }} />
      <Tabs.Screen name="seating" options={{ href: null }} />
      <Tabs.Screen name="photos" options={{ href: null }} />
      <Tabs.Screen name="gallery" options={{ href: null }} />
      <Tabs.Screen name="love-story" options={{ href: null }} />
      <Tabs.Screen name="thank-you" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(250, 249, 246, 0.80)',
    borderTopWidth: 0,
    height: 68,
    paddingBottom: 8,
    ...(Platform.OS === 'web'
      ? { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' } as any
      : {}),
  },

  // Floating camera button
  photoTabOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  photoTabInner: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14, // lifts button above the tab bar
    // @ts-ignore
    boxShadow: '0px 4px 16px rgba(114, 91, 40, 0.35)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  photoTabInnerFocused: {
    backgroundColor: Colors.primary,
  },
});

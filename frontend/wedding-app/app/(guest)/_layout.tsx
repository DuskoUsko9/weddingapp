import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function GuestLayout() {
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

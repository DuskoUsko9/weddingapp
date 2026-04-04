import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../store/AuthContext';
import { useImpersonation } from '../store/ImpersonationContext';
import { Typography, Spacing, Radius } from '../constants/theme';

export function ImpersonationBanner() {
  const { user, login } = useAuth();
  const { adminUser, clearAdmin } = useImpersonation();
  const router = useRouter();

  if (!adminUser) return null;

  const handleExit = async () => {
    await login(adminUser);
    clearAdmin();
    router.replace('/(admin)/dashboard');
  };

  return (
    <View style={s.banner} pointerEvents="box-none">
      <View style={s.inner}>
        <Feather name="eye" size={14} color="#ffffff" />
        <Text style={s.text} numberOfLines={1}>
          Simuluješ: <Text style={s.name}>{user?.guestName ?? '—'}</Text>
        </Text>
        <TouchableOpacity style={s.btn} onPress={handleExit} activeOpacity={0.8}>
          <Feather name="x" size={13} color="#725b28" />
          <Text style={s.btnText}>Admin panel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 16 : 90,
    left: 16,
    right: 16,
    zIndex: 999,
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#1a1c1a',
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 8,
    maxWidth: 480,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  text: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  name: {
    fontFamily: 'Manrope_600SemiBold',
    color: '#ffffff',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fde8a0',
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  btnText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: '#725b28',
  },
});

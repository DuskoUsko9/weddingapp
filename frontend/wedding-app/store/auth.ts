import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { AuthUser } from '../types/api';

const TOKEN_KEY = 'madu_jwt';
const USER_KEY = 'madu_user';

// SecureStore is not available on web — fall back to localStorage
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  },
};

export async function getToken(): Promise<string | null> {
  return storage.getItem(TOKEN_KEY);
}

export async function saveAuth(user: AuthUser): Promise<void> {
  await storage.setItem(TOKEN_KEY, user.token);
  await storage.setItem(USER_KEY, JSON.stringify(user));
}

export async function loadAuth(): Promise<AuthUser | null> {
  const raw = await storage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearAuth(): Promise<void> {
  await storage.removeItem(TOKEN_KEY);
  await storage.removeItem(USER_KEY);
}

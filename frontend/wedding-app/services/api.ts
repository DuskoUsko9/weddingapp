import axios from 'axios';
import Constants from 'expo-constants';
import { getToken } from '../store/auth';
import type { ApiResponse } from '../types/api';

const BASE_URL = (Constants.expoConfig?.extra?.apiUrl as string) ?? 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap { data, error } envelope
apiClient.interceptors.response.use(
  (res) => {
    const envelope = res.data as ApiResponse<unknown>;
    if (envelope.error) {
      return Promise.reject(new Error(envelope.error));
    }
    res.data = envelope.data;
    return res;
  },
  (err) => {
    const message =
      err.response?.data?.error ??
      err.response?.data?.title ??
      err.message ??
      'Nastala neočakávaná chyba.';
    return Promise.reject(new Error(message));
  }
);

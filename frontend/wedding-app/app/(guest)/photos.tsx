import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function PhotosScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(guest)/photo-upload');
  }, [router]);

  return null;
}


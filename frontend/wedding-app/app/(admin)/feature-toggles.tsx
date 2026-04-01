import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function FeatureTogglesAliasScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(admin)/feature-flags');
  }, [router]);

  return null;
}


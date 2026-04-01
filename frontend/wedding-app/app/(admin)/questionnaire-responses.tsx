import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function QuestionnaireResponsesAliasScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(admin)/questionnaires');
  }, [router]);

  return null;
}


import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';
import type { FeatureFlag } from '../types/api';

export function useFeatureFlag(key: string) {
  const { data: flags = [], isLoading } = useQuery<FeatureFlag[]>({
    queryKey: ['feature-flags'],
    queryFn: async () => (await apiClient.get('/feature-flags')).data,
    staleTime: 10_000,
  });

  const flag = flags.find((f) => f.key === key);
  return { isEnabled: flag?.isEnabled ?? false, isLoading };
}

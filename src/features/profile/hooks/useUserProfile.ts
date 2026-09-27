import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from '../services/profileRepository';

/**
 * React Query bellek önbelleği: ekranlar arası gezerken
 * aynı profil tekrar tekrar okunmaz.
 */
export function useUserProfile(uid: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', uid],
    queryFn: () => getUserProfile(uid!),
    enabled: !!uid,
    staleTime: Infinity, // profil nadiren değişir; değiştiğinde invalidateQueries çağır
  });
}

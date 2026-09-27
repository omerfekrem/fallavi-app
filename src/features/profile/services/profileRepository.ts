import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { getDocCacheFirst } from '@/lib/firebase/firestoreHelpers';
import type { AuthProviderId, UserProfile } from '@/types/user';

/**
 * TASARRUF: Her girişte "lastLogin" yazmak yerine sadece ilk kayıtta 1 yazma.
 * isNewUser bilgisi Firebase Auth'tan bedava gelir, ekstra okuma gerekmez.
 */
export async function ensureUserProfile(
  user: FirebaseAuthTypes.User,
  provider: AuthProviderId,
  isNewUser: boolean,
) {
  if (!isNewUser) return;

  const profile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db(), COLLECTIONS.users, user.uid), profile, { merge: true });
}

export function getUserProfile(uid: string) {
  return getDocCacheFirst<UserProfile>(COLLECTIONS.users, uid);
}

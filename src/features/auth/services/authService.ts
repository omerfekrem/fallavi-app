import { signOut as firebaseSignOut } from '@react-native-firebase/auth';

import { ensureUserProfile } from '@/features/profile/services/profileRepository';
import { auth } from '@/lib/firebase';
import type { AuthProviderId } from '@/types/user';

import { signInWithApple } from './appleAuth';
import { signInWithGoogle, signOutGoogle } from './googleAuth';

export type SignInMethod = 'google' | 'apple';

export async function signIn(method: SignInMethod) {
  const result = method === 'google' ? await signInWithGoogle() : await signInWithApple();
  if (!result) return null; // iptal

  const provider: AuthProviderId = method === 'google' ? 'google.com' : 'apple.com';
  // Sadece YENİ kullanıcı için Firestore'a yazar
  await ensureUserProfile(result.user, provider, result.additionalUserInfo?.isNewUser ?? false);
  return result.user;
}

export async function signOut() {
  await signOutGoogle();
  await firebaseSignOut(auth());
}

import { AppleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

import { auth } from '@/lib/firebase';

export async function isAppleSignInAvailable() {
  return Platform.OS === 'ios' && (await AppleAuthentication.isAvailableAsync());
}

/**
 * Replay saldırılarına karşı nonce: Apple'a SHA256 hash'i, Firebase'e ham hali gider.
 * Kullanıcı iptal ederse null döner.
 */
export async function signInWithApple() {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );

  try {
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!appleCredential.identityToken) throw new Error('Apple identityToken alınamadı.');

    const credential = AppleAuthProvider.credential(appleCredential.identityToken, rawNonce);
    const result = await signInWithCredential(auth(), credential);

    // Apple ismi SADECE ilk girişte verir; kaybetmemek için hemen profile yaz.
    const { givenName, familyName } = appleCredential.fullName ?? {};
    const fullName = [givenName, familyName].filter(Boolean).join(' ');
    if (fullName && !result.user.displayName) {
      await result.user.updateProfile({ displayName: fullName });
    }
    return result;
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'ERR_REQUEST_CANCELED') return null;
    throw error;
  }
}

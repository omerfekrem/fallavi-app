import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { env } from '@/config/env';
import { auth } from '@/lib/firebase';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) return;
  GoogleSignin.configure({
    webClientId: env.googleWebClientId, // Firebase'in idToken üretebilmesi için şart
    offlineAccess: false,
  });
  configured = true;
}

/** Kullanıcı iptal ederse null döner, hata fırlatmaz. */
export async function signInWithGoogle() {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  try {
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return null; // kullanıcı iptal etti

    const idToken = response.data.idToken;
    if (!idToken) throw new Error('Google idToken alınamadı. webClientId ayarını kontrol et.');

    const credential = GoogleAuthProvider.credential(idToken);
    return signInWithCredential(auth(), credential);
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) return null;
    throw error;
  }
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Google oturumu yoksa sorun değil
  }
}

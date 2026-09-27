/** Ortam değişkenlerine tek noktadan, tipli erişim. */
export const env = {
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  useEmulator: __DEV__ && process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true',
  emulatorHost: process.env.EXPO_PUBLIC_EMULATOR_HOST ?? 'localhost',
} as const;

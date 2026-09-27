import type { ExpoConfig } from 'expo/config';

/**
 * Tüm gizli/ortama bağlı değerler .env'den gelir (EXPO_PUBLIC_ önekli olanlar
 * uygulama koduna da gömülür). google-services.json ve GoogleService-Info.plist
 * repoya GİRMEZ; yerelde ./credentials altında durur, EAS'ta "file secret" olur.
 */
const IOS_URL_SCHEME =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME || 'com.googleusercontent.apps.placeholder';

const config: ExpoConfig = {
  name: 'Fallavi',
  slug: 'fallavi',
  scheme: 'fallavi',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#231A2E',
  },
  ios: {
    bundleIdentifier: 'com.fallavi.app',
    supportsTablet: false,
    usesAppleSignIn: true,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_PLIST ?? './credentials/GoogleService-Info.plist',
  },
  android: {
    package: 'com.fallavi.app',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './credentials/google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#231A2E',
    },
  },
  plugins: [
    'expo-router',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    'expo-apple-authentication',
    ['@react-native-google-signin/google-signin', { iosUrlScheme: IOS_URL_SCHEME }],
    [
      'expo-build-properties',
      {
        // React Native Firebase iOS için static framework ister
        ios: { useFrameworks: 'static' },
      },
    ],
  ],
  experiments: { typedRoutes: true },
};

export default config;

import { Platform } from 'react-native';

/** Tüm renk/boşluk/tipografi kararları burada; ekranlarda sabit değer yazma. */
export const colors = {
  night: '#231A2E', // arka plan
  nightRaised: '#2F2440',
  cream: '#F3E9DC', // ana metin
  mist: '#A89BB5', // ikincil metin
  gold: '#C9A227', // vurgu
  danger: '#E5877A',
  white: '#FFFFFF',
  ink: '#1F1F1F',
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 8, md: 14, pill: 999 } as const;

export const fonts = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
} as const;

export const type = {
  display: { fontFamily: fonts.display, fontSize: 48, lineHeight: 54, letterSpacing: 0.5 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
} as const;

import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import {
  AppleSignInButton,
  GoogleSignInButton,
  isAppleSignInAvailable,
  useSignIn,
} from '@/features/auth';
import { colors, spacing, type } from '@/theme';

export default function LoginScreen() {
  const { signIn, pending, error } = useSignIn();
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    isAppleSignInAvailable().then(setAppleAvailable);
  }, []);

  const busy = pending !== null;

  return (
    <Screen style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.wordmark} accessibilityRole="header">
          Fallavi
        </Text>
        <View style={styles.rule} />
        <Text style={styles.tagline}>Fincanın dibinde ne var, birlikte bakalım.</Text>
      </View>

      <View style={styles.actions}>
        {/* iOS'ta Apple üstte: Apple yönergeleri Apple girişinin eşit ya da daha belirgin olmasını ister */}
        {appleAvailable && (
          <AppleSignInButton onPress={() => signIn('apple')} disabled={busy} />
        )}
        <GoogleSignInButton
          onPress={() => signIn('google')}
          loading={pending === 'google'}
          disabled={busy}
        />

        {error && (
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}

        <Text style={styles.legal}>
          Devam ederek{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://fallavi.app/kosullar')}>
            Kullanım Koşulları
          </Text>{' '}
          ve{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://fallavi.app/gizlilik')}>
            Gizlilik Politikası
          </Text>
          'nı kabul etmiş olursun.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingBottom: spacing.lg },
  brand: { flex: 1, justifyContent: 'center' },
  wordmark: { ...type.display, color: colors.cream },
  rule: { width: 40, height: 2, backgroundColor: colors.gold, marginVertical: spacing.md },
  tagline: { ...type.body, color: colors.mist, maxWidth: 280 },
  actions: { gap: spacing.sm + 4 },
  error: { ...type.small, color: colors.danger, textAlign: 'center' },
  legal: { ...type.small, color: colors.mist, textAlign: 'center', marginTop: spacing.sm },
  link: { color: colors.cream, textDecorationLine: 'underline' },
});

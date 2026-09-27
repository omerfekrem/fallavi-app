import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { signOut } from '@/features/auth';
import { useUserProfile } from '@/features/profile/hooks/useUserProfile';
import { useAuth } from '@/providers/AuthProvider';
import { colors, spacing, type } from '@/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.uid);
  const name = profile?.displayName ?? user?.displayName ?? 'Hoş geldin';

  return (
    <Screen style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Merhaba, {name}</Text>
        <Text style={styles.subtitle}>İlk falın için bir fincan fotoğrafı yükleyerek başla.</Text>
      </View>
      <Button label="Çıkış yap" variant="ghost" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingBottom: spacing.lg },
  body: { flex: 1, justifyContent: 'center', gap: spacing.sm },
  title: { ...type.display, fontSize: 32, lineHeight: 38, color: colors.cream },
  subtitle: { ...type.body, color: colors.mist },
});

import * as AppleAuthentication from 'expo-apple-authentication';
import { StyleSheet } from 'react-native';

import { radius } from '@/theme';

/** Apple, kendi native butonunun kullanılmasını ister (App Store incelemesi). */
export function AppleSignInButton({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
      cornerRadius={radius.md}
      style={[styles.button, disabled && { opacity: 0.6 }]}
      onPress={disabled ? () => {} : onPress}
    />
  );
}

const styles = StyleSheet.create({ button: { height: 52, width: '100%' } });

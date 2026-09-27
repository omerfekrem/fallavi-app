import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, radius, spacing, type } from '@/theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'light' | 'ghost';
  style?: ViewStyle;
}

export function Button({ label, onPress, loading, disabled, variant = 'light', style }: Props) {
  const isLight = variant === 'light';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isLight ? styles.light : styles.ghost,
        (pressed || disabled) && { opacity: 0.7 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isLight ? colors.ink : colors.cream} />
      ) : (
        <Text style={[styles.label, { color: isLight ? colors.ink : colors.cream }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  light: { backgroundColor: colors.white },
  ghost: { borderWidth: 1, borderColor: colors.mist },
  label: { ...type.body, fontWeight: '600' },
});

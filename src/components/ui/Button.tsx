import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.ivory,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.btn,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.btn,
    borderWidth: 1,
    borderColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.ui,
  },
  labelPrimary: {
    color: colors.obsidian,
  },
  labelSecondary: {
    color: colors.ivory,
  },
  labelGhost: {
    color: colors.zinc,
  },
});

export function Button({
  children,
  variant = 'primary',
  onPress,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const variantStyle = styles[variant];
  const labelStyle =
    variant === 'primary'
      ? styles.labelPrimary
      : variant === 'secondary'
      ? styles.labelSecondary
      : styles.labelGhost;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        variantStyle,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[typography.ui, labelStyle]}>{children}</Text>
    </Pressable>
  );
}
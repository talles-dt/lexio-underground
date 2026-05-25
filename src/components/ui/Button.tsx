import { Pressable, Text, StyleSheet } from "react-native";
import { colors, radius, typography } from "@/theme/tokens";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
  },
  ghost: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    ...typography.ui,
  },
  labelGhost: {
    color: colors.zinc,
  },
  labelPrimary: {
    color: colors.obsidian,
  },
  labelSecondary: {
    color: colors.ivory,
  },
  primary: {
    alignItems: "center",
    backgroundColor: colors.ivory,
    borderRadius: radius.btn,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  secondary: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.ivory,
    borderRadius: radius.btn,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});

export function Button({
  children,
  variant = "primary",
  onPress,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const variantStyle = styles[variant];
  const labelStyle =
    variant === "primary"
      ? styles.labelPrimary
      : variant === "secondary"
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

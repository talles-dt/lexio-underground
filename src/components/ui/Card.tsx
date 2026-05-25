import { View, StyleSheet, ViewProps } from "react-native";
import { colors, radius, spacing } from "@/theme/tokens";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({
  children,
  elevated = false,
  style,
  ...props
}: CardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSubtle,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing[4],
  },
  elevated: {
    elevation: 8,
    shadowColor: colors.phosphor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
});

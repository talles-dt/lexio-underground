import { View, StyleSheet } from "react-native";
import React from "react";
import { colors, radius, spacing } from "@/theme/tokens";

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: Record<string, unknown>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

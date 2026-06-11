"use client";

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/tokens";

interface CardProps {
  children: React.ReactNode;
  style?: object;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
});

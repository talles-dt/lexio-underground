"use client";

import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors, radius } from "@/theme/tokens";

type Variant = "primary" | "secondary" | "tertiary" | "invisible";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  onPress,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ].filter(Boolean);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.btn,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
  },
  invisible: {
    backgroundColor: "transparent",
  },
  primary: {
    backgroundColor: colors.phosphor,
  },
  secondary: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.outlineVariant,
    borderWidth: 1,
  },
  tertiary: {
    backgroundColor: colors.amber,
  },
  text: {
    color: colors.obsidian,
    fontWeight: "600",
  },
});

"use client";

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  onPress?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

// Fallback theme tokens
const colors = {
  phosphor: "#FFDD00",
  surfaceContainerHigh: "#E0E0E0",
  outlineVariant: "#CCCCCC",
  obsidian: "#2A2A2A",
  amber: "#FFC107",
};

const spacing = {
  3: 12,
  6: 24,
};

const radius = {
  btn: 8,
};
export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    onPress,
    disabled = false,
    fullWidth = false,
  } = props;

  const buttonStyles = [
    styles.base,
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ].filter(Boolean) as (typeof styles.base)[];

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
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
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

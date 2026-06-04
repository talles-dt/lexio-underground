"use client";

import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { colors, typography, spacing, radius } from "@/theme/tokens";

interface PreambleProps {
  onPress: () => void;
  onBeginCartografa?: () => void;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[6],
  },
  buttonText: {
    color: colors.ivory,
    fontSize: typography.ui.fontSize,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing[8],
  },
  subtitle: {
    color: colors.secondary,
    fontSize: typography.h2.fontSize,
    marginBottom: spacing[16],
    textAlign: "center",
  },
  title: {
    color: colors.phosphor,
    fontSize: typography.h1.fontSize,
    fontWeight: "bold",
    marginBottom: spacing[4],
  },
});

export const OnboardingPreamble = ({ onPress }: PreambleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lexio Underground</Text>
      <Text style={styles.subtitle}>
        Map your ignorance. Master your language.
      </Text>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Begin your Cartografa</Text>
      </Pressable>
    </View>
  );
};

export const Preamble = OnboardingPreamble; // backward compatibility

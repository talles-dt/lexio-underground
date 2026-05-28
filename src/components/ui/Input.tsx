import { TextInput, StyleSheet, TextInputProps } from "react-native";
import React from "react";
import { colors, radius, typography } from "@/theme/tokens";

export function Input(props: TextInputProps) {
  return <TextInput style={styles.input} {...props} />;
}

export default Input;

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.btn,
    color: colors.onSurface,
    fontFamily: typography.body.fontFamily,
    padding: 12,
  },
});

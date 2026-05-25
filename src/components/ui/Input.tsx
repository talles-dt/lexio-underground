import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors, radius, typography } from "@/theme/tokens";

interface InputProps extends TextInputProps {
  // Additional props can be added here
}

export function Input(props: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={colors.zinc}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.obsidian,
    borderColor: colors.borderSubtle,
    borderRadius: radius.btn,
    borderWidth: 1,
    color: colors.ivory,
    width: "100%",
    ...typography.ui,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

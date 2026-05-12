import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';

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
    width: '100%',
    backgroundColor: colors.obsidian,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.btn,
    color: colors.ivory,
    ...typography.ui,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
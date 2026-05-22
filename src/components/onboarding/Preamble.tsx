// src/components/onboarding/Preamble.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, typography, spacing } from '@/theme/tokens';

export const OnboardingPreamble = ({ onBeginCartografa }: { onBeginCartografa: () => void }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.wordmark}>Lexio Underground</Text>
      <Text style={styles.description}>
        Every language learner has a map of what they don't know. Today we draw yours.
      </Text>
      <Pressable
        onPress={onBeginCartografa}
        style={styles.button}
        accessibilityLabel="Begin Cartografa"
      >
        <Text style={styles.buttonText}>Begin Cartografa</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian, // Black background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  wordmark: {
    ...typography.display,
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  description: {
    ...typography.bodyItalic,
    color: colors.zinc,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
    marginBottom: spacing[12],
  },
  button: {
    backgroundColor: colors.phosphor,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  buttonText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: '600' as const,
  },
});
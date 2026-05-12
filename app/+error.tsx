import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { colors, typography, spacing } from '@/theme/tokens';

export default function GlobalError({
  error,
  retry,
}: {
  error: Error;
  retry?: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.code}>ERR</Text>
      <Text style={styles.title}>Something broke.</Text>
      <Text style={styles.body}>{error.message}</Text>
      {retry && (
        <Text style={styles.retry} onPress={retry}>
          Try again
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  code: {
    ...typography.display,
    color: colors.crimson,
    marginBottom: spacing[4],
  },
  title: {
    ...typography.h1,
    color: colors.ivory,
    marginBottom: spacing[3],
  },
  body: {
    ...typography.body,
    color: colors.zinc,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  retry: {
    ...typography.ui,
    color: colors.phosphor,
  },
});
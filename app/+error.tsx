import { ScrollView, StyleSheet, View, Text } from "react-native";
import { colors, typography, spacing } from "@/theme/tokens";

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
  body: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[6],
    textAlign: "center",
  },
  code: {
    ...typography.display,
    color: colors.crimson,
    marginBottom: spacing[4],
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.obsidian,
    flex: 1,
    justifyContent: "center",
    padding: spacing[8],
  },
  retry: {
    ...typography.ui,
    color: colors.phosphor,
  },
  title: {
    ...typography.h1,
    color: colors.ivory,
    marginBottom: spacing[3],
  },
});

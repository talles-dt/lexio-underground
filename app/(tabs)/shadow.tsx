import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@/theme/tokens";
import { Card } from "@/components/ui";

export default function ShadowScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stageLabel}>CONVERSATION SHADOW</Text>
        <Text style={styles.title}>Practice freely.</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Record a message</Text>
        <Text style={styles.cardBody}>
          Speak naturally about anything — your day, a memory, a thought. The AI
          will respond in English without ever correcting you.
        </Text>
        <View style={styles.recordBtn}>
          <Text style={styles.recordBtnText}>◎ Start Recording</Text>
        </View>
      </Card>

      <View style={styles.history}>
        <Text style={styles.historyLabel}>LAST EXCHANGE</Text>
        <Text style={styles.historyEmpty}>
          No exchanges yet. Start speaking.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>The Krashen Principle</Text>
        <Text style={styles.infoText}>
          The AI never corrects. It only models. Your monitor activates only
          after review — never during. This keeps the affective filter low and
          acquisition high.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing[6],
  },
  cardBody: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[4],
  },
  cardTitle: {
    ...typography.h2,
    color: colors.ivory,
    marginBottom: spacing[3],
  },
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
    padding: spacing[4],
    paddingTop: spacing[8],
  },
  header: {
    marginBottom: spacing[6],
  },
  history: {
    marginBottom: spacing[6],
  },
  historyEmpty: {
    ...typography.body,
    color: colors.zinc,
    fontStyle: "italic",
  },
  historyLabel: {
    ...typography.caption,
    color: colors.zinc,
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  infoBox: {
    borderLeftColor: colors.violet,
    borderLeftWidth: 2,
    paddingLeft: spacing[4],
  },
  infoText: {
    ...typography.body,
    color: colors.zinc,
  },
  infoTitle: {
    ...typography.ui,
    color: colors.violet,
    marginBottom: spacing[2],
  },
  recordBtn: {
    alignItems: "center",
    backgroundColor: colors.phosphor,
    borderRadius: 8,
    paddingVertical: 14,
  },
  recordBtnText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: "600",
  },
  stageLabel: {
    ...typography.caption,
    color: colors.amber,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  title: {
    ...typography.h1,
    color: colors.ivory,
  },
});

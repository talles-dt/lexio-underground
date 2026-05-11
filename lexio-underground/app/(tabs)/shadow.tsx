import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/theme/tokens';
import { Card } from '@/components/ui';

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
          Speak naturally about anything — your day, a memory, a thought.
          The AI will respond in English without ever correcting you.
        </Text>
        <View style={styles.recordBtn}>
          <Text style={styles.recordBtnText}>◎ Start Recording</Text>
        </View>
      </Card>

      <View style={styles.history}>
        <Text style={styles.historyLabel}>LAST EXCHANGE</Text>
        <Text style={styles.historyEmpty}>No exchanges yet. Start speaking.</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>The Krashen Principle</Text>
        <Text style={styles.infoText}>
          The AI never corrects. It only models. Your monitor activates
          only after review — never during. This keeps the affective filter
          low and acquisition high.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    padding: spacing[4],
    paddingTop: spacing[8],
  },
  header: {
    marginBottom: spacing[6],
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
  card: {
    marginBottom: spacing[6],
  },
  cardTitle: {
    ...typography.h2,
    color: colors.ivory,
    marginBottom: spacing[3],
  },
  cardBody: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[4],
  },
  recordBtn: {
    backgroundColor: colors.phosphor,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  recordBtnText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: '600',
  },
  history: {
    marginBottom: spacing[6],
  },
  historyLabel: {
    ...typography.caption,
    color: colors.zinc,
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  historyEmpty: {
    ...typography.body,
    color: colors.zinc,
    fontStyle: 'italic',
  },
  infoBox: {
    borderLeftWidth: 2,
    borderLeftColor: colors.violet,
    paddingLeft: spacing[4],
  },
  infoTitle: {
    ...typography.ui,
    color: colors.violet,
    marginBottom: spacing[2],
  },
  infoText: {
    ...typography.body,
    color: colors.zinc,
  },
});
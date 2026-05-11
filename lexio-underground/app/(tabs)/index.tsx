import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { use LearnerStore } from '@/stores/learnerStore';
import { colors, typography, spacing } from '@/theme/tokens';
import { Card } from '@/components/ui';

export default function PulseScreen() {
  const { cartografaComplete, maturityStage } = useLearnerStore();

  if (!cartografaComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.logoMark}>L</Text>
          <Text style={styles.emptyTitle}>Start with Cartografa</Text>
          <Text style={styles.emptySubtitle}>
            First, we map what you don't know.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.stageLabel}>{maturityStage.toUpperCase()}</Text>
        <Text style={styles.greeting}>Your daily pulse awaits.</Text>
      </View>

      <Card style={styles.pulseCard}>
        <Text style={styles.pulseTitle}>Today's Cultural Atom</Text>
        <View style={styles.atomPreview}>
          <Text style={styles.atomName}>SAUDADE</Text>
          <Text style={styles.atomOrigin}>Portuguese</Text>
        </View>
        <Text style={styles.atomDefinition}>
          A melancholic longing for something or someone that is absent.
          Not pure sadness — a bittersweet recognition of impermanence.
        </Text>
        <View style={styles.pulseActions}>
          <Text style={styles.actionBtn}>◉ Hear it</Text>
          <Text style={styles.actionBtn}>Place in Palace →</Text>
        </View>
      </Card>

      <View style={styles.progressSection}>
        <Text style={styles.sectionLabel}>This Week</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
        <Text style={styles.progressText}>3 of 7 days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  content: {
    padding: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[16],
  },
  header: {
    marginBottom: spacing[6],
  },
  stageLabel: {
    ...typography.caption,
    color: colors.phosphor,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  greeting: {
    ...typography.h1,
    color: colors.ivory,
  },
  pulseCard: {
    marginBottom: spacing[6],
  },
  pulseTitle: {
    ...typography.caption,
    color: colors.zinc,
    marginBottom: spacing[3],
    letterSpacing: 1,
  },
  atomPreview: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  atomName: {
    ...typography.h1,
    color: colors.ivory,
  },
  atomOrigin: {
    ...typography.caption,
    color: colors.violet,
  },
  atomDefinition: {
    ...typography.body,
    color: colors.ivory,
    marginBottom: spacing[4],
  },
  pulseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    ...typography.ui,
    color: colors.phosphor,
  },
  progressSection: {
    marginBottom: spacing[6],
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.zinc,
    marginBottom: spacing[2],
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderSubtle,
    borderRadius: 2,
    marginBottom: spacing[2],
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.phosphor,
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    color: colors.zinc,
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  logoMark: {
    fontFamily: 'Syne-Bold',
    fontSize: 64,
    color: colors.ivory,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    ...typography.h1,
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.zinc,
    textAlign: 'center',
  },
});
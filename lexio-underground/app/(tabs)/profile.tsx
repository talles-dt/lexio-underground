import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLearnerStore } from '@/stores/learnerStore';
import { colors, typography, spacing, stageColors } from '@/theme/tokens';
import { Card } from '@/components/ui';

export default function ProfileScreen() {
  const { maturityStage, pillarScores, palaceItems, cartografaComplete } =
    useLearnerStore();
  const stageColor = stageColors[maturityStage] ?? colors.phosphor;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.avatar, { borderColor: stageColor }]}>
          <Text style={[styles.avatarText, { color: stageColor }]}>
            {maturityStage[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.stageName}>{maturityStage.toUpperCase()}</Text>
        <Text style={styles.tagline}>
          {maturityStage === 'roots' && 'The beginning of knowing.'}
          {maturityStage === 'sprouts' && 'First words, finding their place.'}
          {maturityStage === 'branches' && 'Reaching outward.'}
          {maturityStage === 'canopy' && 'Seeing the whole structure.'}
          {maturityStage === 'underground' && 'You are the culture.'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{palaceItems}</Text>
          <Text style={styles.statLabel}>Items learned</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {cartografaComplete ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.statLabel}>Cartografa</Text>
        </Card>
      </View>

      {pillarScores && (
        <Card style={styles.pillarsCard}>
          <Text style={styles.pillarsTitle}>Pillar Scores</Text>
          {Object.entries(pillarScores).map(([key, value]) => (
            <View key={key} style={styles.pillarRow}>
              <Text style={styles.pillarName}>{key}</Text>
              <View style={styles.pillarBar}>
                <View
                  style={[
                    styles.pillarFill,
                    { width: `${(value.score ?? 0) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.pillarScore}>
                {Math.round((value.score ?? 0) * 100)}
              </Text>
            </View>
          ))}
        </Card>
      )}

      <View style={styles.actions}>
        <Text style={styles.actionItem}>Settings</Text>
        <Text style={styles.actionItem}>Subscription</Text>
        <Text style={styles.actionItem}>Sign Out</Text>
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
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  avatarText: {
    ...typography.display,
    fontSize: 32,
  },
  stageName: {
    ...typography.h1,
    color: colors.ivory,
    letterSpacing: 2,
  },
  tagline: {
    ...typography.body,
    color: colors.zinc,
    fontStyle: 'italic',
    marginTop: spacing[2],
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h1,
    color: colors.ivory,
    marginBottom: spacing[1],
  },
  statLabel: {
    ...typography.caption,
    color: colors.zinc,
  },
  pillarsCard: {
    marginBottom: spacing[6],
  },
  pillarsTitle: {
    ...typography.ui,
    color: colors.zinc,
    letterSpacing: 1,
    marginBottom: spacing[4],
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  pillarName: {
    ...typography.caption,
    color: colors.ivory,
    width: 70,
    textTransform: 'capitalize',
  },
  pillarBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.borderSubtle,
    borderRadius: 2,
  },
  pillarFill: {
    height: '100%',
    backgroundColor: colors.phosphor,
    borderRadius: 2,
  },
  pillarScore: {
    ...typography.caption,
    color: colors.zinc,
    width: 30,
    textAlign: 'right',
  },
  actions: {
    gap: spacing[3],
  },
  actionItem: {
    ...typography.body,
    color: colors.ivory,
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
});
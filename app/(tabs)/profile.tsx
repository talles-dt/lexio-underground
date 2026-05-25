import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLearnerStore } from "@/stores/learnerStore";
import { colors, typography, spacing, stageColors } from "@/theme/tokens";
import { Card } from "@/components/ui";

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
          {maturityStage === "roots" && "The beginning of knowing."}
          {maturityStage === "sprouts" && "First words, finding their place."}
          {maturityStage === "branches" && "Reaching outward."}
          {maturityStage === "canopy" && "Seeing the whole structure."}
          {maturityStage === "underground" && "You are the culture."}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{palaceItems}</Text>
          <Text style={styles.statLabel}>Items learned</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>
            {cartografaComplete ? "Yes" : "No"}
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
  actionItem: {
    ...typography.body,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
    color: colors.ivory,
    paddingVertical: spacing[3],
  },
  actions: {
    gap: spacing[3],
  },
  avatar: {
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 2,
    height: 80,
    justifyContent: "center",
    marginBottom: spacing[3],
    width: 80,
  },
  avatarText: {
    ...typography.display,
    fontSize: 32,
  },
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[16],
    paddingTop: spacing[8],
  },
  header: {
    alignItems: "center",
    marginBottom: spacing[8],
  },
  pillarBar: {
    backgroundColor: colors.borderSubtle,
    borderRadius: 2,
    flex: 1,
    height: 4,
  },
  pillarFill: {
    backgroundColor: colors.phosphor,
    borderRadius: 2,
    height: "100%",
  },
  pillarName: {
    ...typography.caption,
    color: colors.ivory,
    textTransform: "capitalize",
    width: 70,
  },
  pillarRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  pillarScore: {
    ...typography.caption,
    color: colors.zinc,
    textAlign: "right",
    width: 30,
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
  stageName: {
    ...typography.h1,
    color: colors.ivory,
    letterSpacing: 2,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.zinc,
  },
  statValue: {
    ...typography.h1,
    color: colors.ivory,
    marginBottom: spacing[1],
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  tagline: {
    ...typography.body,
    color: colors.zinc,
    fontStyle: "italic",
    marginTop: spacing[2],
    textAlign: "center",
  },
});

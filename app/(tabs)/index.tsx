// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLearnerStore } from "@/stores/learnerStore";
import { colors, typography, spacing } from "@/theme/tokens";
import { Card } from "@/components/ui";

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard cards would go here */}
        <View style={{ marginBottom: spacing[12] }}>
          <Text style={typography.h2}>Welcome Back</Text>
          <Text style={typography.body}>
            Your Cartografa is complete. Ready to dive into your personalized
            learning path?
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    flex: 1,
    padding: spacing[6],
  },
  content: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptySubtitle: {
    color: colors.zinc,
    fontSize: 16,
    textAlign: "center",
  },
  emptyTitle: {
    color: colors.ivory,
    fontSize: 24,
    fontWeight: "600",
    marginBottom: spacing[2],
  },
  logoMark: {
    color: colors.phosphor,
    fontSize: 48,
    fontWeight: "800",
    marginBottom: spacing[4],
  },
});
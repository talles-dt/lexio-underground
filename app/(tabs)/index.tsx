// app/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLearnerStore } from '@/stores/learnerStore';
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard cards would go here */}
        <View style={{ marginBottom: spacing[12] }}>
          <Text style={typography.h3}>Welcome Back</Text>
          <Text style={typography.body}>
            Your Cartografa is complete. Ready to dive into your personalized learning path?
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing[6],
  },
  content: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.phosphor,
    marginBottom: spacing[4],
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.ivory,
    marginBottom: spacing[2],
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.zinc,
    textAlign: 'center',
  },
});
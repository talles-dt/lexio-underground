// app/index.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { colors, typography, spacing, radius } from "@/theme/tokens";

export default function HomePage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Lexio Underground wordmark */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Lexio Underground</Text>
        </View>
        {/* Tagline */}
        <Text style={styles.tagline}>
          Map your ignorance. Master your language.
        </Text>
        {/* Description */}
        <Text style={styles.description}>
          Lexio Underground is a self-diagnostic tool for language learners.
          Begin by discovering what you don't know through the Cartografa
          assessment, then receive a personalized learning path based on your
          Memory Palace hook.
        </Text>
        {/* Call to action */}
        <Link href="/diagnostico">
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaText}>Begin your Cartografa</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing[4],
  },
  content: {
    alignItems: "center",
  },
  ctaButton: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  ctaText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: "600" as const,
  },
  description: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[8],
    maxWidth: 300,
    textAlign: "center",
  },
  logoContainer: {
    marginBottom: spacing[6],
  },
  logoText: {
    ...typography.display,
    color: colors.ivory,
    textAlign: "center",
  },
  tagline: {
    ...typography.bodyLg,
    color: colors.phosphor,
    fontStyle: "italic" as const,
    marginBottom: spacing[4],
    textAlign: "center",
  },
});

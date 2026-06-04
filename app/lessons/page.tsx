"use client";

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";

export default function LessonsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Link href="/palace" style={styles.navLink}>
          <View style={styles.navLinkContent}>
            <Text style={styles.navLinkText}>Home</Text>
          </View>
        </Link>
        <Link href="/diagnostico" style={styles.navLink}>
          <View style={styles.navLinkContent}>
            <Text style={styles.navLinkText}>Take the Cartografa</Text>
          </View>
        </Link>
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.title}>My Lessons</Text>
        <Text style={styles.placeholder}>No lessons found.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
    padding: spacing[4],
  },
  mainContent: {
    alignSelf: "center",
    marginTop: spacing[6],
    maxWidth: 600,
    width: "100%",
  },
  navLink: {
    textDecorationLine: "none",
  },
  navLinkContent: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    marginRight: spacing[3],
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  navLinkText: {
    color: colors.obsidian,
    fontWeight: "600",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing[4],
  },
  placeholder: {
    color: colors.zinc,
    fontStyle: "italic",
  },
  title: {
    color: colors.ivory,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing[4],
  },
});

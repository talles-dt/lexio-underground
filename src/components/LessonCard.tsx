"use client";

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "@/theme/tokens";

interface Lesson {
  id: string;
  title: string;
  mnemonic: string;
  archetype_key: string;
  difficulty: string;
}

function highlightRichText(text: string) {
  return text
    .replace(
      /\*\*(.*?)\*\*/gm,
      (match, group) => `<Text style={styles.bold}>${group}</Text>`
    )
    .replace(
      /\((.*?)\)/gm,
      (match, group) => `<Text style={styles.italic}>($group)</Text>`
    );
}

export const LessonCard = ({
  lesson,
  hapticSchedule,
}: {
  lesson: Lesson;
  hapticSchedule: (lsnId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [difficulty, displayMnemonic] = lesson.mnemonic.split("→");

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => {
          setIsExpanded(!isExpanded);
          hapticSchedule(lesson.id);
        }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Lesson</Text>
          <Text style={styles.difficulty}>{difficulty.trim()}</Text>
        </View>
        <Text style={styles.mnemonic}>{displayMnemonic.trim()}</Text>
      </Pressable>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.body}>{lesson.title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
    padding: 16,
    shadowColor: colors.obsidian,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  difficulty: {
    color: colors.primary,
    fontSize: 16,
  },
  expandedContent: {
    marginTop: 8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  italic: {
    fontStyle: "italic",
  },
  mnemonic: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
});

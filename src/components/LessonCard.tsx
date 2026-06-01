"use client";

import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "react-native";
import { Card } from "@/components/ui";

interface Lesson {
  grammar: string;
  logic: string;
  communication: string;
  mnemonic: string;
}

export function LessonCard({
  lesson,
  difficulty,
}: {
  lesson: Lesson;
  difficulty: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const mnemonicParts = lesson.mnemonic.split("**→**");
  const displayMnemonic = mnemonicParts[1] || lesson.mnemonic;

  const styles = StyleSheet.create({
    bold: {
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#3B82F6",
      borderRadius: 4,
      marginTop: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 12,
    },
    card: {
      borderColor: "#4B5563",
      borderRadius: 8,
      borderWidth: 1,
      elevation: 5,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    container: {
      gap: 8,
    },
    divider: {
      borderBottomWidth: 1,
      marginVertical: 8,
    },
    italic: {
      fontStyle: "italic",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Lesson ({difficulty})</Text>
      <Text style={styles.italic}>"{displayMnemonic}"</Text>

      <View style={styles.divider} />

      <View style={styles.container}>
        <View>
          <Text style={styles.bold}>Grammar:</Text>
          <Text>{lesson.grammar}</Text>
        </View>

        <View>
          <Text style={styles.bold}>Logic:</Text>
          <Text>{lesson.logic}</Text>
        </View>

        {expanded && (
          <View>
            <Text style={styles.bold}>Communication:</Text>
            <Text>{lesson.communication}</Text>

            <View style={styles.divider} />

            <Text style={styles.bold}>Memory Palace:</Text>
            <Text>{lesson.mnemonic.replace(/\\n/g, "\n")}</Text>
          </View>
        )}
      </View>

      <Pressable onPress={() => setExpanded(!expanded)} style={styles.button}>
        <Text style={styles.buttonText}>
          {expanded ? "Collapse" : "Expand"}
        </Text>
      </Pressable>
    </View>
  );
}

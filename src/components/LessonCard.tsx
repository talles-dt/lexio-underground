import { useState } from "react";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "@/theme/tokens";

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
    body: {
      color: colors.ivory,
    },
    bold: {
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#3b82f6",
      borderRadius: 4,
      marginTop: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    buttonText: {
      color: colors.ivory,
      fontSize: 12,
    },
    card: {
      borderColor: "#4b5563",
      borderRadius: 8,
      borderWidth: 1,
      elevation: 5,
      overflow: "hidden",
      padding: 16,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    container: {
      gap: 8,
    },
    divider: {
      borderBottomColor: colors.zinc,
      borderBottomWidth: 1,
      marginVertical: 8,
    },
    italic: {
      fontStyle: "italic",
    },
    title: {
      color: colors.ivory,
      fontSize: 20,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Lesson ({difficulty})</Text>
      <Text style={[styles.italic, styles.body]}>"{displayMnemonic}"</Text>

      <View style={styles.divider} />

      <View style={styles.container}>
        <View>
          <Text style={[styles.bold, styles.body]}>Grammar:</Text>
          <Text style={styles.body}>{lesson.grammar}</Text>
        </View>

        <View>
          <Text style={[styles.bold, styles.body]}>Logic:</Text>
          <Text style={styles.body}>{lesson.logic}</Text>
        </View>

        {expanded && (
          <View>
            <Text style={[styles.bold, styles.body]}>Communication:</Text>
            <Text style={styles.body}>{lesson.communication}</Text>

            <View style={styles.divider} />

            <Text style={[styles.bold, styles.body]}>Memory Palace:</Text>
            <Text style={styles.body}>
              {lesson.mnemonic.replace(/\n/g, "\n")}
            </Text>
          </View>
        )}

        <Pressable onPress={() => setExpanded(!expanded)} style={styles.button}>
          <Text style={styles.buttonText}>
            {expanded ? "Collapse" : "Expand"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

"use client";

// src/components/DiagnosticQuiz.tsx
// React Native version of the diagnostic quiz with Lexio DNA
// Enhanced to match stitch brief specifications for Cartografa Test (Grammar stage)
import React, { useState } from "react";
import { Text, StyleSheet, TextInput, Pressable, View } from "react-native";
import { colors, typography, spacing, radius } from "@/theme/tokens";
import * as Clipboard from "expo-clipboard";

type Question = {
  id: string;
  text: string;
  whyExplanation: string; // For the expandable "Why?" section
};

type DiagnosticQuizProps = {
  email: string;
  interest: string; // Memory palace hook - passed from email capture, read-only here
  onShareToken: (token: string) => void;
};

export function DiagnosticQuiz({
  email,
  interest,
  onShareToken,
}: DiagnosticQuizProps) {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [shareLink, setShareLink] = React.useState<string>("");
  const [expandedWhy, setExpandedWhy] = React.useState<string | null>(null); // Track which question's "Why?" is expanded
  const [activeQuestion, setActiveQuestion] = React.useState<string | null>(
    null,
  ); // Track which option is currently tapped

  // Updated questions with explicit Lexio DNA:
  // 1. Grammar: Acceptability judgments + self-explanation (why it sounds strange)
  // 2. Logic: Map of Ignorance - revisiting "known" ideas to check understanding
  // 3. Communication: Prioritizing being understood over perfect fluency
  const questions: Question[] = [
    {
      id: "grammar_1",
      text: "Quando encontrar uma construção linguística que soa estranha, você tenta entender POR QUE ela soa assim?",
      whyExplanation:
        'Esta pergunta avalia sua intuição gramatical - a capacidade de detectar construções que "soam erradas" mesmo sem saber a regra específica. Linguistas nativos desenvolvem essa intuição através de exposição massiva à linguagem.',
    },
    {
      id: "logic_1",
      text: "Você costuma revisitar ideias que acreditava estar dominadas para verificar se realmente as compreende?",
      whyExplanation:
        'Esta pergunta identifica seu "Mapa da Ignorância" - lacunas disfarçadas de conhecimento. Pessoas com alta metacognição revisitam continuamente o que acreditam saber para descobrir falsas certezas.',
    },
    {
      id: "communication_1",
      text: "Ao se expressar em situações reais, você prioriza fazer-se entender sobre falar perfeitamente?",
      whyExplanation:
        "Esta pergunta mede sua fluência comunicativa - valorizar ser compreendido sobre a perfeição formal. Aprendizes eficazes priorizam a comunicação real sobre a correção artificial em contextos autênticos.",
    },
  ];

  const handleSubmit = async () => {
    // Basic validation
    if (!email || !interest) {
      alert("Please fill in all fields");
      return;
    }
    // Check if all questions answered
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert("Please answer all questions");
      return;
    }

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          answers,
          interest,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareLink(
          `https://liceu.underground/diagnostico/${data.share_token}`,
        );
        setSubmitted(true);
        onShareToken(data.share_token);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  const handleSkip = () => {
    // For MVP, treat skip as submitting empty answers
    // In full Cartografa, this would navigate differently or use adaptive logic
    alert("Funcionalidade de pular ainda não implementada na versão MVP");
  };

  if (submitted) {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultContent}>
          <View style={styles.resultHeader}>
            <View style={styles.logoMark}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: colors.phosphor,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={styles.resultTitle}>Obrigado!</Text>
          </View>
          <Text style={styles.resultSubtitle}>Compartilhe seu resultado:</Text>
          <View style={styles.shareInputContainer}>
            <View style={styles.shareInput}>
              <Text style={styles.shareLink}>{shareLink}</Text>
            </View>
            <Pressable
              style={styles.copyButton}
              onPress={() => {
                Clipboard.setStringAsync(shareLink);
                // TODO: Show toast using duration.instant or duration.fast
              }}
            >
              <Text style={styles.copyButtonText}>Copiar link</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stage indicator - Top: 'Stage 1 of 5 — Grammar' in JetBrains Mono zinc */}
      <View style={styles.stageIndicator}>
        <Text style={styles.stageText}>Stage 1 of 5 — Grammar</Text>
      </View>

      {/* Memory Palace Hook - Read-only input */}
      <Text style={styles.title}>Memory Palace Hook</Text>
      <Text style={styles.subtitle}>(e.g., "minha casa", "cachorro"):</Text>
      <TextInput
        style={styles.input}
        value={interest}
        editable={false}
        placeholderTextColor={colors.zinc}
      />

      {/* Question card - Center: question card (obsidian, zinc border) */}
      <View style={styles.questionCard}>
        {questions.map((q) => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{q.text}</Text>
            {[1, 2, 3, 4, 5].map((val) => (
              <View
                key={val}
                style={[
                  styles.optionRow,
                  activeQuestion === `${q.id}-${val}` && styles.optionRowActive, // Highlight when tapped
                ]}
              >
                <Pressable
                  style={[
                    styles.radioButton,
                    answers[q.id] === val ? styles.radioButtonSelected : null,
                  ]}
                  onPressIn={() => setActiveQuestion(`${q.id}-${val}`)} // Start highlight on press
                  onPressOut={() => setActiveQuestion(null)} // End highlight when released
                  onPress={() => {
                    setAnswers((prev) => ({ ...prev, [q.id]: val }));
                    setActiveQuestion(null); // Remove highlight after selection
                  }}
                >
                  <View style={styles.radioInner} />
                </Pressable>
                <Text style={styles.optionText}>{val}</Text>
              </View>
            ))}
            {/* Expandable "Why?" section in amber italic */}
            {expandedWhy === q.id && (
              <View style={styles.whyContainer}>
                <Text style={styles.whyText}>{q.whyExplanation}</Text>
              </View>
            )}
            <Pressable
              style={styles.whyButton}
              onPress={() => {
                setExpandedWhy(expandedWhy === q.id ? null : q.id); // Toggle expansion
              }}
            >
              <Text style={styles.whyToggleText}>
                {expandedWhy === q.id ? "Ocultar explicação" : "Por quê?"}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* Skip button - Bottom: 'Skip' in zinc */}
      <View style={styles.skipContainer}>
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Pular</Text>
        </Pressable>
      </View>

      {/* Submit button */}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.phosphor,
    marginTop: spacing[4],
    paddingVertical: spacing[3],
  },
  buttonText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: "600" as const,
  },
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
    padding: spacing[4],
  },
  copyButton: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  copyButtonText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: "600" as const,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSubtle,
    borderRadius: radius.btn,
    borderWidth: 1,
    color: colors.ivory,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    ...typography.ui,
    marginBottom: spacing[4],
  },
  logoMark: {
    marginRight: spacing[2],
  },
  optionRow: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: spacing[1],
    // Base styling - active state will overlay
  },
  optionRowActive: {
    // Temporary highlight style when tapped
    backgroundColor: colors.phosphorFixedDim, // surface-tint from stitch (dimmed phosphor)
    borderRadius: radius.btn,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    marginHorizontal: -spacing[2], // Compensate for padding
    marginVertical: -spacing[1], // Compensate for padding
  },
  optionText: {
    ...typography.ui,
    color: colors.ivory,
  },
  questionCard: {
    backgroundColor: colors.obsidian,
    borderColor: colors.zinc,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: spacing[4],
    padding: spacing[4],
  },
  questionContainer: {
    marginVertical: spacing[3],
  },
  questionText: {
    ...typography.ui,
    color: colors.ivory,
    marginBottom: spacing[1],
  },
  radioButton: {
    borderColor: colors.zinc,
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    marginRight: spacing[2],
    width: 18,
  },
  radioButtonSelected: {
    borderColor: colors.phosphor,
  },
  radioInner: {
    backgroundColor: colors.phosphor,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  resultContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing[4],
  },
  resultContent: {
    maxWidth: 340,
    width: "100%",
  },
  resultHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing[4],
  },
  resultSubtitle: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  resultTitle: {
    ...typography.display,
    color: colors.ivory,
  },
  shareInput: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.borderSubtle,
    borderRadius: radius.btn,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  shareInputContainer: {
    marginVertical: spacing[3],
  },
  shareLink: {
    ...typography.ui,
    color: colors.ivory,
    flexShrink: 1,
  },
  skipButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  skipContainer: {
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
    marginTop: spacing[6],
    paddingTop: spacing[4],
  },
  skipText: {
    ...typography.ui,
    color: colors.zinc,
  },
  stageIndicator: {
    paddingVertical: spacing[2],
  },
  stageText: {
    ...typography.ui,
    color: colors.zinc,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[6],
    textAlign: "center",
  },
  title: {
    ...typography.display,
    color: colors.ivory,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  whyButton: {
    alignItems: "center",
    borderColor: colors.zinc,
    borderRadius: radius.btn,
    borderWidth: 1,
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  whyContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.btn,
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  whyText: {
    ...typography.bodyItalic,
    color: colors.amber,
    lineHeight: 22,
  },
  whyToggleText: {
    ...typography.ui,
    color: colors.ivory,
  },
});

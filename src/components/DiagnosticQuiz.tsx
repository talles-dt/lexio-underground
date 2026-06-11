"use client";

import React, { useState } from "react";
import { Text, StyleSheet, TextInput, Pressable, View } from "react-native";
import { colors, typography, spacing, radius } from "@/theme/tokens";
import * as Clipboard from "expo-clipboard";

type Question = {
  id: string;
  text: string;
  whyExplanation: string;
};

type DiagnosticQuizProps = {
  email: string;
  interest: string;
  onShareToken: (token: string) => void;
};

export function DiagnosticQuiz({
  email,
  interest,
  onShareToken,
}: DiagnosticQuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [expandedWhy, setExpandedWhy] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

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
    if (!email || !interest) {
      alert("Please fill in all fields");
      return;
    }
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert("Please answer all questions");
      return;
    }

    try {
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers, interest }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareLink(
          `https://liceu.underground/diagnostico/${data.share_token}`
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
                  width: 40,
                  height: 40,
                  backgroundColor: colors.lime,
                  borderRadius: radius.full,
                }}
              />
            </View>
          </View>
          <Text style={styles.resultTitle}>Obrigado!</Text>
          <Text style={styles.resultSubtitle}>
            Seu diagnóstico foi concluído e seu link exclusivo foi gerado.
          </Text>
          <View style={styles.shareLinkContainer}>
            <TextInput
              style={styles.shareLinkInput}
              value={shareLink}
              editable={false}
            />
            <Pressable
              style={styles.copyButton}
              onPress={() => Clipboard.setStringAsync(shareLink)}
            >
              <Text style={styles.copyButtonText}>Copiar</Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.newQuizButton}
            onPress={() => setSubmitted(false)}
          >
            <Text style={styles.newQuizButtonText}>Fazer novo diagnóstico</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnóstico Lexio</Text>
      <Text style={styles.subtitle}>Descubra seus pilares de aprendizado</Text>
      <Text style={styles.email}>Para: {email}</Text>

      {questions.map((question) => (
        <View key={question.id} style={styles.questionCard}>
          <Text style={styles.questionText}>{question.text}</Text>

          {/* Multiple choice answers */}
          <View style={styles.answerOptions}>
            {["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"].map(
              (option, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.answerOption,
                    answers[question.id] === index &&
                      styles.answerOptionSelected,
                  ]}
                  onPress={() => {
                    setAnswers({ ...answers, [question.id]: index });
                  }}
                  onPressIn={() => setActiveQuestion(question.id)}
                  onPressOut={() => setActiveQuestion(null)}
                >
                  <Text
                    style={[
                      styles.answerText,
                      answers[question.id] === index &&
                        styles.answerTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          {/* Why explanation */}
          <Pressable
            style={styles.whyButton}
            onPress={() => {
              expandedWhy === question.id
                ? setExpandedWhy(null)
                : setExpandedWhy(question.id);
            }}
          >
            <Text style={styles.whyButtonText}>Por quê?</Text>
          </Pressable>

          {expandedWhy === question.id && (
            <View style={styles.whyExplanation}>
              <Text style={styles.whyExplanationText}>
                {question.whyExplanation}
              </Text>
            </View>
          )}
        </View>
      ))}

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar</Text>
      </Pressable>

      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Pular diagnóstico</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  answerOption: {
    backgroundColor: colors.ivory,
    borderColor: colors.zinc,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
    padding: spacing.sm,
  },
  answerOptionSelected: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
  },
  answerOptions: {
    marginBottom: spacing.sm,
  },
  answerText: {
    color: colors.obsidian,
    fontSize: typography.text.md,
  },
  answerTextSelected: {
    color: colors.ivory,
  },
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
    padding: spacing.md,
  },
  copyButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.sm,
    marginLeft: spacing.sm,
    padding: spacing.sm,
  },
  copyButtonText: {
    color: colors.ivory,
    fontSize: typography.text.sm,
  },
  email: {
    color: colors.zinc,
    fontSize: typography.text.md,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  logoMark: {
    marginBottom: spacing.sm,
  },
  newQuizButton: {
    alignItems: "center",
  },
  newQuizButtonText: {
    color: colors.violet,
    fontSize: typography.text.sm,
    textDecorationLine: "underline",
  },
  questionCard: {
    backgroundColor: colors.ivory,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  questionText: {
    color: colors.obsidian,
    fontSize: typography.text.md,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  resultContainer: {
    backgroundColor: colors.obsidian,
    flex: 1,
    padding: spacing.md,
  },
  resultContent: {
    backgroundColor: colors.ivory,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  resultSubtitle: {
    color: colors.grayDark,
    fontSize: typography.text.md,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  resultTitle: {
    color: colors.obsidian,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  shareLinkContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  shareLinkInput: {
    borderColor: colors.zinc,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.grayDark,
    flex: 1,
    fontSize: typography.text.sm,
    padding: spacing.sm,
  },
  skipButton: {
    alignItems: "center",
    marginTop: spacing.sm,
  },
  skipButtonText: {
    color: colors.zinc,
    fontSize: typography.text.sm,
    textDecorationLine: "underline",
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  submitButtonText: {
    color: colors.ivory,
    fontSize: typography.text.md,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.zinc,
    fontSize: typography.text.lg,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  title: {
    color: colors.ivory,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  whyButton: {
    alignSelf: "flex-end",
  },
  whyButtonText: {
    color: colors.violet,
    fontSize: typography.text.sm,
  },
  whyExplanation: {
    backgroundColor: colors.grayLightest,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  whyExplanationText: {
    color: colors.obsidian,
    fontSize: typography.text.sm,
    lineHeight: typography.text.lg,
  },
});

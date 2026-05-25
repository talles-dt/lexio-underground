// app/diagnostico.tsx
import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useState } from "react";

import { OnboardingPreamble } from "@/components/onboarding/Preamble";
import { EmailCapture } from "@/components/onboarding/EmailCapture";
import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";
import { colors, typography, spacing, radius } from "@/theme/tokens";

export default function DiagnosticoScreen() {
  const [step, setStep] = useState<"preamble" | "email" | "quiz" | "result">(
    "preamble",
  );
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [shareLink, setShareLink] = useState("");

  const handleBeginCartografa = () => setStep("email");
  const handleSubmitEmail = (email: string, interest: string) => {
    setEmail(email);
    setInterest(interest);
    setStep("quiz");
  };
  const handleQuizComplete = (shareToken: string) => {
    setShareLink(`https://liceu.underground/diagnostico/${shareToken}`);
    setStep("result");
  };

  let content = null;
  if (step === "preamble") {
    content = <OnboardingPreamble onBeginCartografa={handleBeginCartografa} />;
  } else if (step === "email") {
    content = <EmailCapture onSubmit={handleSubmitEmail} />;
  } else if (step === "quiz") {
    content = (
      <DiagnosticQuiz
        email={email}
        interest={interest}
        onShareToken={handleQuizComplete}
      />
    );
  } else if (step === "result") {
    content = (
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
            <View style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copiar link</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
  },
  copyButton: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  copyButtonText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: "600" as const,
  },
  logoMark: {
    marginRight: spacing[2],
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
    marginBottom: spacing[3],
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
    marginVertical: spacing[4],
  },
  shareLink: {
    ...typography.ui,
    color: colors.ivory,
    flexShrink: 1,
  },
});

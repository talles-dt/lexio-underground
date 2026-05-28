"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { colors, spacing } from "@/theme/tokens";

const Preamble = dynamic(
  () => import("@/components/onboarding/Preamble").then((m) => ({
    default: m.OnboardingPreamble || m.Preamble,
  })),
  { ssr: false }
);

const EmailCapture = dynamic(
  () => import("@/components/onboarding/EmailCapture").then((m) => ({
    default: m.EmailCapture,
  })),
  { ssr: false }
);

const DiagnosticQuiz = dynamic(
  () => import("@/components/DiagnosticQuiz").then((m) => ({
    default: m.DiagnosticQuiz,
  })),
  { ssr: false, loading: () => <p style={{ color: colors.zinc, padding: 40, textAlign: "center" }}>Loading quiz...</p> }
);

export default function DiagnosticoPage() {
  const [step, setStep] = useState<"preamble" | "email" | "quiz">("preamble");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${spacing[4]}px`,
  };

  if (step === "preamble") {
    return (
      <div style={containerStyle}>
        <Preamble onPress={() => setStep("email")} />
      </div>
    );
  }

  if (step === "email") {
    return (
      <div style={containerStyle}>
        <EmailCapture
          onSubmit={(e: string, i: string) => {
            setEmail(e);
            setInterest(i);
            setStep("quiz");
          }}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <DiagnosticQuiz
        email={email}
        interest={interest}
        onShareToken={(token: string) => {
          window.location.href = `/diagnostico/${token}`;
        }}
      />
    </div>
  );
}

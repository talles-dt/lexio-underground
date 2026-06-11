"use client";

import React from "react";
import { Button } from "@/components/ui";
import { colors, typography, spacing, radius } from "@/theme/tokens";

interface PreambleProps {
 onPress: () => void;
 onBeginCartografa?: () => void;
}

const styles: Record<string, React.CSSProperties> = {
 button: {
 backgroundColor: colors.phosphor,
 borderRadius: radius.btn,
 paddingLeft: spacing[8],
 paddingRight: spacing[8],
 paddingTop: spacing[6],
 paddingBottom: spacing[6],
 border: "none",
 cursor: "pointer",
 },
 buttonText: {
 color: colors.ivory,
 fontSize: typography.ui.fontSize,
 textAlign: "center" as const,
 },
 container: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 padding: spacing[8],
 },
 subtitle: {
 color: colors.secondary,
 fontSize: typography.h2.fontSize,
 marginBottom: spacing[16],
 textAlign: "center" as const,
 },
 title: {
 color: colors.phosphor,
 fontSize: typography.h1.fontSize,
 fontWeight: "bold",
 marginBottom: spacing[4],
 },
};

export const OnboardingPreamble = ({ onPress }: PreambleProps) => {
 return (
 <div style={styles.container}>
 <span style={styles.title}>Lexio Underground</span>
 <p style={styles.subtitle}>
 Map your ignorance. Master your language.
 </p>
 <button type="button" style={styles.button} onClick={onPress}>
 <span style={styles.buttonText}>Begin your Cartografa</span>
 </button>
 </div>
 );
};

export const Preamble = OnboardingPreamble; // backward compatibility

export default OnboardingPreamble;

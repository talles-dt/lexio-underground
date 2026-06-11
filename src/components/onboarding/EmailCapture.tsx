"use client";

import React from "react";
import { colors, typography, spacing } from "@/theme/tokens";

interface EmailCaptureProps {
 onSubmit: (email: string, interest: string) => void;
}

const EmailCapture = ({ onSubmit }: EmailCaptureProps) => {
 const [email, setEmail] = React.useState("");
 const [interest, setInterest] = React.useState("");

 const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
 const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => setInterest(e.target.value);

 const handleSubmit = () => {
 if (email.trim() && interest.trim()) {
 onSubmit(email.trim(), interest.trim());
 }
 };

 return (
 <div style={styles.container}>
 <span style={styles.heading}>Enter your email to begin</span>
 <p style={styles.subtext}>
 We&apos;ll send your Cartografa report and learning path to this
 address.
 </p>
 <input
 placeholder="your@email.com"
 value={email}
 onChange={handleEmailChange}
 autoComplete="off"
 style={{ ...styles.inputField, ...styles.input }}
 />
 <span style={styles.interestLabel}>
 Memory Palace Hook (e.g., &ldquo;minha casa&rdquo;,
 &ldquo;cachorro&rdquo;):
 </span>
 <input
 placeholder="Where do you want to anchor this lesson?"
 value={interest}
 onChange={handleInterestChange}
 style={styles.input}
 />
 <button type="button" onClick={handleSubmit} style={styles.button}>
 <span style={styles.buttonText}>Continue to Cartografa →</span>
 </button>
 </div>
 );
};

const styles: Record<string, React.CSSProperties> = {
 button: {
 backgroundColor: colors.phosphor,
 borderRadius: 30,
 marginTop: spacing[6],
 paddingLeft: 28,
 paddingRight: 28,
 paddingTop: 14,
 paddingBottom: 14,
 width: "85%",
 border: "none",
 cursor: "pointer",
 },
 buttonText: {
 ...typography.ui,
 color: colors.obsidian,
 fontWeight: 600 as const,
 textAlign: "center" as const,
 },
 container: {
 display: "flex",
 alignItems: "center",
 backgroundColor: colors.obsidian,
 justifyContent: "center",
 paddingLeft: spacing[4],
 paddingRight: spacing[4],
 },
 heading: {
 ...typography.display,
 color: colors.ivory,
 marginBottom: spacing[2],
 textAlign: "center" as const,
 display: "block",
 },
 input: {
 marginTop: spacing[2],
 marginBottom: spacing[2],
 width: "85%",
 },
 inputField: {
 color: colors.ivory,
 },
 interestLabel: {
 ...typography.ui,
 alignSelf: "flex-start",
 color: colors.ivory,
 marginBottom: spacing[1],
 marginTop: spacing[4],
 },
 subtext: {
 ...typography.body,
 color: colors.zinc,
 marginBottom: spacing[6],
 maxWidth: 300,
 textAlign: "center" as const,
 margin: 0,
 },
};

export default EmailCapture;

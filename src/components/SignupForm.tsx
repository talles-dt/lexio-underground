"use client";

import { useState } from "react";
import React from "react";
import { colors, spacing, radius } from "@/theme/tokens";

interface SignupFormProps {
 email: string;
 onSignup: (email: string, password: string, name: string) => Promise<void>;
 onGoogleLogin: () => Promise<void>;
 onSkip: () => void;
 error?: string;
 loading?: boolean;
}

export default function SignupForm({
 email: initialEmail,
 onSignup,
 onGoogleLogin,
 onSkip,
 error: externalError,
 loading: externalLoading,
}: SignupFormProps) {
 const [email, setEmail] = useState(initialEmail);
 const [name, setName] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [consent, setConsent] = useState(false);
 const [localError, setLocalError] = useState("");
 const [localLoading, setLocalLoading] = useState(false);

 const error = externalError || localError;
 const loading = externalLoading || localLoading;

 const handleSubmit = async () => {
 setLocalError("");

 if (!name.trim()) {
 setLocalError("Por favor, informe seu nome.");
 return;
 }
 if (password.length < 6) {
 setLocalError("A senha deve ter pelo menos 6 caracteres.");
 return;
 }
 if (password !== confirmPassword) {
 setLocalError("As senhas não coincidem.");
 return;
 }
 if (!consent) {
 setLocalError("Você deve concordar com os Termos.");
 return;
 }

 setLocalLoading(true);
 try {
 await onSignup(email, password, name);
 } catch (err) {
 setLocalError("Erro ao criar conta. Tente novamente.");
 } finally {
 setLocalLoading(false);
 }
 };

 return (
 <div style={styles.container}>
 <div style={styles.innerContainer}>
 <span style={styles.title}>Crie sua conta</span>
 <p style={styles.description}>
 Para continuar com o diagnóstico, crie sua conta
 </p>

 {error && <p style={styles.error}>{error}</p>}

 <div style={styles.form}>
 <div style={styles.inputGroup}>
 <label style={styles.label}>Nome</label>
 <input
 style={styles.input}
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Digite seu nome"
 />
 </div>

 <div style={styles.inputGroup}>
 <label style={styles.label}>Email</label>
 <input
 style={styles.input}
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="email@exemplo.com"
 autoComplete="off"
 />
 </div>

 <div style={styles.inputGroup}>
 <label style={styles.label}>Senha</label>
 <input
 style={styles.input}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••"
 type="password"
 />
 </div>

 <div style={styles.inputGroup}>
 <label style={styles.label}>Confirmar senha</label>
 <input
 style={styles.input}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 placeholder="••••••"
 type="password"
 />
 </div>

 <div style={styles.consentRow} onClick={() => setConsent(!consent)}>
 <div
 style={{
 ...styles.checkbox,
 ...(consent ? styles.checkboxChecked : {}),
 }}
 />
 <span style={styles.consentText}>
 Concordo com os Termos de Serviço
 </span>
 </div>

 <button
 type="button"
 style={{
 ...styles.submitButton,
 ...(loading ? { opacity: 0.5 } : {}),
 }}
 onClick={handleSubmit}
 disabled={loading}
 >
 <span style={styles.submitButtonText}>Criar conta</span>
 </button>

 <p style={styles.orText}>Ou continue com</p>

 <button
 type="button"
 style={{
 ...styles.googleButton,
 ...(loading ? { opacity: 0.5 } : {}),
 }}
 onClick={onGoogleLogin}
 disabled={loading}
 >
 <div style={styles.googleIconBackground}>
 <span style={styles.googleIcon}>G</span>
 </div>
 <span style={styles.googleButtonText}>Google</span>
 </button>

 <button
 type="button"
 style={{
 ...styles.skipButton,
 ...(loading ? { opacity: 0.5 } : {}),
 }}
 onClick={onSkip}
 disabled={loading}
 >
 <span style={styles.skipButtonText}>Ignorar cadastro</span>
 </button>
 </div>
 </div>
 </div>
 );
}

const styles: Record<string, React.CSSProperties> = {
 checkbox: {
 borderColor: colors.zinc,
 borderRadius: radius.sm,
 borderWidth: 1,
 borderStyle: "solid",
 height: 20,
 marginRight: spacing.sm,
 width: 20,
 flexShrink: 0,
 },
 checkboxChecked: {
 backgroundColor: colors.amber,
 borderColor: colors.amber,
 },
 consentRow: {
 display: "flex",
 alignItems: "center",
 marginBottom: spacing.md,
 cursor: "pointer",
 },
 consentText: {
 color: colors.grayDark,
 fontSize: 14,
 },
 container: {
 backgroundColor: colors.obsidian,
 padding: spacing.md,
 },
 description: {
 color: colors.grayDark,
 fontSize: 16,
 marginBottom: spacing.md,
 textAlign: "center" as const,
 margin: 0,
 },
 error: {
 color: colors.red,
 marginBottom: spacing.md,
 textAlign: "center" as const,
 margin: 0,
 },
 form: {
 marginTop: spacing.md,
 },
 googleButton: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 borderColor: colors.zinc,
 borderRadius: radius.md,
 borderWidth: 1,
 borderStyle: "solid",
 marginBottom: spacing.sm,
 padding: spacing.sm,
 background: "none",
 cursor: "pointer",
 },
 googleButtonText: {
 color: colors.obsidian,
 fontSize: 16,
 },
 googleIcon: {
 color: colors.red,
 fontSize: 16,
 fontWeight: "bold",
 },
 googleIconBackground: {
 backgroundColor: colors.ivory,
 borderRadius: radius.sm,
 marginRight: spacing.sm,
 padding: spacing.xs,
 },
 innerContainer: {
 backgroundColor: colors.ivory,
 borderRadius: radius.md,
 margin: "auto",
 maxWidth: 500,
 padding: spacing.lg,
 },
 input: {
 borderColor: colors.zinc,
 borderRadius: radius.sm,
 borderWidth: 1,
 borderStyle: "solid",
 fontSize: 16,
 padding: spacing.sm,
 width: "100%",
 boxSizing: "border-box" as const,
 },
 inputGroup: {
 marginBottom: spacing.md,
 },
 label: {
 color: colors.obsidian,
 fontSize: 16,
 marginBottom: spacing.xs,
 display: "block",
 },
 orText: {
 color: colors.grayDark,
 marginBottom: spacing.md,
 textAlign: "center" as const,
 margin: 0,
 },
 skipButton: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 padding: spacing.sm,
 background: "none",
 border: "none",
 cursor: "pointer",
 },
 skipButtonText: {
 color: colors.grayDark,
 textDecoration: "underline",
 },
 submitButton: {
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 backgroundColor: colors.amber,
 borderRadius: radius.md,
 marginBottom: spacing.md,
 padding: spacing.md,
 border: "none",
 cursor: "pointer",
 },
 submitButtonText: {
 color: colors.ivory,
 fontSize: 16,
 fontWeight: "bold",
 },
 title: {
 color: colors.obsidian,
 fontSize: 28,
 fontWeight: "bold",
 marginBottom: spacing.sm,
 textAlign: "center" as const,
 display: "block",
 },
};

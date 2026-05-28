"use client";

import { useState } from "react";
import { colors, spacing, radius } from "@/theme/tokens";

interface SignupFormProps {
  email: string; // pre-filled from Cartografa
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setLocalError("Você precisa aceitar os termos para continuar.");
      return;
    }

    setLocalLoading(true);
    await onSignup(email, password, name);
    setLocalLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: colors.surface,
    color: colors.ivory,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    fontSize: 15,
    outline: "none",
    marginBottom: spacing[3],
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    color: colors.zinc,
    marginBottom: spacing[1],
  };

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 24px",
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
    border: "none",
    borderRadius: radius.btn,
    fontSize: 15,
    fontWeight: 600,
    cursor: loading ? "wait" : "pointer",
    opacity: loading ? 0.7 : 1,
    marginBottom: spacing[3],
  };

  const googleBtnStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 24px",
    backgroundColor: colors.surface,
    color: colors.ivory,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.btn,
    fontSize: 15,
    fontWeight: 500,
    cursor: loading ? "wait" : "pointer",
    opacity: loading ? 0.7 : 1,
    marginBottom: spacing[3],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  return (
    <div
      style={{
        maxWidth: 400,
        width: "100%",
        textAlign: "center" as const,
      }}
    >
      {/* Header */}
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: colors.ivory,
          marginBottom: spacing[1],
        }}
      >
        Você está dentro.
      </h2>
      <p
        style={{
          fontSize: 15,
          color: colors.zinc,
          marginBottom: spacing[4],
          fontStyle: "italic",
        }}
      >
        Sua palace está esperando.
      </p>

      {/* Google OAuth */}
      <button
        onClick={onGoogleLogin}
        disabled={loading}
        style={googleBtnStyle}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        Continuar com Google
      </button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: spacing[3],
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            backgroundColor: colors.borderSubtle,
          }}
        />
        <span style={{ fontSize: 12, color: colors.zinc }}>ou</span>
        <div
          style={{
            flex: 1,
            height: 1,
            backgroundColor: colors.borderSubtle,
          }}
        />
      </div>

      {/* Email/password form */}
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Nome</label>
        <input
          style={inputStyle}
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label style={labelStyle}>Senha</label>
        <input
          style={inputStyle}
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <label style={labelStyle}>Confirmar senha</label>
        <input
          style={inputStyle}
          type="password"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {/* LGPD Consent */}
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: spacing[3],
            cursor: "pointer",
            textAlign: "left" as const,
          }}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{
              marginTop: 2,
              width: 16,
              height: 16,
              accentColor: colors.phosphor,
            }}
          />
          <span style={{ fontSize: 12, color: colors.zinc, lineHeight: 1.4 }}>
            Eu aceito os{" "}
            <a
              href="#"
              style={{ color: colors.phosphor, textDecoration: "underline" }}
            >
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a
              href="#"
              style={{ color: colors.phosphor, textDecoration: "underline" }}
            >
              Política de Privacidade
            </a>
            . Entendo que meus dados serão usados para personalizar minha
            experiência de aprendizado (LGPD).
          </span>
        </label>

        {error && (
          <p
            style={{
              color: "#ef4444",
              fontSize: 13,
              marginBottom: spacing[3],
              textAlign: "center" as const,
            }}
          >
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      {/* Skip option */}
      <button
        onClick={onSkip}
        style={{
          background: "none",
          border: "none",
          color: colors.zinc,
          fontSize: 13,
          cursor: "pointer",
          padding: spacing[2],
        }}
      >
        Pular por agora →
      </button>
    </div>
  );
}

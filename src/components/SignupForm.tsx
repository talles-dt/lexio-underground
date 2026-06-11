"use client";

import { useState } from "react";
import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.description}>
          Para continuar com o diagnóstico, crie sua conta
        </Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemplo.com"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••"
              secureTextEntry
            />
          </View>

          <Pressable
            style={styles.consentRow}
            onPress={() => setConsent(!consent)}
          >
            <View
              style={[styles.checkbox, consent && styles.checkboxChecked]}
            />
            <Text style={styles.consentText}>
              Concordo com os Termos de Serviço
            </Text>
          </Pressable>

          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>Criar conta</Text>
          </Pressable>

          <Text style={styles.orText}>Ou continue com</Text>

          <Pressable
            style={styles.googleButton}
            onPress={onGoogleLogin}
            disabled={loading}
          >
            <View style={styles.googleIconBackground}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Google</Text>
          </Pressable>

          <Pressable
            style={styles.skipButton}
            onPress={onSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Ignorar cadastro</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    borderColor: colors.zinc,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 20,
    marginRight: spacing.sm,
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
  },
  consentRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  consentText: {
    color: colors.grayDark,
    fontSize: 14,
  },
  container: {
    backgroundColor: colors.obsidian,
    flex: 1,
    padding: spacing.md,
  },
  description: {
    color: colors.grayDark,
    fontSize: 16,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  error: {
    color: colors.red,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  form: {
    marginTop: spacing.md,
  },
  googleButton: {
    alignItems: "center",
    borderColor: colors.zinc,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.sm,
    padding: spacing.sm,
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
    fontSize: 16,
    padding: spacing.sm,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.obsidian,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  orText: {
    color: colors.grayDark,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  skipButton: {
    alignItems: "center",
    padding: spacing.sm,
  },
  skipButtonText: {
    color: colors.grayDark,
    textDecorationLine: "underline",
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.amber,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
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
    textAlign: "center",
  },
});

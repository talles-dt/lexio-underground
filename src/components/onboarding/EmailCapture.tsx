// src/components/onboarding/EmailCapture.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Input } from '@/components/ui';
import { colors, typography, spacing } from '@/theme/tokens';

export const EmailCapture = ({ onSubmit }: { onSubmit: (email: string, interest: string) => void }) => {
  const [email, setEmail] = React.useState('');
  const [interest, setInterest] = React.useState('');

  const handleSubmit = () => {
    if (email.trim() && interest.trim()) {
      onSubmit(email.trim(), interest.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter your email to begin</Text>
      <Text style={styles.subtext}>
        We'll send your Cartografa report and learning path to this address.
      </Text>
      <Input
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={colors.zinc}
        style={styles.input}
      />
      <Text style={styles.interestLabel}>Memory Palace Hook (e.g., "minha casa", "cachorro"):</Text>
      <Input
        placeholder="Where do you want to anchor this lesson?"
        value={interest}
        onChangeText={setInterest}
        placeholderTextColor={colors.zinc}
        style={styles.input}
      />
      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Continue to Cartografa →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  heading: {
    ...typography.headlineLG,
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtext: {
    ...typography.body,
    color: colors.zinc,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: spacing[6],
  },
  input: {
    width: '85%',
    marginVertical: spacing[2],
  },
  interestLabel: {
    ...typography.uiLabel,
    color: colors.ivory,
    marginTop: spacing[4],
    marginBottom: spacing[1],
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: colors.phosphor,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginTop: spacing[6],
    width: '85%',
  },
  buttonText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
});
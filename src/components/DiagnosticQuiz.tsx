// src/components/DiagnosticQuiz.tsx
// React Native version of the diagnostic quiz with Lexio DNA
import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Clipboard } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';

type Question = {
  id: string;
  text: string;
};

type DiagnosticQuizProps = {
  email: string;
  interest: string;  // Memory palace hook - passed from email capture, read-only here
  onShareToken: (token: string) => void;
};

export function DiagnosticQuiz({ email, interest, onShareToken }: DiagnosticQuizProps) {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [shareLink, setShareLink] = React.useState<string>('');

  // Updated questions with explicit Lexio DNA:
  // 1. Grammar: Acceptability judgments + self-explanation (why it sounds strange)
  // 2. Logic: Map of Ignorance - revisiting "known" ideas to check understanding
  // 3. Communication: Prioritizing being understood over perfect fluency
  const questions: Question[] = [
    { 
      id: 'grammar_1', 
      text: 'Quando encontrar uma construção linguística que soa estranha, você tenta entender POR QUE ela soa assim?' 
    },
    { 
      id: 'logic_1', 
      text: 'Você costuma revisitar ideias que acreditava estar dominadas para verificar se realmente as compreende?' 
    },
    { 
      id: 'communication_1', 
      text: 'Ao se expressar em situações reais, você prioriza fazer-se entender sobre falar perfeitamente?' 
    },
  ];

  const handleSubmit = async () => {
    // Basic validation
    if (!email || !interest) {
      alert('Please fill in all fields');
      return;
    }
    // Check if all questions answered
    const allAnswered = questions.every(q => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert('Please answer all questions');
      return;
    }

    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answers,
          interest,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setShareLink(`https://liceu.underground/diagnostico/${data.share_token}`);
        setSubmitted(true);
        onShareToken(data.share_token);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    }
  };

  if (submitted) {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultContent}>
          <View style={styles.resultHeader}>
            <View style={styles.logoMark}>
              <View style={{ width: 24, height: 24, backgroundColor: colors.phosphor, borderRadius: 4 }} />
            </View>
            <Text style={styles.resultTitle}>Obrigado!</Text>
          </View>
          <Text style={styles.resultSubtitle}>Compartilhe seu resultado:</Text>
          <View style={styles.shareInputContainer}>
            <View style={styles.shareInput}>
              <Text style={styles.shareLink}>{shareLink}</Text>
            </View>
            <View style={styles.copyButton} onPress={() => {
              // Copy to clipboard
              Clipboard.setString(shareLink);
              // TODO: Show toast
            }}>
              <Text style={styles.copyButtonText}>Copiar link</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Palace Hook</Text>
      <Text style={styles.subtitle}>
        (e.g., "minha casa", "cachorro"):
      </Text>
      <TextInput
        style={styles.input}
        value={interest}
        editable={false}
        placeholderTextColor={colors.zinc}
      />
      {questions.map((q) => (
        <View key={q.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.text}</Text>
          {[1, 2, 3, 4, 5].map((val) => (
            <View key={val} style={styles.optionRow}>
              <Pressable
                style={[
                  styles.radioButton,
                  answers[q.id] === val ? styles.radioButtonSelected : null,
                ]}
                onPress={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
              >
                <View style={styles.radioInner} />
              </Pressable>
              <Text style={styles.optionText}>{val}</Text>
            </View>
          ))}
        </View>
      ))}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    padding: spacing[4],
  },
  title: {
    ...typography.display,
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.body,
    color: colors.zinc,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.btn,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    color: colors.ivory,
    ...typography.ui,
    marginBottom: spacing[4],
  },
  questionContainer: {
    marginVertical: spacing[3],
  },
  questionText: {
    ...typography.ui,
    color: colors.ivory,
    marginBottom: spacing[1],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[1],
  },
  radioButton: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: colors.zinc,
    borderRadius: 9,
    marginRight: spacing[2],
  },
  radioButtonSelected: {
    borderColor: colors.phosphor,
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: colors.phosphor,
    borderRadius: 5,
  },
  optionText: {
    ...typography.ui,
    color: colors.ivory,
  },
  button: {
    backgroundColor: colors.phosphor,
    paddingVertical: spacing[3],
    alignItems: 'center',
    marginTop: spacing[4],
  },
  buttonText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: '600' as const,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  resultContent: {
    width: '100%',
    maxWidth: 340,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  logoMark: {
    marginRight: spacing[2],
  },
  resultTitle: {
    ...typography.display,
    color: colors.ivory,
  },
  resultSubtitle: {
    ...typography.body,
    color: colors.zinc,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  shareInputContainer: {
    marginVertical: spacing[3],
  },
  shareInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.btn,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareLink: {
    ...typography.ui,
    color: colors.ivory,
    flexShrink: 1,
  },
  copyButton: {
    backgroundColor: colors.phosphor,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.btn,
  },
  copyButtonText: {
    ...typography.ui,
    color: colors.obsidian,
    fontWeight: '600' as const,
  },
});
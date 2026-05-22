// src/components/DiagnosticQuiz.tsx
// React Native version of the diagnostic quiz with Lexio DNA
// Enhanced to match stitch brief specifications for Cartografa Test (Grammar stage)
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  Clipboard 
} from 'react-native';
import { colors, typography, spacing, radius, duration } from '@/theme/tokens';

type Question = {
  id: string;
  text: string;
  whyExplanation: string; // For the expandable "Why?" section
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
  const [expandedWhy, setExpandedWhy] = React.useState<string | null>(null); // Track which question's "Why?" is expanded
  const [activeQuestion, setActiveQuestion] = React.useState<string | null>(null); // Track which option is currently tapped

  // Updated questions with explicit Lexio DNA:
  // 1. Grammar: Acceptability judgments + self-explanation (why it sounds strange)
  // 2. Logic: Map of Ignorance - revisiting "known" ideas to check understanding
  // 3. Communication: Prioritizing being understood over perfect fluency
  const questions: Question[] = [
    { 
      id: 'grammar_1', 
      text: 'Quando encontrar uma construção linguística que soa estranha, você tenta entender POR QUE ela soa assim?',
      whyExplanation: 'Esta pergunta avalia sua intuição gramatical - a capacidade de detectar construções que "soam erradas" mesmo sem saber a regra específica. Linguistas nativos desenvolvem essa intuição através de exposição massiva à linguagem.'
    },
    { 
      id: 'logic_1', 
      text: 'Você costuma revisitar ideias que acreditava estar dominadas para verificar se realmente as compreende?',
      whyExplanation: 'Esta pergunta identifica seu "Mapa da Ignorância" - lacunas disfarçadas de conhecimento. Pessoas com alta metacognição revisitam continuamente o que acreditam saber para descobrir falsas certezas.'
    },
    { 
      id: 'communication_1', 
      text: 'Ao se expressar em situações reais, você prioriza fazer-se entender sobre falar perfeitamente?',
      whyExplanation: 'Esta pergunta mede sua fluência comunicativa - valorizar ser compreendido sobre a perfeição formal. Aprendizes eficazes priorizam a comunicação real sobre a correção artificial em contextos autênticos.'
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

  const handleSkip = () => {
    // For MVP, treat skip as submitting empty answers
    // In full Cartografa, this would navigate differently or use adaptive logic
    alert('Funcionalidade de pular ainda não implementada na versão MVP');
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
            <Pressable style={styles.copyButton} onPress={() => {
              // Copy to clipboard
              Clipboard.setString(shareLink);
              // TODO: Show toast using duration.instant or duration.fast
            }}>
              <Text style={styles.copyButtonText}>Copiar link</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stage indicator - Top: 'Stage 1 of 5 — Grammar' in JetBrains Mono zinc */}
      <View style={styles.stageIndicator}>
        <Text style={styles.stageText}>Stage 1 of 5 — Grammar</Text>
      </View>
      
      {/* Memory Palace Hook - Read-only input */}
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
      
      {/* Question card - Center: question card (obsidian, zinc border) */}
      <View style={styles.questionCard}>
        {questions.map((q) => (
          <View key={q.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>{q.text}</Text>
            {[1, 2, 3, 4, 5].map((val) => (
              <View key={val} style={[
                styles.optionRow,
                activeQuestion === `${q.id}-${val}` && styles.optionRowActive, // Highlight when tapped
              ]}>
                <Pressable
                  style={[
                    styles.radioButton,
                    answers[q.id] === val ? styles.radioButtonSelected : null,
                  ]}
                  onPressIn={() => setActiveQuestion(`${q.id}-${val}`)} // Start highlight on press
                  onPressOut={() => setActiveQuestion(null)} // End highlight when released
                  onPress={() => {
                    setAnswers(prev => ({ ...prev, [q.id]: val }));
                    setActiveQuestion(null); // Remove highlight after selection
                  }}
                >
                  <View style={styles.radioInner} />
                </Pressable>
                <Text style={styles.optionText}>{val}</Text>
              </View>
            ))}
            {/* Expandable "Why?" section in amber italic */}
            {expandedWhy === q.id && (
              <View style={styles.whyContainer}>
                <Text style={styles.whyText}>{q.whyExplanation}</Text>
              </View>
            )}
            <Pressable 
              style={styles.whyButton}
              onPress={() => {
                setExpandedWhy(expandedWhy === q.id ? null : q.id); // Toggle expansion
              }}
            >
              <Text style={styles.whyToggleText}>
                {expandedWhy === q.id ? 'Ocultar explicação' : 'Por quê?'}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
      
      {/* Skip button - Bottom: 'Skip' in zinc */}
      <View style={styles.skipContainer}>
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Pular</Text>
        </Pressable>
      </View>
      
      {/* Submit button */}
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
  stageIndicator: {
    paddingVertical: spacing[2],
  },
  stageText: {
    ...typography.ui,
    color: colors.zinc,
    textAlign: 'center',
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
  questionCard: {
    backgroundColor: colors.obsidian,
    borderWidth: 1,
    borderColor: colors.zinc,
    borderRadius: radius.card,
    padding: spacing[4],
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
    // Base styling - active state will overlay
  },
  optionRowActive: {
    // Temporary highlight style when tapped
    backgroundColor: colors.phosphorFixedDim, // surface-tint from stitch (dimmed phosphor)
    borderRadius: radius.btn,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    marginHorizontal: -spacing[2], // Compensate for padding
    marginVertical: -spacing[1],   // Compensate for padding
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
  whyContainer: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface,
    borderRadius: radius.btn,
  },
  whyText: {
    ...typography.bodyItalic,
    color: colors.amber,
    lineHeight: 22,
  },
  whyButton: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderColor: colors.zinc,
    borderRadius: radius.btn,
    alignItems: 'center',
  },
  whyToggleText: {
    ...typography.ui,
    color: colors.ivory,
  },
  skipContainer: {
    marginTop: spacing[6],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  skipButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  skipText: {
    ...typography.ui,
    color: colors.zinc,
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
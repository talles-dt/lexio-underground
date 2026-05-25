// app/lessons.tsx
'use client'

import { View, Text } from 'react-native';
import { LessonCard } from '../src/components/LessonCard';

const mockLesson = {
 grammar: "**Articles** → Zero article in 'I have 25 years' (PT-BR interference)",
 logic: "English omits age articles; Portuguese uses definite article",
 communication: "Example: 'She is **a** doctor' (indefinite), 'She goes to **the** hospital' (definite)",
 mnemonic: "CONCEPT: Articles → LOCATION: My house → HOOK: Golden retriever → ANCHOR: *meu cachorro*",
};

const LessonsScreen = () => (
 <View style={{ padding: 20 }}>
 <LessonCard lesson={mockLesson} difficulty="B2" />
 </View>
);

export default LessonsScreen;
// src/components/LessonCard.tsx
// Interactive lesson card with Tremor styling + memory palace integration

'use client';

import { Card, Title, Text, Divider } from '@/lib/tremor-web';
import { useState } from 'react';

interface Lesson {
 grammar: string;
 logic: string;
 communication: string;
 mnemonic: string;
}

export function LessonCard({ lesson, difficulty }: { lesson: Lesson; difficulty: string }) {
 const [expanded, setExpanded] = useState(false);

 return (
 <Card className="mx-auto max-w-md my-4">
 <Title className="text-tremor-brand">Lesson ({difficulty})</Title>
 <Text className="italic">"{lesson.mnemonic.split('**→**')[1]}"</Text>

 <Divider />

 <div className="space-y-4">
 <div>
 <Text className="font-bold">Grammar:</Text>
 <Text>{lesson.grammar}</Text>
 </div>

 <div>
 <Text className="font-bold">Logic:</Text>
 <Text>{lesson.logic}</Text>
 </div>

 {expanded && (
 <div>
 <Text className="font-bold">Communication:</Text>
 <Text>{lesson.communication}</Text>
 
 <Divider />
 
 <Text className="font-bold">Memory Palace:</Text>
 <Text className="whitespace-pre-line">{lesson.mnemonic}</Text>
 </div>
 )}
 </div>

 <button
 onClick={() => setExpanded(!expanded)}
 className="mt-4 px-3 py-1 text-xs bg-tremor-brand text-white rounded"
 >
 {expanded ? 'Collapse' : 'Expand'}
 </button>
 </Card>
 );
}
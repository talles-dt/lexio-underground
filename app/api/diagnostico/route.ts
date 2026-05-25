// app/api/diagnostico/route.ts
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const DiagnosticSchema = z.object({
  email: z.string().email(),
  answers: z.record(z.any()),
});

const determineArchetype = (scores: Record<string, number>) => {
  const pillars = { grammar: 0, logic: 0, communication: 0 };
  Object.entries(scores).forEach(([question, score]) => {
    if (question.includes('grammar')) pillars.grammar += Number(score);
    else if (question.includes('logic')) pillars.logic += Number(score);
    else if (question.includes('communication')) pillars.communication += Number(score);
  });

  const maxPillar = Object.entries(pillars).sort((a, b) => b[1] - a[1])[0][0];
  const archetypes: Record<string, { key: string; name: string }> = {
    grammar: { key: 'grammarian', name: 'O Gramático' },
    logic: { key: 'architect', name: 'O Arquiteto' },
    communication: { key: 'silence', name: 'O Silêncio' },
  };
  return archetypes[maxPillar] || { key: 'unknown', name: 'Desconhecido' };
};

export async function POST(req: Request) {
  const body = await req.json();
  const { email, answers } = DiagnosticSchema.parse(body);

  const scores = { grammar: 0, logic: 0, communication: 0 };
  Object.entries(answers).forEach(([question, score]) => {
    if (question.includes('grammar')) scores.grammar += Number(score);
    else if (question.includes('logic')) scores.logic += Number(score);
    else if (question.includes('communication')) scores.communication += Number(score);
  });
  const archetype = determineArchetype(scores);

  const { data, error } = await supabase
    .from('diagnostic_sessions')
    .insert({
      email,
      answers,
      scores,
      archetype_key: archetype.key,
      archetype_name: archetype.name,
    })
    .select('share_token')
    .single();

  if (error || !data?.share_token) {
    return new Response(JSON.stringify({ error: error?.message || 'Failed to create session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/diagnostico/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: email.split('@')[0],
        archetype_key: archetype.key,
        archetype_name: archetype.name,
        share_token: data.share_token,
      }),
    });
  } catch (notifyErr) {
    console.error('Failed to send notification:', notifyErr);
  }

  return new Response(JSON.stringify({ share_token: data.share_token }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// app/api/diagnostico/notify/route.ts
// Real Resend integration with archetype-specific templates + SMTP fallback

import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const ArchetypeSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  archetype_key: z.string(),
  archetype_name: z.string(),
  share_token: z.string(),
});

const TEMPLATES: Record<string, { subject: string; intro: string }> = {
  silence: {
    subject: "Antes do palco, há um trabalho.",
    intro: "Seu arquétipo é **O Silêncio** — ainda não é hora de falar.",
  },
  architect: {
    subject: "Você constrói. Falta fazer sangrar.",
    intro: "Seu arquétipo é **O Arquiteto** — argumentos perfeitos, mas paixão?",
  },
  grammarian: {
    subject: "Sua gramática não é um erro.",
    intro: "Seu arquétipo é **O Gramático** — o detalhe que salva vidas.",
  },
};

export async function POST(req: Request) {
  const { email, name, archetype_key, archetype_name, share_token } =
    ArchetypeSchema.parse(await req.json());

  const tpl = TEMPLATES[archetype_key] || {
    subject: `Seu arquétipo: ${archetype_name}`,
    intro: `Você é **${archetype_name}**.`,
  };

  try {
    const { data, error } = await resend.emails.send({
      from: 'Liceu Underground <noreply@lexio.underground>',
      to: email,
      subject: tpl.subject,
      html: `
        <p>Olá, ${name}. ${tpl.intro}</p>
        <p>Comece seu treinamento: <a href="https://lexio.underground/${archetype_key}">Abrir</a></p>
        <p>Compartilhe: <a href="https://lexio.underground/diagnostico/${share_token}">Link público</a></p>
      `,
    });

    if (error) throw error;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    console.error('Resend failed, attempting SMTP fallback:', err);

    // SMTP Fallback
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: 'Liceu Underground <noreply@liceu.underground>',
        to: email,
        subject: tpl.subject,
        html: `
          <p>Olá, ${name}. ${tpl.intro}</p>
          <p>Comece seu treinamento: <a href="https://lexio.underground/${archetype_key}">Abrir</a></p>
          <p>Compartilhe: <a href="https://lexio.underground/diagnostico/${share_token}">Link</a></p>
        `,
      });

      console.warn("SMTP fallback used for:", email);
      return new Response(JSON.stringify({ fallback: true }), { status: 200 });
    } catch (smtpErr: any) {
      return new Response(JSON.stringify({ error: smtpErr.message }), { status: 500 });
    }
  }
}

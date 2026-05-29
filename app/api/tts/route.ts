// app/api/tts/route.ts
// ElevenLabs TTS for palace item pronunciation (Phase 5.7)
// Returns audio stream for a given text

import { NextRequest, NextResponse } from "next/server";

// Default voice: Rachel (clear, neutral American English)
const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM";

export async function POST(req: NextRequest) {
  try {
    const { text, voice_id } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    // If no ElevenLabs key, return mock data
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({
        mock: true,
        text,
        audio_url: null,
        message: "ElevenLabs API key not configured. Set ELEVENLABS_API_KEY in .env.local",
      });
    }

    const voice = voice_id || DEFAULT_VOICE;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs ${response.status}: ${errorText}`);
    }

    // Return audio as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400", // cache for 24h
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}

// GET: List available voices (for UI selection)
export async function GET() {
  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json({
      voices: [
        { voice_id: DEFAULT_VOICE, name: "Rachel (Default)" },
      ],
      mock: true,
    });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ voices: data.voices });
  } catch (err) {
    console.error("Voices fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch voices" }, { status: 500 });
  }
}
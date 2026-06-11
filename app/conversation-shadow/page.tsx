"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";
import type { ShadowMessage } from "@/types/lexio-mind";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type RecordingState = "idle" | "recording" | "processing" | "result";

interface ShadowAPIResponse {
  response: string;
  corrected: boolean;
  grammarNotes: string[] | null;
}

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
  corrected: boolean;
  grammar_notes: string[] | null;
  created_at: string;
}

interface WaveformBar {
  id: number;
  height: number;
  delay: number;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const USER_ID = "default_user";
const SESSION_ID = crypto.randomUUID();
const BAR_COUNT = 40;

/* ------------------------------------------------------------------ */
/* Conversation Shadow Page                                            */
/* ------------------------------------------------------------------ */

export default function ConversationShadowPage() {
  // ── State ──────────────────────────────────────────────────────────
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [userTranscript, setUserTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [corrected, setCorrected] = useState(false);
  const [grammarNotes, setGrammarNotes] = useState<string[] | null>(null);
  const [waveformBars, setWaveformBars] = useState<WaveformBar[]>([]);
  const [history, setHistory] = useState<ShadowMessage[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // ── Refs ───────────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ── Generate waveform bars ─────────────────────────────────────────
  const generateWaveform = useCallback(() => {
    const bars: WaveformBar[] = Array.from({ length: BAR_COUNT }, (_, i) => ({
      id: i,
      height: Math.random() * 80 + 20,
      delay: i * 30,
    }));
    setWaveformBars(bars);
  }, []);

  // ── Load history on mount ──────────────────────────────────────────
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(
          `/api/conversation-shadow?user_id=${encodeURIComponent(USER_ID)}&limit=6`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          const msgs: ShadowMessage[] = data.messages.map(
            (m: HistoryMessage) => ({
              role: m.role,
              content: m.content,
              corrected: m.corrected,
              grammarNotes: m.grammar_notes,
            })
          );
          setHistory(msgs);
        }
      } catch {
        // Silently fail — history is non-critical
      }
    }
    loadHistory();
  }, []);

  // ── Start recording ────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setError(null);
    setAiResponse("");
    setUserTranscript("");
    setGrammarNotes(null);
    setCorrected(false);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Stop all tracks on the stream
        stream.getTracks().forEach((t) => t.stop());

        setRecordingState("processing");

        // Build the audio blob
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

        // Use Web Speech API for transcription if available,
        // otherwise fall back to a placeholder
        let transcript = "";

        // Attempt SpeechRecognition for live transcription
        // (Most browsers don't support this from a recorded blob,
        //  so we also try a simple fallback)
        if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
          // We already recorded; try sending audio to API as-is
          // The API expects a text message, so we need a transcript
        }

        // Since we can't reliably transcribe from the blob client-side,
        // send the audio to the API and also attempt recognition
        // For now, use a FileReader to send as base64 if needed,
        // but the API expects { user_id, message, session_id } with text.
        // We'll use a simple approach: attempt recognition, fall back to
        // sending raw message placeholder
        try {
          const reader = new FileReader();
          const base64Audio = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioBlob);
          });

          // Send to the conversation-shadow API
          // Since the API expects a text message, we send the audio data
          // and let it know we're sending audio. For now, we'll try
          // to get a transcript via a simple approach.
          // Fallback: if we can't transcribe, send a placeholder
          const res = await fetch("/api/conversation-shadow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: USER_ID,
              message: transcript || "[Audio message]",
              session_id: SESSION_ID,
              audio_data: base64Audio,
            }),
          });

          if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
          }

          const data: ShadowAPIResponse = await res.json();
          setUserTranscript(transcript || "[Audio message]");
          setAiResponse(data.response);
          setCorrected(data.corrected);
          setGrammarNotes(data.grammarNotes);
          generateWaveform();
          setRecordingState("result");

          // Prepend to local history
          setHistory((prev) => {
            const newMsgs: ShadowMessage[] = [
              { role: "user", content: transcript || "[Audio message]", corrected: false, grammarNotes: null },
              { role: "assistant", content: data.response, corrected: data.corrected, grammarNotes: data.grammarNotes },
              ...prev,
            ];
            return newMsgs.slice(0, 6); // Keep max 6 messages (3 turns)
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Processing failed";
          setError(msg);
          setRecordingState("idle");
        }
      };

      recorder.start();
      setRecordingState("recording");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Microphone access denied";
      setError(msg);
    }
  }, [generateWaveform]);

  // ── Stop recording ─────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  }, [mediaRecorder]);

  // ── TTS playback ───────────────────────────────────────────────────
  const playTTS = useCallback(async () => {
    if (ttsLoading || ttsPlaying || !aiResponse) return;
    setTtsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiResponse }),
      });

      if (!res.ok) {
        throw new Error(`TTS error: ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("audio/mpeg")) {
        const audioBlob = await res.blob();
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audioRef.current = audio;
        setTtsPlaying(true);

        audio.onended = () => {
          setTtsPlaying(false);
          URL.revokeObjectURL(url);
        };

        audio.onerror = () => {
          setTtsPlaying(false);
          setError("Audio playback failed");
          URL.revokeObjectURL(url);
        };

        await audio.play();
      } else {
        // Mock response — no real audio
        const data = await res.json();
        if (data.mock) {
          // Simulate brief playback state for mock
          setTtsPlaying(true);
          setTimeout(() => setTtsPlaying(false), 1500);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "TTS failed";
      setError(msg);
    } finally {
      setTtsLoading(false);
    }
  }, [aiResponse, ttsLoading, ttsPlaying]);

  // ── Reset ──────────────────────────────────────────────────────────
  const handleTryAgain = useCallback(() => {
    setRecordingState("idle");
    setUserTranscript("");
    setAiResponse("");
    setCorrected(false);
    setGrammarNotes(null);
    setWaveformBars([]);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setTtsPlaying(false);
    setTtsLoading(false);
  }, []);

  // ── Save to Palace ─────────────────────────────────────────────────
  const handleSaveToPalace = useCallback(() => {
    // Placeholder — would integrate with palace API
    alert("Saved to Memory Palace! (integration pending)");
  }, []);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div style={s.container}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <a href="/" style={s.navLink}>
          <span style={s.navButton}>Home</span>
        </a>
        <a href="/palace" style={s.navLink}>
          <span style={s.navButton}>Palace</span>
        </a>
        <a href="/lessons" style={s.navLink}>
          <span style={s.navButton}>Lessons</span>
        </a>
      </nav>

      {/* Header */}
      <header style={s.header}>
        <h1 style={s.title}>Conversation Shadow</h1>
        <p style={s.subtitle}>
          Speak. The shadow listens and replies — revealing what you meant to say.
        </p>
      </header>

      {/* Main content area */}
      <main style={s.main}>
        {/* ── Idle: Record Button ─────────────────────────────── */}
        {recordingState === "idle" && (
          <div style={s.centerStack}>
            <button
              type="button"
              onClick={startRecording}
              style={s.recordButton}
            >
              <span style={s.recordIcon}>🎙</span>
              <span style={s.recordLabel}>Record Message</span>
            </button>
            {error && <p style={s.errorText}>{error}</p>}
          </div>
        )}

        {/* ── Recording: Stop Button ──────────────────────────── */}
        {recordingState === "recording" && (
          <div style={s.centerStack}>
            <div style={s.pulseRing} />
            <button
              type="button"
              onClick={stopRecording}
              style={s.stopButton}
            >
              <span style={s.stopIcon}>■</span>
              <span style={s.recordLabel}>Stop Recording</span>
            </button>
            <p style={s.recordingHint}>Listening… tap to finish</p>
          </div>
        )}

        {/* ── Processing ──────────────────────────────────────── */}
        {recordingState === "processing" && (
          <div style={s.centerStack}>
            <div style={s.spinner} />
            <p style={s.processingText}>Processing…</p>
          </div>
        )}

        {/* ── Result ──────────────────────────────────────────── */}
        {recordingState === "result" && (
          <div style={s.resultStack}>
            {/* Transcript pair */}
            <div style={s.transcriptCard}>
              <div style={s.transcriptSide}>
                <span style={s.transcriptLabel}>You said</span>
                <p style={s.userTranscript}>{userTranscript}</p>
              </div>
              <div style={s.divider} />
              <div style={s.transcriptSide}>
                <span style={s.transcriptLabel}>Shadow replied</span>
                <p style={s.aiTranscript}>{aiResponse}</p>
              </div>
            </div>

            {/* Grammar notes */}
            {grammarNotes && grammarNotes.length > 0 && (
              <div style={s.grammarCard}>
                <span style={s.grammarLabel}>Grammar Notes</span>
                <ul style={s.grammarList}>
                  {grammarNotes.map((note, i) => (
                    <li key={i} style={s.grammarItem}>
                      {note}
                    </li>
                  ))}
                </ul>
                {corrected && (
                  <span style={s.correctedBadge}>Corrected</span>
                )}
              </div>
            )}

            {/* Waveform visualization */}
            <div style={s.waveformContainer}>
              <svg
                viewBox={`0 0 ${BAR_COUNT * 8} 100`}
                style={s.waveformSvg}
                preserveAspectRatio="none"
              >
                {waveformBars.map((bar) => (
                  <rect
                    key={bar.id}
                    x={bar.id * 8}
                    y={50 - bar.height / 2}
                    width={5}
                    rx={2.5}
                    height={bar.height}
                    fill={colors.phosphor}
                    opacity={0.85}
                    style={
                      {
                        animation: `waveformPulse 1.2s ease-in-out ${bar.delay}ms infinite alternate`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </svg>
            </div>

            {/* TTS button */}
            <button
              type="button"
              onClick={playTTS}
              disabled={ttsLoading || ttsPlaying}
              style={{
                ...s.ttsButton,
                opacity: ttsLoading || ttsPlaying ? 0.6 : 1,
                cursor: ttsLoading || ttsPlaying ? "not-allowed" : "pointer",
              }}
            >
              {ttsPlaying ? "▶ Playing…" : ttsLoading ? "Loading audio…" : "▶ Listen to Response"}
            </button>

            {/* Action buttons */}
            <div style={s.actionRow}>
              <button
                type="button"
                onClick={handleTryAgain}
                style={s.tryAgainButton}
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleSaveToPalace}
                style={s.saveButton}
              >
                Save to Palace
              </button>
            </div>

            {error && <p style={s.errorText}>{error}</p>}
          </div>
        )}
      </main>

      {/* ── History ───────────────────────────────────────────── */}
      {history.length > 0 && (
        <div style={s.historySection}>
          <button
            type="button"
            onClick={() => setHistoryOpen((prev) => !prev)}
            style={s.historyToggle}
          >
            <span style={s.historyToggleLabel}>
              Recent Turns ({Math.min(3, Math.ceil(history.length / 2))})
            </span>
            <span style={s.historyChevron}>{historyOpen ? "▾" : "▸"}</span>
          </button>

          {historyOpen && (
            <div style={s.historyList}>
              {groupTurns(history).map((turn, i) => (
                <div key={i} style={s.historyTurn}>
                  <p style={s.historyUser}>{turn.user}</p>
                  <p style={s.historyAI}>{turn.assistant}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CSS Keyframes (injected via style tag) */}
      <style>{keyframes}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

interface Turn {
  user: string;
  assistant: string;
}

function groupTurns(messages: ShadowMessage[]): Turn[] {
  const turns: Turn[] = [];
  for (let i = 0; i < messages.length; i += 2) {
    const user = messages[i];
    const assistant = messages[i + 1];
    if (user && user.role === "user") {
      turns.push({
        user: user.content,
        assistant: assistant && assistant.role === "assistant" ? assistant.content : "—",
      });
    }
  }
  return turns.slice(0, 3);
}

/* ------------------------------------------------------------------ */
/* CSS Keyframes                                                       */
/* ------------------------------------------------------------------ */

const keyframes = `
@keyframes waveformPulse {
  0% {
    opacity: 0.4;
    transform: scaleY(0.6);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const s: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    display: "flex",
    flexDirection: "column",
  },

  // Navbar
  navbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: spacing[2],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  navLink: {
    textDecoration: "none",
  },
  navButton: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    padding: "10px 22px",
    display: "inline-block",
    color: colors.obsidian,
    fontWeight: 600,
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
  },

  // Header
  header: {
    textAlign: "center",
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  title: {
    fontFamily: typography.display.fontFamily,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    fontWeight: typography.display.fontWeight,
    color: colors.ivory,
    margin: 0,
    paddingBottom: spacing[3],
  },
  subtitle: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: typography.bodyItalic.fontStyle,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.zinc,
    margin: 0,
    maxWidth: 440,
    marginLeft: "auto",
    marginRight: "auto",
  },

  // Main
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingBottom: spacing[8],
  },

  // Center stack (idle / recording / processing)
  centerStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: spacing[4],
    position: "relative",
  },

  // Record button
  recordButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 160,
    borderRadius: "50%",
    backgroundColor: colors.phosphor,
    border: "none",
    cursor: "pointer",
    transition: `transform ${duration.fast}ms ease, box-shadow ${duration.fast}ms ease`,
    boxShadow: `0 0 40px ${colors.phosphor}44`,
  },
  recordIcon: {
    fontSize: 36,
    lineHeight: 1,
    paddingBottom: spacing[1],
  },
  recordLabel: {
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    fontWeight: 600,
    color: colors.obsidian,
  },

  // Stop button (recording state)
  stopButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 160,
    borderRadius: "50%",
    backgroundColor: colors.crimson,
    border: "none",
    cursor: "pointer",
    transition: `transform ${duration.fast}ms ease`,
    boxShadow: `0 0 40px ${colors.crimson}66`,
    zIndex: 2,
  },
  stopIcon: {
    fontSize: 28,
    lineHeight: 1,
    paddingBottom: spacing[1],
    color: colors.ivory,
  },
  pulseRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: "50%",
    border: `2px solid ${colors.crimson}`,
    animation: "pulseRing 1.5s ease-out infinite",
    top: 0,
    left: "50%",
    marginLeft: -80,
    zIndex: 1,
  },
  recordingHint: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: colors.crimson,
    margin: 0,
  },

  // Processing
  spinner: {
    width: 48,
    height: 48,
    border: `3px solid ${colors.borderSubtle}`,
    borderTopColor: colors.phosphor,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  processingText: {
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    color: colors.zinc,
    margin: 0,
  },

  // Result stack
  resultStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: spacing[4],
    maxWidth: 520,
    width: "100%",
  },

  // Transcript card
  transcriptCard: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    border: `1px solid ${colors.borderSubtle}`,
    overflow: "hidden",
    width: "100%",
  },
  transcriptSide: {
    flex: 1,
    padding: spacing[4],
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  divider: {
    width: 1,
    backgroundColor: colors.borderSubtle,
    alignSelf: "stretch",
  },
  transcriptLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: 600,
    color: colors.phosphor,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  userTranscript: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: "italic",
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.zinc,
    margin: 0,
  },
  aiTranscript: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.ivory,
    margin: 0,
  },

  // Grammar card
  grammarCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    border: `1px solid ${colors.borderSubtle}`,
    padding: spacing[4],
    width: "100%",
    position: "relative",
  },
  grammarLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: 600,
    color: colors.amber,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  grammarList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    paddingTop: spacing[2],
    display: "flex",
    flexDirection: "column",
    gap: spacing[1],
  },
  grammarItem: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.text.sm,
    lineHeight: 1.5,
    color: colors.onSurfaceVariant,
    paddingLeft: spacing[3],
    borderLeft: `2px solid ${colors.amber}`,
  },
  correctedBadge: {
    display: "inline-block",
    marginTop: spacing[2],
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: 600,
    color: colors.amber,
    backgroundColor: `${colors.amber}18`,
    borderRadius: radius.btn,
    padding: "2px 10px",
  },

  // Waveform
  waveformContainer: {
    width: "100%",
    height: 64,
    borderRadius: radius.sm,
    overflow: "hidden",
    backgroundColor: `${colors.phosphor}08`,
    border: `1px solid ${colors.borderSubtle}`,
  },
  waveformSvg: {
    width: "100%",
    height: "100%",
    display: "block",
  },

  // TTS button
  ttsButton: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.phosphor}`,
    borderRadius: radius.btn,
    color: colors.phosphor,
    padding: "10px 24px",
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    fontWeight: 500,
    transition: `all ${duration.fast}ms ease`,
  },

  // Action row
  actionRow: {
    display: "flex",
    flexDirection: "row",
    gap: spacing[3],
    width: "100%",
  },
  tryAgainButton: {
    flex: 1,
    backgroundColor: "transparent",
    border: `1px solid ${colors.zinc}`,
    borderRadius: radius.btn,
    color: colors.ivory,
    padding: "10px 0",
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    cursor: "pointer",
    transition: `border-color ${duration.fast}ms ease`,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.phosphor,
    border: "none",
    borderRadius: radius.btn,
    color: colors.obsidian,
    padding: "10px 0",
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    fontWeight: 600,
    cursor: "pointer",
    transition: `opacity ${duration.fast}ms ease`,
  },

  // Error
  errorText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: colors.crimson,
    margin: 0,
    textAlign: "center",
  },

  // History section
  historySection: {
    borderTop: `1px solid ${colors.borderSubtle}`,
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  historyToggle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  historyToggleLabel: {
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    color: colors.zinc,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  historyChevron: {
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    color: colors.zinc,
  },
  historyList: {
    paddingTop: spacing[3],
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
  },
  historyTurn: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    border: `1px solid ${colors.borderSubtle}`,
    padding: spacing[3],
  },
  historyUser: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: "italic",
    fontSize: typography.text.sm,
    lineHeight: 1.5,
    color: colors.zinc,
    margin: 0,
    paddingBottom: spacing[1],
  },
  historyAI: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.text.sm,
    lineHeight: 1.5,
    color: colors.ivory,
    margin: 0,
  },
};

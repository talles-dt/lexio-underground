/**
 * Lexio Underground — Spaced Repetition System
 *
 * Implements SM-2 algorithm (SuperMemo 2) with modifications:
 * - Ease factor starts at 2.5, minimum 1.3
 * - Intervals: 1d → 6d → next = previous * ease_factor
 * - Quality of response: 0-5 scale
 * - Items reset to "learning" if quality < 3
 */

export interface SpacedRepetitionItem {
  id: string;
  palace_id: string;
  user_id: string;
  source: "cartografa" | "pulse" | "lesson" | "manual";
  pillar: "grammar" | "logic" | "vocab" | "culture" | "comm";
  item_type: "word" | "chunk" | "phrase" | "rule" | "cultural_atom";
  title: string;
  content: string;
  explanation: string;
  example?: string;
  translation?: string;
  room: string; // palace room

  // SM-2 fields
  ease_factor: number; // default 2.5, min 1.3
  interval_days: number; // current interval in days
  repetitions: number; // number of successful reviews in a row
  next_review: string; // ISO date string
  last_review: string | null; // ISO date string
  status: "new" | "learning" | "review" | "mastered";

  // Metadata
  created_at: string;
  review_count: number;
  correct_count: number;
}

// SM-2 Algorithm
export function processReview(
  item: SpacedRepetitionItem,
  quality: number // 0-5: 0=complete blackout, 5=perfect response
): SpacedRepetitionItem {
  const updated = { ...item };
  updated.last_review = new Date().toISOString();
  updated.review_count++;

  if (quality >= 3) {
    // Correct response
    updated.correct_count++;

    if (updated.repetitions === 0) {
      updated.interval_days = 1;
    } else if (updated.repetitions === 1) {
      updated.interval_days = 6;
    } else {
      updated.interval_days = Math.round(updated.interval_days * updated.ease_factor);
    }

    updated.repetitions++;

    // Check if mastered (5+ successful reviews, interval > 21 days)
    if (updated.repetitions >= 5 && updated.interval_days > 21) {
      updated.status = "mastered";
    } else {
      updated.status = "review";
    }
  } else {
    // Incorrect response — reset
    updated.repetitions = 0;
    updated.interval_days = 1;
    updated.status = "learning";
  }

  // Update ease factor
  updated.ease_factor = Math.max(
    1.3,
    updated.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + updated.interval_days);
  updated.next_review = nextDate.toISOString();

  return updated;
}

// Create a new SR item from a cultural atom
export function createItemFromAtom(
  atom: { id: string; title: string; description: string; content: string; example?: string; translation?: string; pillar: string },
  userId: string,
  palaceId: string,
  room: string
): Omit<SpacedRepetitionItem, "id"> {
  const now = new Date().toISOString();
  return {
    palace_id: palaceId,
    user_id: userId,
    source: "pulse",
    pillar: atom.pillar as SpacedRepetitionItem["pillar"],
    item_type: atom.pillar === "vocab" ? "chunk" : "cultural_atom",
    title: atom.title,
    content: atom.content,
    explanation: atom.description,
    example: atom.example,
    translation: atom.translation,
    room,
    ease_factor: 2.5,
    interval_days: 0,
    repetitions: 0,
    next_review: now,
    last_review: null,
    status: "new",
    created_at: now,
    review_count: 0,
    correct_count: 0,
  };
}

// Get items due for review today
export function getDueItems(items: SpacedRepetitionItem[]): SpacedRepetitionItem[] {
  const today = new Date().toISOString().split("T")[0];
  return items.filter((item) => {
    const reviewDate = item.next_review.split("T")[0];
    return reviewDate <= today;
  });
}

// Get review queue grouped by status
export function getReviewQueue(items: SpacedRepetitionItem[]): {
  new: SpacedRepetitionItem[];
  learning: SpacedRepetitionItem[];
  review: SpacedRepetitionItem[];
  mastered: SpacedRepetitionItem[];
  dueToday: SpacedRepetitionItem[];
  totalDue: number;
} {
  const due = getDueItems(items);
  return {
    new: due.filter((i) => i.status === "new"),
    learning: due.filter((i) => i.status === "learning"),
    review: due.filter((i) => i.status === "review"),
    mastered: items.filter((i) => i.status === "mastered"),
    dueToday: due,
    totalDue: due.length,
  };
}

// Quality labels for the review UI
export const QUALITY_LABELS: Record<number, { label: string; color: string; description: string }> = {
  0: { label: "Blackout", color: "#dc2626", description: "Complete blank — no memory at all" },
  1: { label: "Wrong", color: "#ff9500", description: "Wrong answer, but recognized it when shown" },
  2: { label: "Hard", color: "#ff9500", description: "Wrong answer, but it felt familiar" },
  3: { label: "Difficult", color: "#71717a", description: "Correct, but with significant effort" },
  4: { label: "Good", color: "#00ff88", description: "Correct with minor hesitation" },
  5: { label: "Perfect", color: "#00ff88", description: "Instant, effortless recall" },
};

// Get next review label
export function getNextReviewLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  return `${Math.round(days / 30)} months`;
}

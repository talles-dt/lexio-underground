// src/palace/spaced-repetition.ts
// SM-2 algorithm for spaced repetition (Phase 4.5)
// Based on the SuperMemo SM-2 algorithm by Piotr Wozniak

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0=complete blackout, 5=perfect response
}

export interface SM2State {
  easeFactor: number;     // starting at 2.5
  intervalDays: number;   // current interval in days
  repetitions: number;    // consecutive correct responses
}

export interface SM2Update {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReview: Date;
  isMastered: boolean;
}

const MIN_EASE_FACTOR = 1.3;
const MASTERED_INTERVAL = 180; // 6 months = mastered

export function applySM2(
  state: SM2State,
  result: ReviewResult,
): SM2Update {
  const { quality } = result;
  const q = quality;

  // Calculate new ease factor
  let newEaseFactor =
    state.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  if (newEaseFactor < MIN_EASE_FACTOR) {
    newEaseFactor = MIN_EASE_FACTOR;
  }

  let newRepetitions: number;
  let newIntervalDays: number;

  if (q < 3) {
    // Failed — reset repetitions
    newRepetitions = 0;
    newIntervalDays = 1;
  } else {
    // Passed
    newRepetitions = state.repetitions + 1;

    switch (newRepetitions) {
      case 1:
        newIntervalDays = 1;
        break;
      case 2:
        newIntervalDays = 6;
        break;
      default:
        newIntervalDays = Math.round(state.intervalDays * newEaseFactor);
        break;
    }
  }

  const isMastered = newIntervalDays >= MASTERED_INTERVAL;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newIntervalDays);

  return {
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    intervalDays: newIntervalDays,
    repetitions: newRepetitions,
    nextReview,
    isMastered,
  };
}

// Map Cartografa answer correctness to SM-2 quality
export function cartografaToQuality(correct: boolean, confidence?: number): ReviewResult["quality"] {
  if (!correct) return 1; // wrong = near blackout
  if (!confidence) return 3; // correct but unsure
  if (confidence >= 0.9) return 5; // perfect
  if (confidence >= 0.7) return 4; // correct with some hesitation
  return 3; // correct but uncertain
}

// Get daily review queue from items sorted by next_review
export function getDailyReviewQueue(
  items: { id: string; next_review: string; pillar: string; title: string; content: string; explanation?: string }[],
  maxItems: number = 7,
): { id: string; pillar: string; title: string; content: string; explanation?: string }[] {
  const now = new Date();
  const due = items
    .filter((item) => new Date(item.next_review) <= now)
    .sort((a, b) => new Date(a.next_review).getTime() - new Date(b.next_review).getTime())
    .slice(0, maxItems);

  return due;
}
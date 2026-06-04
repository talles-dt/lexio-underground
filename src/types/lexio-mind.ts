export type ShadowMessage = {
  role: "user" | "assistant";
  content: string;
  corrected: boolean;
  grammarNotes: string[] | null;
};

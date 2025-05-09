// Client-side types for fortunes

export type FortuneCategory = "love" | "career" | "wealth" | "general";

export interface Fortune {
  id: number;
  message: string;
  category: FortuneCategory;
}

export interface SavedFortune {
  fortune: Fortune;
  savedAt: string; // ISO date string
}

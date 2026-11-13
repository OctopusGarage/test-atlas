export type Locale = "en" | "zh";
export interface Question {
  id: string;
  dimension: string;
  text: string;
  reverse?: boolean;
}
export interface Dimension {
  id: string;
  name: string;
  en: string;
  low: string;
  high: string;
  action: string;
}
export interface Source {
  label: string;
  url: string;
  rights: string;
}
export interface Archetype {
  dimension?: string;
  id?: string;
  name: string;
  enName?: string;
  description?: string;
  enDescription?: string;
}
export interface AssessmentTranslation {
  name: string;
  english?: string;
  category: string;
  kind: string;
  tagline: string;
  description: string;
  basis: string;
  instruction: string;
  source: Source;
  dimensions: Dimension[];
  questions: Question[];
}
export interface Assessment {
  id: string;
  version: number;
  scoringVersion: number;
  reportVersion: number;
  name: string;
  english: string;
  category: string;
  kind: string;
  symbol: string;
  color: string;
  minutes: string;
  tagline: string;
  description: string;
  basis: string;
  source: Source;
  instruction: string;
  dimensions: Dimension[];
  questions: Question[];
  contentHash?: string;
  en?: AssessmentTranslation;
  archetypes?: Archetype[];
}
export interface Result {
  id: string;
  testId: string;
  scores: Record<string, number>;
  testVersion?: number;
  scoringVersion?: number;
  reportVersion?: number;
  contentHash?: string;
  locale?: string;
  completedAt?: string;
}
export interface Draft {
  version: number;
  index: number;
  answers: Record<string, number>;
}
export interface StoredState {
  schemaVersion: number;
  revision: number;
  drafts: Record<string, Draft>;
  results: Result[];
}
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type UserRole = 'team' | 'admin' | 'guest';

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
}

export interface Team {
  id: string;             // e.g. "team-01"
  name: string;           // e.g. "Null Pointers"
  passcode: string;       // e.g. "team01"
  college: string;        // "PCCOER Ravet" or external
  members: TeamMember[];
  avatar: string;
  round1Score: number;    // Rapid Fire score
  manualAdjustment: number; // Manual score adjustment (+ / -) by admin/faculty
  totalScore: number;     // round1Score + manualAdjustment
  completedAt?: string;   // Timestamp for tie-breaking
  timeTakenSec?: number;  // Total seconds spent in quiz for tie-breaking
  lastUpdated?: string;
}

export type QuestionFormat = 'single' | 'multiple';

export interface QuizQuestion {
  id: string;
  format: QuestionFormat;     // 'single' = single-choice, 'multiple' = multiple-select
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndices: number[];   // Array of correct option indices (e.g. [1] or [0, 2])
  explanation?: string;
  timeLimitSec: number;       // e.g. 20 or 30 seconds
  category: string;           // e.g. "Programming Fundamentals", "Data Structures", "General Computing"
  points: number;             // e.g. 100 base points
  negativePoints?: number;    // e.g. 25 points deducted if incorrect (if negative marking applied)
}

export interface QuizSettings {
  round1Active: boolean;
  timeLimitPerQuestionSec: number;
  negativeMarkingEnabled: boolean;
  negativeMarkingPenalty: number;
  speedBonusEnabled: boolean;
}

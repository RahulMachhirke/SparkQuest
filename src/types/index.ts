export type QuestionType = 'single' | 'multiple';

export interface Question {
  id: string;
  type: QuestionType; // 'single' = MCQ, 'multiple' = MSQ (choose all that apply)
  category: string;
  question: string;
  code?: string;
  options: string[];
  correct: number[]; // Array of correct indices, e.g. [1] or [0, 2]
  explanation?: string;
  timeLimitSec: number;
  points: number;
}

export interface Team {
  id: string;
  name: string;
  passcode: string;
  college: string;
  members: string;
  avatar: string;
  round1Score: number;
  manualAdjustment: number;
  totalScore: number;
  timeTakenSec: number;
  completedAt?: string | null;
  isOnline?: boolean;
}

export type RoundStatus = 'waiting' | 'live' | 'ended';

export interface CompetitionState {
  currentRound: number;
  round1Status: RoundStatus;
  activeQuestionIndex?: number;
  updatedAt?: string;
}

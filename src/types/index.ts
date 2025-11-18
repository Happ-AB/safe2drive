export interface UserData {
  age: number;
  weight: number;
  gender: Gender;
  beers: number;
  wines: number;
  cocktails: number;
  meal: boolean;
}

export interface TestResult {
  passed: boolean;
  retryAvailable: boolean;
  waitTime?: string;
}

export type Gender = "♂" | "♀" | "⚤" | undefined;

export type TestType = "reaction" | "decision" | "stroop";

export interface TestScore {
  times: number[]; // Raw times or times with penalties
  averageTime: number;
  correctAnswers?: number; // For decision tests
  totalQuestions?: number; // For decision tests
  testType: TestType;
}

export const PermittedLimit = {
  GLOBAL: 0.2,
} as const;

export const minutesBeforeRetryTest = 30;

// Test configuration
export const TestConfig = {
  reaction: {
    passThreshold: 1000, // ms - average reaction time must be under this
  },
  decision: {
    passThreshold: 3000, // ms - average decision time must be under this
    wrongAnswerPenalty: 2000, // ms - added to decision time for wrong answers
    timeoutPenalty: 1000, // ms - added to time limit for timeouts
  },
  stroop: {
    passThreshold: 2500, // ms - average response time must be under this
    wrongAnswerPenalty: 1500, // ms - penalty for choosing wrong color
    timeoutPenalty: 1000, // ms - added to time limit for timeouts
  },
} as const;

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

export interface TestResult {
  passed: boolean;
  retryAvailable: boolean;
  waitTime?: string;
}
export type Gender = "♂" | "♀" | "⚤" | undefined;

export const PermittedLimit = {
  GLOBAL: 0.2,
} as const;

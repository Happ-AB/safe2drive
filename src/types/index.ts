export interface UserData {
  height: number | null;
  weight: number | null;
  alcoholUnits: number;
}

export interface TestResult {
  passed: boolean;
  retryAvailable: boolean;
  waitTime?: string;
}

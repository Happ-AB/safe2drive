import type { TestResult } from "../types";

export function useTestLogic() {
  const evaluateTest = (reactionTimes: number[]): TestResult => {
    const averageTime =
      reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
    const passed = averageTime < 500; // Pass if avg < 500ms
    return {
      passed,
      retryAvailable: !passed,
      waitTime: passed ? undefined : "30 minutes",
    };
  };

  return { evaluateTest };
}

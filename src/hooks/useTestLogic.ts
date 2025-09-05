import type { TestResult } from "../types";

export function useTestLogic() {
  const evaluateTest = (reactionTimes: number[]): TestResult => {
    const averageTime =
      reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
    const passed = averageTime < 1500; // Pass/fail condition
    return {
      passed,
      retryAvailable: !passed,
      waitTime: passed ? undefined : "30 minutes",
    };
  };

  return { evaluateTest };
}

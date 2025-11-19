import type { TestResult, TestScore } from "../types";
import { TestConfig } from "../types";

export function useTestLogic() {
  const evaluateTest = (testScore: TestScore): TestResult => {
    let passed = false;

    if (testScore.testType === "reaction") {
      // For reaction tests: check if average time is under threshold
      passed = testScore.averageTime < TestConfig.reaction.passThreshold;
    } else if (testScore.testType === "decision") {
      // For decision tests: check if average time is under threshold
      passed = testScore.averageTime < TestConfig.decision.passThreshold;
    } else if (testScore.testType === "stroop") {
      // For stroop tests: check if average time is under threshold
      passed = testScore.averageTime < TestConfig.stroop.passThreshold;
    } else if (testScore.testType === "pattern") {
      // For pattern tests: must get all answers correct AND be under time threshold
      const allCorrect = testScore.correctAnswers === testScore.totalQuestions;
      const withinTime =
        testScore.averageTime < TestConfig.pattern.passThreshold;
      passed = allCorrect && withinTime;
    }

    console.log("Test evaluation:", {
      type: testScore.testType,
      averageTime: testScore.averageTime,
      correctAnswers: testScore.correctAnswers,
      totalQuestions: testScore.totalQuestions,
      passed,
    });

    return {
      passed,
      retryAvailable: !passed,
      waitTime: passed ? undefined : "30 minutes",
    };
  };

  return { evaluateTest };
}

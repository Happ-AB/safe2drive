import { useState } from "react";
import type { TestResult } from "../types";

// Placeholder test logic
export function useTestLogic(alcoholUnits: number) {
  const [result, setResult] = useState<TestResult | null>(null);

  const runTest = () => {
    // Mock test: Fail if more than 2 alcohol units
    const passed = alcoholUnits <= 2;
    const waitTime =
      alcoholUnits > 2 ? `${alcoholUnits * 30} minutes` : undefined;
    setResult({
      passed,
      retryAvailable: !passed,
      waitTime,
    });
  };

  return { result, runTest };
}

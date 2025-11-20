import { useState, useEffect } from "react";
import DecisionTest from "../components/games/DecisionTest";
import ReactionTest from "../components/games/ReactionTest";
import StroopTest from "../components/games/StroopTest";
import PatternTest from "../components/games/PatternTest";
import DualTaskTest from "../components/games/DualTaskTest";
import { useTestLogic } from "../hooks/useTestLogic";
import type { TestScore } from "../types";

// Map of test keys to components
const testComponents: Record<
  string,
  React.ComponentType<{ onComplete: (testScore: TestScore) => void }>
> = {
  reaction: ReactionTest,
  pattern: PatternTest,
  decision: DecisionTest,
  stroop: StroopTest,
  "dual-task": DualTaskTest,
  // Add future tests here:
  // coordination: CoordinationTest,
};

export default function Test() {
  const { evaluateTest } = useTestLogic();
  const [selectedTest, setSelectedTest] = useState<{
    name: string;
    component: React.ComponentType<{
      onComplete: (testScore: TestScore) => void;
    }>;
  } | null>(null);

  useEffect(() => {
    // Get the test selected in StartInfo from localStorage
    const storedTest = localStorage.getItem("selectedTest");
    if (storedTest) {
      try {
        const test = JSON.parse(storedTest) as { name: string; key: string };
        const component = testComponents[test.key];
        if (component) {
          setSelectedTest({ name: test.name, component });
          console.log("Loading test:", test.name);
        }
      } catch (error) {
        console.error("Failed to parse selected test", error);
      }
    }
  }, []);

  if (!selectedTest) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading test...</p>
      </div>
    );
  }

  const TestComponent = selectedTest.component;

  return (
    <div className="flex items-center justify-center h-full">
      <TestComponent onComplete={evaluateTest} />
    </div>
  );
}

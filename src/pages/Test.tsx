<<<<<<< HEAD
import ReactionTest from "../components/reaction-tests/ReactionTest";
=======
import { useState, useEffect } from "react";
import DecisionTest from "../components/games/DecisionTest";
import ReactionTest from "../components/games/ReactionTest";
>>>>>>> main
import { useTestLogic } from "../hooks/useTestLogic";
import type { TestScore } from "../types";

// Map of test keys to components
const testComponents: Record<
  string,
  React.ComponentType<{ onComplete: (testScore: TestScore) => void }>
> = {
  reaction: ReactionTest,
  decision: DecisionTest,
  // Add future tests here:
  // memory: MemoryTest,
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

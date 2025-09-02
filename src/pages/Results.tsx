import { useLocation, useNavigate } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import { useEffect, useState } from "react";
import { useTestLogic } from "../hooks/useTestLogic";
import type { TestResult } from "../types";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { evaluateTest } = useTestLogic();
  const [result, setResult] = useState<TestResult | null>(null);
  const reactionTimes = (location.state as { reactionTimes?: number[] })
    ?.reactionTimes;

  useEffect(() => {
    if (reactionTimes && !result) {
      const testResult = evaluateTest(reactionTimes); // Call evaluateTest once
      setResult(testResult!);
    } else if (!reactionTimes) {
      navigate("/"); // Redirect if no reactionTimes
    }
  }, [reactionTimes, navigate]); // Removed evaluateTest from deps

  if (!result) {
    return null; // Prevent rendering until result is set
  }

  const handleRetry = () => {
    navigate("/start");
  };

  return (
    <div className="p-4 flex flex-col items-center max-w-md mx-auto">
      <ResultCard result={result} onRetry={handleRetry} />
    </div>
  );
}

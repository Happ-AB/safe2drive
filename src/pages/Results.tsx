import { useLocation, useNavigate } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import { useEffect, useState } from "react";
import { useTestLogic } from "../hooks/useTestLogic";
import type { TestResult, TestScore } from "../types";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { evaluateTest } = useTestLogic();
  const [result, setResult] = useState<TestResult | null>(null);
  const testScore = (location.state as { testScore?: TestScore })?.testScore;

  // Legacy support for old reactionTimes format
  const reactionTimes = (location.state as { reactionTimes?: number[] })
    ?.reactionTimes;

  console.log(location);

  useEffect(() => {
    if (testScore && !result) {
      const testResult = evaluateTest(testScore);
      setResult(testResult);
    } else if (reactionTimes && !result) {
      // Legacy support: convert old format to TestScore
      const averageTime =
        reactionTimes.reduce((sum, t) => sum + t, 0) / reactionTimes.length;
      const legacyTestScore: TestScore = {
        times: reactionTimes,
        averageTime,
        testType: "reaction",
      };
      const testResult = evaluateTest(legacyTestScore);
      setResult(testResult);
    } else if (!testScore && !reactionTimes) {
      navigate("/");
    }
  }, [testScore, reactionTimes, navigate, result, evaluateTest]);

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

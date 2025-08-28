import { useLocation, useNavigate } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import type { TestResult } from "../types";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result: TestResult })?.result;

  const handleRetry = () => {
    navigate("/start");
  };

  if (!result) {
    navigate("/");
    return null;
  }

  return (
    <div className="p-4 flex flex-col items-center max-w-md mx-auto">
      <ResultCard result={result} onRetry={handleRetry} />
    </div>
  );
}

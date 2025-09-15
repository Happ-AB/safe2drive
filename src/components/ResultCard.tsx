import { bacCalculator } from "../helpers/functions";
import { PermittedLimit, type TestResult } from "../types";

interface Props {
  result: TestResult;
  onRetry: () => void;
}

export default function ResultCard({ result, onRetry }: Props) {
  const inputs = JSON.parse(localStorage.getItem("userData") || "[]");
  const bac = bacCalculator(
    inputs.age,
    inputs.gender,
    inputs.meal,
    inputs.beers + inputs.wines + inputs.cocktails,
    inputs.weight
  );

  const resultOutcomes = () => {
    if (result.passed && bac < PermittedLimit.GLOBAL) {
      return "green";
    } else if (!result.passed && bac > PermittedLimit.GLOBAL) {
      localStorage.setItem("failTime", Date.now().toString());
      return "red";
    } else {
      return "orange";
    }
  };
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      {resultOutcomes() === "green" ? (
        <>
          <h2 className="text-2xl font-semibold text-green-600">
            Safe to Drive!
          </h2>
          <p className="mt-2">You're making smart choices.</p>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
            Share App
          </button>
        </>
      ) : resultOutcomes() === "orange" ? (
        <>
          <h2 className="text-2xl font-semibold text-yellow-600">
            Smart Drivers Wait
          </h2>
          <p className="mt-2 font-semibold my-4">Take a short rest</p>
          <p className="mt-2 font-semibold my-4">OR</p>
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Try Different Test
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-red-600">
            Smart Drivers Wait!
          </h2>
          <p className="mt-2">You're protecting what matters most.</p>
          <p className="mt-2 text-sm">
            Impaired driving causes 30% of traffic fatalities.
          </p>
          <p className="mt-2">
            Your future self will thank you for this decision.
          </p>
          {result.waitTime && (
            <p className="mt-2 font-semibold">Try again in {result.waitTime}</p>
          )}
          <p className="mt-2 font-semibold my-4">OR</p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://www.uber.com"
              target="_blank"
              className="bg-gray-200 py-2 px-4 rounded"
            >
              Book a Ride
            </a>
          </div>
        </>
      )}
    </div>
  );
}

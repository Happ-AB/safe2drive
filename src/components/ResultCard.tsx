import type { TestResult } from "../types";
import { Link } from "react-router-dom";

interface Props {
  result: TestResult;
  onRetry: () => void;
}

export default function ResultCard({ result, onRetry }: Props) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      {result.passed ? (
        <>
          <h2 className="text-2xl font-semibold text-green-600">
            Safe to Drive!
          </h2>
          <p className="mt-2">You're making smart choices.</p>
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
            Share App
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-yellow-600">
            Smart Drivers Wait
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
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://www.uber.com"
              target="_blank"
              className="bg-gray-200 py-2 px-4 rounded"
            >
              Book a Ride
            </a>
            {result.retryAvailable && (
              <button
                onClick={onRetry}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Try Different Test
              </button>
            )}
          </div>
        </>
      )}
      <Link to="/" className="mt-4 block text-blue-600">
        Back to Home
      </Link>
    </div>
  );
}

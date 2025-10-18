import { bacCalculator } from "../helpers/functions";
import { PermittedLimit, type TestResult } from "../types";

interface Props {
  result: TestResult;
  onRetry: () => void;
}

import Card from "./ui/Card";
import Button from "./ui/Button";

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
    <Card className="p-6 text-center animate-slide-up">
      {resultOutcomes() === "green" ? (
        <>
          <h2 className="text-2xl font-semibold text-green-400">
            Safe to Drive!
          </h2>
          <p className="mt-2 text-muted">You're making smart choices.</p>
          <Button className="mt-4" variant="primary">
            Share App
          </Button>
        </>
      ) : resultOutcomes() === "orange" ? (
        <>
          <h2 className="text-2xl font-semibold text-yellow-400">
            Smart Drivers Wait
          </h2>
          <p className="mt-2 font-semibold my-4">Take a short rest</p>
          <p className="mt-2 font-semibold my-4">OR</p>
          <Button onClick={onRetry} variant="primary">
            Try Different Test
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-red-400">
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
            <button
              onClick={() => {
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const isAndroid = /Android/.test(navigator.userAgent);

                if (isIOS || isAndroid) {
                  window.location.href = "bolt://";
                } else {
                  window.open("https://bolt.eu/sv-se/", "_blank");
                }
              }}
              className="btn"
            >
              Book a Ride
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

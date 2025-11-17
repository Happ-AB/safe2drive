import { useState, useEffect } from "react";
import Countdown from "../components/Countdown";
import { minutesBeforeRetryTest } from "../types";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// Available test types
const availableTests = [
  { name: "Reaction Test", key: "reaction" },
  { name: "Decision Test", key: "decision" },
  // Add future tests here
];

export default function StartInfo() {
  const [ready, setReady] = useState(false);
  const [selectedTest, setSelectedTest] = useState<{
    name: string;
    key: string;
  } | null>(null);

  useEffect(() => {
    // Randomly select a test when component mounts
    const randomIndex = Math.floor(Math.random() * availableTests.length);
    const test = availableTests[randomIndex];
    setSelectedTest(test);
    // Store in localStorage so Test page can use it
    localStorage.setItem("selectedTest", JSON.stringify(test));
    console.log("Selected test:", test.name);
  }, []);

  const handleStart = () => {
    setReady(true);
  };

  const failTime = localStorage.getItem("failTime");

  return (
    <div className="p-4 flex flex-col items-center max-w-md mx-auto h-full">
      {ready ? (
        <Countdown onComplete={() => {}} testName={selectedTest?.name} />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Get Ready</h1>
          <Card className="p-6 text-center animate-slide-up">
            <h2 className="text-lg font-semibold mb-2">How It Works</h2>
            <p className="text-sm text-muted mb-4">
              The test will assess your reaction time and coordination. Follow
              the on-screen instructions carefully.
            </p>
            {failTime &&
            Date.now() - +failTime < minutesBeforeRetryTest * 60 * 1000 ? (
              <h2 className="text-lg font-semibold m-4 bg-red-500 text-white p-2 rounded-md">
                Please wait{" "}
                {Math.max(
                  0,
                  Math.floor(
                    (minutesBeforeRetryTest * 60 * 1000 -
                      (Date.now() - +failTime)) /
                      1000 /
                      60
                  )
                )}{" "}
                more minutes
              </h2>
            ) : (
              <>
                <p className="text-sm font-semibold mb-4">Ready?</p>
                <Button onClick={handleStart} variant="primary" fullWidth>
                  Start Test
                </Button>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

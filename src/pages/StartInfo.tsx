import { useState } from "react";
import Countdown from "../components/Countdown";

export default function StartInfo() {
  const [ready, setReady] = useState(false);

  const handleStart = () => {
    setReady(true);
  };

  return (
    <div className="p-4 flex flex-col items-center max-w-md mx-auto h-full">
      {ready ? (
        <Countdown onComplete={() => {}} />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Get Ready</h1>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold mb-2">How It Works</h2>
            <p className="text-sm text-gray-600 mb-4">
              The test will assess your reaction time and coordination. Follow
              the on-screen instructions carefully.
            </p>
            <p className="text-sm font-semibold mb-4">Ready?</p>
            <button
              onClick={handleStart}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Start Test
            </button>
          </div>
        </>
      )}
    </div>
  );
}

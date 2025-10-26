import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import Button from "./ui/Button";

interface Props {
  onComplete: (decisionTimes: number[]) => void;
}

interface Scenario {
  situation: string;
  options: string[];
  timeLimit: number; // in milliseconds
}

const scenarios: Scenario[] = [
  {
    situation: "Traffic light turns yellow as you approach",
    options: ["Stop", "Speed up", "Maintain speed"],
    timeLimit: 3000,
  },
  {
    situation: "Pedestrian waiting at unmarked crosswalk",
    options: ["Stop and yield", "Slow down", "Continue"],
    timeLimit: 3000,
  },
  {
    situation: "Car ahead brakes suddenly",
    options: ["Brake hard", "Change lane", "Honk"],
    timeLimit: 3000,
  },
  {
    situation: "Emergency vehicle siren behind you",
    options: ["Pull over right", "Speed up", "Stop immediately"],
    timeLimit: 3000,
  },
  {
    situation: "School zone with children visible",
    options: ["Slow to 20 mph", "Maintain speed", "Stop"],
    timeLimit: 3000,
  },
];

export default function DecisionTest(props: Props) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [decisionTimes, setDecisionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(3000);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false);

  const startScenario = useCallback(() => {
    setStartTime(Date.now());
    setTimeLeft(scenarios[currentScenario].timeLimit);
    setSelectedOption(null);
    setShowFeedback(false);

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    countdownRef.current = interval;
  }, [currentScenario]);

  const handleTimeout = () => {
    // Record max time as penalty
    setDecisionTimes((prev) => [
      ...prev,
      scenarios[currentScenario].timeLimit + 1000,
    ]);
    setShowFeedback(true);
    setTimeout(() => {
      moveToNext();
    }, 1500);
  };

  const handleChoice = (option: string) => {
    if (showFeedback || !startTime) return;

    if (countdownRef.current) clearInterval(countdownRef.current);

    const decisionTime = Date.now() - startTime;
    setDecisionTimes((prev) => [...prev, decisionTime]);
    setSelectedOption(option);
    setShowFeedback(true);

    setTimeout(() => {
      moveToNext();
    }, 1000);
  };

  const moveToNext = () => {
    if (currentScenario + 1 >= scenarios.length) {
      if (!isCompletedRef.current) {
        isCompletedRef.current = true;
        props.onComplete(decisionTimes);
        navigate("/results", { state: { decisionTimes } });
      }
    } else {
      setCurrentScenario((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!isCompletedRef.current && currentScenario < scenarios.length) {
      startScenario();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [currentScenario, startScenario]);

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  return (
    <div className="relative w-full h-screen flex items-center justify-center flex-col text-foreground p-4">
      {/* Progress bar */}
      <div className="absolute top-4 left-0 right-0 mx-auto w-full max-w-md h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="w-full max-w-md p-6 space-y-4 animate-fade-in">
        {/* Timer bar */}
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-100"
            style={{
              width: `${(timeLeft / scenario.timeLimit) * 100}%`,
            }}
          />
        </div>

        {/* Scenario */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Scenario {currentScenario + 1} of {scenarios.length}
          </p>
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            {scenario.situation}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {scenario.options.map((option) => (
            <Button
              key={option}
              onClick={() => handleChoice(option)}
              disabled={showFeedback}
              className={`w-full ${
                showFeedback && selectedOption === option
                  ? "bg-green-600 hover:bg-green-600"
                  : ""
              }`}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center text-sm">
            {selectedOption ? (
              <p className="text-green-400">Decision made!</p>
            ) : (
              <p className="text-red-400">Time's up!</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

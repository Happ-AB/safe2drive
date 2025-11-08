import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";

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
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(3000);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false);
  const decisionTimesRef = useRef<number[]>([]);
  const currentScenarioRef = useRef(0);
  const hasTimedOutRef = useRef(false);

  const moveToNext = useCallback(
    (times?: number[]) => {
      const timesToUse = times || decisionTimesRef.current;
      if (currentScenarioRef.current + 1 >= scenarios.length) {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          props.onComplete(timesToUse);
          navigate("/results", { state: { reactionTimes: timesToUse } });
        }
      } else {
        setCurrentScenario((prev) => {
          const next = prev + 1;
          currentScenarioRef.current = next;
          return next;
        });
      }
    },
    [navigate, props]
  );

  const handleTimeout = useCallback(() => {
    if (hasTimedOutRef.current) return; // Prevent double execution
    hasTimedOutRef.current = true;

    // Record max time as penalty
    const updatedTimes = [
      ...decisionTimesRef.current,
      scenarios[currentScenarioRef.current].timeLimit + 1000,
    ];
    decisionTimesRef.current = updatedTimes;
    setShowFeedback(true);

    console.log(
      "Timeout for scenario",
      currentScenarioRef.current,
      "Times:",
      updatedTimes
    );

    setTimeout(() => {
      moveToNext(updatedTimes);
    }, 1500);
  }, [moveToNext]);

  const startScenario = useCallback(() => {
    console.log("Starting scenario", currentScenarioRef.current);

    hasTimedOutRef.current = false; // Reset timeout flag for new scenario
    setStartTime(Date.now());
    setTimeLeft(scenarios[currentScenarioRef.current].timeLimit);
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
  }, [handleTimeout]);

  const handleChoice = (option: string) => {
    if (showFeedback || !startTime) return;

    if (countdownRef.current) clearInterval(countdownRef.current);

    const decisionTime = Date.now() - startTime;
    const updatedTimes = [...decisionTimesRef.current, decisionTime];
    decisionTimesRef.current = updatedTimes;
    setSelectedOption(option);
    setShowFeedback(true);

    setTimeout(() => {
      moveToNext(updatedTimes);
    }, 1000);
  };

  useEffect(() => {
    currentScenarioRef.current = currentScenario;
    if (!isCompletedRef.current && currentScenario < scenarios.length) {
      // Clear any existing intervals before starting new scenario
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      startScenario();
    }
    return () => {
      const timer = timerRef.current;
      const countdown = countdownRef.current;
      if (timer) clearTimeout(timer);
      if (countdown) clearInterval(countdown);
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

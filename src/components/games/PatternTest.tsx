import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import { TestConfig, type TestScore } from "../../types";

interface Props {
  onComplete: (testScore: TestScore) => void;
}

interface Position {
  x: number;
  y: number;
}

interface PatternScenario {
  type: "lane-merge" | "pedestrian" | "sequence" | "direction-change";
  sequence: Position[];
  options: Position[];
  correctIndex: number;
  icon: string;
}

// Shuffle array helper
const shuffleOptions = (
  options: Position[],
  correctIndex: number
): { options: Position[]; correctIndex: number } => {
  const shuffled = [...options];
  const correctOption = shuffled[correctIndex];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Find new index of correct option
  const newCorrectIndex = shuffled.findIndex(
    (opt) => opt.x === correctOption.x && opt.y === correctOption.y
  );

  return { options: shuffled, correctIndex: newCorrectIndex };
};

// Generate pattern scenarios
const generateScenarios = (): PatternScenario[] => {
  const baseScenarios = [
    // Scenario 1: Car merging pattern (diagonal movement)
    {
      type: "lane-merge" as const,
      sequence: [
        { x: 20, y: 65 },
        { x: 35, y: 50 },
        { x: 50, y: 35 },
      ],
      options: [
        { x: 65, y: 20 }, // Correct - continues diagonal up-right
        { x: 85, y: 45 }, // Wrong - less steep diagonal
        { x: 65, y: 70 }, // Wrong - horizontal
      ],
      correctIndex: 0,
      icon: "🚗",
    },
    // Scenario 2: Pedestrian crossing pattern (straight horizontal)
    {
      type: "pedestrian" as const,
      sequence: [
        { x: 15, y: 50 },
        { x: 35, y: 50 },
        { x: 55, y: 50 },
      ],
      options: [
        { x: 75, y: 50 }, // Correct - continues straight
        { x: 75, y: 25 }, // Wrong - diagonal up
        { x: 75, y: 75 }, // Wrong - diagonal down
      ],
      correctIndex: 0,
      icon: "🚶",
    },
    // Scenario 3: Traffic sequence (grid pattern)
    {
      type: "sequence" as const,
      sequence: [
        { x: 15, y: 40 },
        { x: 35, y: 40 },
        { x: 55, y: 40 },
      ],
      options: [
        { x: 75, y: 40 }, // Correct - continues horizontal
        { x: 75, y: 65 }, // Wrong - diagonal down
        { x: 75, y: 15 }, // Wrong - diagonal up
      ],
      correctIndex: 0,
      icon: "🚙",
    },
    // Scenario 4: Direction change (vertical to horizontal)
    {
      type: "direction-change" as const,
      sequence: [
        { x: 50, y: 15 },
        { x: 50, y: 35 },
        { x: 50, y: 55 },
      ],
      options: [
        { x: 70, y: 50 }, // Wrong - turns right
        { x: 50, y: 75 }, // Correct - continues down
        { x: 30, y: 50 }, // Wrong - turns left
      ],
      correctIndex: 1,
      icon: "🚕",
    },
    // Scenario 5: Cyclist weaving pattern
    {
      type: "lane-merge" as const,
      sequence: [
        { x: 15, y: 55 },
        { x: 35, y: 40 },
        { x: 55, y: 55 },
      ],
      options: [
        { x: 75, y: 40 }, // Correct - continues wave pattern
        { x: 75, y: 65 }, // Wrong - straight line
        { x: 75, y: 15 }, // Wrong - sharp upward
      ],
      correctIndex: 0,
      icon: "🚴",
    },
  ];

  // Shuffle options for each scenario
  return baseScenarios.map((scenario) => {
    const shuffled = shuffleOptions(scenario.options, scenario.correctIndex);
    return {
      ...scenario,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
    };
  });
};

const scenarios = generateScenarios();

export default function PatternTest(props: Props) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(4000);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false);
  const decisionTimesRef = useRef<number[]>([]);
  const correctAnswersRef = useRef(0);
  const currentScenarioRef = useRef(0);
  const hasTimedOutRef = useRef(false);

  const moveToNext = useCallback(
    (times?: number[]) => {
      const timesToUse = times || decisionTimesRef.current;
      if (currentScenarioRef.current + 1 >= scenarios.length) {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;

          const averageTime =
            timesToUse.reduce((sum, t) => sum + t, 0) / timesToUse.length;
          const testScore: TestScore = {
            times: timesToUse,
            averageTime,
            correctAnswers: correctAnswersRef.current,
            totalQuestions: scenarios.length,
            testType: "pattern",
          };

          props.onComplete(testScore);
          navigate("/results", { state: { testScore } });
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
    if (hasTimedOutRef.current) return;
    hasTimedOutRef.current = true;

    const penaltyTime = 1000 + TestConfig.pattern.timeoutPenalty;
    const updatedTimes = [...decisionTimesRef.current, penaltyTime];
    decisionTimesRef.current = updatedTimes;
    setShowFeedback(true);
    setIsCorrect(false);

    if (animationRef.current) clearInterval(animationRef.current);

    console.log(
      "Timeout for scenario",
      currentScenarioRef.current,
      "- Penalty time:",
      penaltyTime
    );

    setTimeout(() => {
      moveToNext(updatedTimes);
    }, 1500);
  }, [moveToNext]);

  const startScenario = useCallback(() => {
    console.log("Starting scenario", currentScenarioRef.current);

    hasTimedOutRef.current = false;
    setStartTime(null); // Don't start timing yet
    setTimeLeft(1000);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setAnimationStep(0);

    // Animate sequence
    let step = 0;
    const animationInterval = setInterval(() => {
      step++;
      setAnimationStep(step);
      if (step > scenarios[currentScenarioRef.current].sequence.length) {
        clearInterval(animationInterval);
        // Start timer only after animation completes
        setStartTime(Date.now());

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
      }
    }, 800);
    animationRef.current = animationInterval;
  }, [handleTimeout]);

  const handleChoice = (optionIndex: number) => {
    if (showFeedback || !startTime) return;

    if (countdownRef.current) clearInterval(countdownRef.current);
    if (animationRef.current) clearInterval(animationRef.current);

    const currentScenarioData = scenarios[currentScenarioRef.current];
    const correct = optionIndex === currentScenarioData.correctIndex;

    if (correct) {
      correctAnswersRef.current += 1;
    }

    let decisionTime = Date.now() - startTime;
    if (!correct) {
      decisionTime += TestConfig.pattern.wrongAnswerPenalty;
    }

    const updatedTimes = [...decisionTimesRef.current, decisionTime];
    decisionTimesRef.current = updatedTimes;
    setSelectedOption(optionIndex);
    setIsCorrect(correct);
    setShowFeedback(true);

    console.log(
      "Scenario",
      currentScenarioRef.current,
      "- Selected:",
      optionIndex,
      "- Correct:",
      correct,
      "- Time:",
      decisionTime
    );

    setTimeout(() => {
      moveToNext(updatedTimes);
    }, 1500);
  };

  useEffect(() => {
    currentScenarioRef.current = currentScenario;
    if (!isCompletedRef.current && currentScenario < scenarios.length) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      startScenario();
    }
    return () => {
      const timer = timerRef.current;
      const countdown = countdownRef.current;
      const animation = animationRef.current;
      if (timer) clearTimeout(timer);
      if (countdown) clearInterval(countdown);
      if (animation) clearInterval(animation);
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
              width: `${(timeLeft / 1000) * 100}%`,
            }}
          />
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Pattern {currentScenario + 1} of {scenarios.length}
          </p>
          {animationStep <= scenario.sequence.length && (
            <p className="text-xs text-blue-400 mb-2">
              Click where {scenario.icon} goes next
            </p>
          )}
        </div>

        {/* Animation Area - Shows sequence then options */}
        <div className="relative h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
          {/* Show sequence with animation */}
          {animationStep <= scenario.sequence.length &&
            scenario.sequence.map((pos, index) => (
              <div
                key={`seq-${index}`}
                className={`absolute flex items-center justify-center text-3xl transition-all duration-500 ${
                  index < animationStep
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-0"
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {scenario.icon}
              </div>
            ))}

          {/* Show clickable options after animation completes */}
          {animationStep > scenario.sequence.length && (
            <>
              {scenario.options.map((pos, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  disabled={showFeedback}
                  className={`absolute flex items-center justify-center text-3xl rounded-full p-2 transition-all duration-200 ${
                    showFeedback && selectedOption === index
                      ? isCorrect
                        ? "bg-green-600 scale-110 ring-4 ring-green-400"
                        : "bg-red-600 scale-110 ring-4 ring-red-400"
                      : "bg-gray-700 hover:bg-gray-600 hover:scale-110 cursor-pointer"
                  } ${showFeedback ? "cursor-not-allowed" : ""}`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-label={`Option ${index + 1}`}
                >
                  {scenario.icon}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center text-sm font-semibold">
            {selectedOption !== null ? (
              isCorrect ? (
                <p className="text-green-400">✓ Correct prediction!</p>
              ) : (
                <p className="text-red-400">✗ Wrong prediction</p>
              )
            ) : (
              <p className="text-red-400">⏱ Time's up!</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

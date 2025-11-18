import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { TestConfig, type TestScore } from "../../types";

interface Props {
  onComplete: (testScore: TestScore) => void;
}

interface StroopItem {
  word: string; // The color word to display
  color: string; // The actual color of the text
  correctAnswer: string; // The color user should click
}

// Color options
const colors = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
];

// Generate Stroop items with conflicts
const generateStroopItems = (count: number): StroopItem[] => {
  const items: StroopItem[] = [];

  for (let i = 0; i < count; i++) {
    const wordColor = colors[Math.floor(Math.random() * colors.length)];
    let textColor = colors[Math.floor(Math.random() * colors.length)];

    // Ensure conflict (word and color are different)
    while (textColor.name === wordColor.name) {
      textColor = colors[Math.floor(Math.random() * colors.length)];
    }

    items.push({
      word: wordColor.name.toUpperCase(),
      color: textColor.hex,
      correctAnswer: textColor.name,
    });
  }

  return items;
};

const stroopItems = generateStroopItems(5);

export default function StroopTest(props: Props) {
  const [currentItem, setCurrentItem] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(3000);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false);
  const decisionTimesRef = useRef<number[]>([]);
  const correctAnswersRef = useRef(0);
  const currentItemRef = useRef(0);
  const hasTimedOutRef = useRef(false);

  const moveToNext = useCallback(
    (times?: number[]) => {
      const timesToUse = times || decisionTimesRef.current;
      if (currentItemRef.current + 1 >= stroopItems.length) {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;

          // Create TestScore object
          const averageTime =
            timesToUse.reduce((sum, t) => sum + t, 0) / timesToUse.length;
          const testScore: TestScore = {
            times: timesToUse,
            averageTime,
            correctAnswers: correctAnswersRef.current,
            totalQuestions: stroopItems.length,
            testType: "stroop",
          };

          props.onComplete(testScore);
          navigate("/results", { state: { testScore } });
        }
      } else {
        setCurrentItem((prev) => {
          const next = prev + 1;
          currentItemRef.current = next;
          return next;
        });
      }
    },
    [navigate, props]
  );

  const handleTimeout = useCallback(() => {
    if (hasTimedOutRef.current) return;
    hasTimedOutRef.current = true;

    const penaltyTime = stroopItems[currentItemRef.current]
      ? 3000 + TestConfig.stroop.timeoutPenalty
      : 4000;
    const updatedTimes = [...decisionTimesRef.current, penaltyTime];
    decisionTimesRef.current = updatedTimes;
    setShowFeedback(true);
    setIsCorrect(false);

    console.log(
      "Timeout for item",
      currentItemRef.current,
      "- Penalty time:",
      penaltyTime
    );

    setTimeout(() => {
      moveToNext(updatedTimes);
    }, 1500);
  }, [moveToNext]);

  const startItem = useCallback(() => {
    console.log("Starting item", currentItemRef.current);

    hasTimedOutRef.current = false;
    setStartTime(Date.now());
    setTimeLeft(3000);
    setSelectedOption(null);
    setIsCorrect(null);
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

    const currentItemData = stroopItems[currentItemRef.current];
    const correct = option === currentItemData.correctAnswer;

    if (correct) {
      correctAnswersRef.current += 1;
    }

    let decisionTime = Date.now() - startTime;
    if (!correct) {
      decisionTime += TestConfig.stroop.wrongAnswerPenalty;
    }

    const updatedTimes = [...decisionTimesRef.current, decisionTime];
    decisionTimesRef.current = updatedTimes;
    setSelectedOption(option);
    setIsCorrect(correct);
    setShowFeedback(true);

    console.log(
      "Item",
      currentItemRef.current,
      "- Answer:",
      option,
      "- Correct:",
      correct,
      "- Time:",
      decisionTime
    );

    setTimeout(() => {
      moveToNext(updatedTimes);
    }, 1000);
  };

  useEffect(() => {
    currentItemRef.current = currentItem;
    if (!isCompletedRef.current && currentItem < stroopItems.length) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      startItem();
    }
    return () => {
      const timer = timerRef.current;
      const countdown = countdownRef.current;
      if (timer) clearTimeout(timer);
      if (countdown) clearInterval(countdown);
    };
  }, [currentItem, startItem]);

  const item = stroopItems[currentItem];
  const progress = ((currentItem + 1) / stroopItems.length) * 100;

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
              width: `${(timeLeft / 3000) * 100}%`,
            }}
          />
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">
            Item {currentItem + 1} of {stroopItems.length}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Click the <strong>COLOR</strong> of the text (not the word)
          </p>
        </div>

        {/* Stroop Word */}
        <div className="text-center py-8">
          <h2 className="text-6xl font-bold" style={{ color: item.color }}>
            {item.word}
          </h2>
        </div>

        {/* Color Options */}
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <Button
              key={color.name}
              onClick={() => handleChoice(color.name)}
              disabled={showFeedback}
              className={`w-full ${
                showFeedback && selectedOption === color.name
                  ? isCorrect
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-red-600 hover:bg-red-600"
                  : ""
              }`}
            >
              {color.name}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="text-center text-sm font-semibold">
            {selectedOption ? (
              isCorrect ? (
                <p className="text-green-400">✓ Correct!</p>
              ) : (
                <p className="text-red-400">✗ Wrong color</p>
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

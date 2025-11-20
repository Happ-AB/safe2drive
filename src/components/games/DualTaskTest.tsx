import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import type { TestScore } from "../../types";

interface Props {
  onComplete: (testScore: TestScore) => void;
}

interface ColorChallenge {
  color: "red" | "blue";
  expectedSide: "left" | "right";
  appearTime: number;
}

export default function DualTaskTest(props: Props) {
  const [started, setStarted] = useState(false);
  const [ballPosition, setBallPosition] = useState(50); // percentage from bottom
  const [isFalling, setIsFalling] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);
  const [currentChallenge, setCurrentChallenge] =
    useState<ColorChallenge | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);

  const navigate = useNavigate();
  const startTimeRef = useRef<number | null>(null);
  const lastBounceTimeRef = useRef<number>(0);
  const bounceIntervalsRef = useRef<number[]>([]);
  const challengeResponsesRef = useRef<number[]>([]);
  const correctResponsesRef = useRef(0);
  const totalChallengesRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const challengeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false);

  const GAME_DURATION = 15000; // 15 seconds
  const CHALLENGE_INTERVAL = 3000; // Show color challenge every 3 seconds

  const finishGame = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (challengeTimerRef.current) clearTimeout(challengeTimerRef.current);
    if (gameTimerRef.current) clearTimeout(gameTimerRef.current);

    // Calculate rhythm consistency (lower variance = better)
    const avgInterval =
      bounceIntervalsRef.current.reduce((a, b) => a + b, 0) /
      bounceIntervalsRef.current.length;
    const variance =
      bounceIntervalsRef.current.reduce((acc, interval) => {
        return acc + Math.pow(interval - avgInterval, 2);
      }, 0) / bounceIntervalsRef.current.length;
    const stdDeviation = Math.sqrt(variance);

    // Calculate challenge response time average
    const avgChallengeResponse =
      challengeResponsesRef.current.length > 0
        ? challengeResponsesRef.current.reduce((a, b) => a + b, 0) /
          challengeResponsesRef.current.length
        : 0;

    // Combined score: rhythm consistency + challenge accuracy + challenge speed
    const rhythmScore = stdDeviation; // Lower is better
    const challengeScore = avgChallengeResponse; // Lower is better
    const combinedScore = rhythmScore + challengeScore;

    const testScore: TestScore = {
      times: [combinedScore],
      averageTime: combinedScore,
      correctAnswers: correctResponsesRef.current,
      totalQuestions: totalChallengesRef.current,
      testType: "dual-task",
    };

    console.log("Dual Task Results:", {
      bounces: bounceCount,
      avgInterval,
      stdDeviation: rhythmScore,
      challengeAccuracy: `${correctResponsesRef.current}/${totalChallengesRef.current}`,
      avgChallengeResponse,
      combinedScore,
      breakdown: {
        rhythmConsistency: `${rhythmScore.toFixed(0)}ms`,
        avgChallengeSpeed: `${challengeScore.toFixed(0)}ms`,
        total: `${combinedScore.toFixed(0)}ms`,
        threshold: "1500ms",
      },
    });

    // Store breakdown in localStorage for Results page
    localStorage.setItem(
      "dualTaskBreakdown",
      JSON.stringify({
        rhythmScore: Math.round(rhythmScore),
        challengeScore: Math.round(challengeScore),
        combinedScore: Math.round(combinedScore),
        bounces: bounceCount,
        avgInterval: Math.round(avgInterval),
      })
    );

    props.onComplete(testScore);
    navigate("/results", { state: { testScore } });
  }, [bounceCount, navigate, props]);

  const generateChallenge = useCallback(() => {
    const colors: Array<"red" | "blue"> = ["red", "blue"];
    const color = colors[Math.floor(Math.random() * 2)];
    const expectedSide = color === "red" ? "left" : "right";

    setCurrentChallenge({
      color,
      expectedSide,
      appearTime: Date.now(),
    });
    totalChallengesRef.current += 1;
  }, []);

  const handleBounce = useCallback(() => {
    if (!started) {
      setStarted(true);
      startTimeRef.current = Date.now();
      lastBounceTimeRef.current = Date.now();
      setIsFalling(true);

      // Start game timer
      gameTimerRef.current = setTimeout(() => {
        finishGame();
      }, GAME_DURATION);

      // Schedule first challenge
      challengeTimerRef.current = setTimeout(() => {
        generateChallenge();
      }, CHALLENGE_INTERVAL);

      return;
    }

    const now = Date.now();
    const interval = now - lastBounceTimeRef.current;
    bounceIntervalsRef.current.push(interval);
    lastBounceTimeRef.current = now;

    setBounceCount((prev) => prev + 1);
    setBallPosition(50); // Reset to middle
    setIsFalling(true);
  }, [started, generateChallenge, finishGame]);

  const handleSideChoice = (side: "left" | "right") => {
    if (!currentChallenge) return;

    const responseTime = Date.now() - currentChallenge.appearTime;
    challengeResponsesRef.current.push(responseTime);

    const correct = side === currentChallenge.expectedSide;
    if (correct) {
      correctResponsesRef.current += 1;
    }

    setFeedbackCorrect(correct);
    setShowFeedback(true);
    setCurrentChallenge(null);

    setTimeout(() => {
      setShowFeedback(false);
    }, 500);

    // Schedule next challenge
    if (challengeTimerRef.current) clearTimeout(challengeTimerRef.current);
    challengeTimerRef.current = setTimeout(() => {
      if (!isCompletedRef.current) {
        generateChallenge();
      }
    }, CHALLENGE_INTERVAL);
  };

  // Ball physics
  useEffect(() => {
    if (!isFalling) return;

    const startTime = Date.now();
    const duration = 800; // Fall duration

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in quadratic for gravity effect
      const newPosition = 50 - 50 * progress * progress;
      setBallPosition(newPosition);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsFalling(false);
        // Ball hit ground - game over if not bounced
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFalling]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (challengeTimerRef.current) clearTimeout(challengeTimerRef.current);
      if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    };
  }, []);

  const timeLeft =
    started && startTimeRef.current
      ? Math.max(0, GAME_DURATION - (Date.now() - startTimeRef.current))
      : GAME_DURATION;

  return (
    <div className="relative w-full flex items-center justify-center flex-col text-foreground p-4">
      <Card className="w-full max-w-md p-6 space-y-4 animate-fade-in">
        {/* Timer and Score */}
        <div className="flex justify-between text-sm text-gray-400">
          <span>Bounces: {bounceCount}</span>
          <span>Time: {Math.ceil(timeLeft / 1000)}s</span>
          <span>
            Score: {correctResponsesRef.current}/{totalChallengesRef.current}
          </span>
        </div>

        {/* Instructions */}
        {!started && (
          <div className="text-center space-y-2 mb-4">
            <p className="text-sm text-gray-300">
              Tap the ball to keep it bouncing at a steady rhythm
            </p>
            <p className="text-xs text-gray-400">
              When you see a color, tap the matching side:
            </p>
            <p className="text-xs">
              <span className="text-red-400">🔴 Red = Left</span> •{" "}
              <span className="text-blue-400">🔵 Blue = Right</span>
            </p>
          </div>
        )}

        {/* Game Area */}
        <div className="relative h-64 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
          {/* Ball */}
          <button
            onClick={handleBounce}
            className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-2xl transition-all cursor-pointer hover:scale-110 active:scale-95"
            style={{
              bottom: `${ballPosition}%`,
            }}
          >
            ⚽
          </button>

          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600" />

          {/* Color Challenge */}
          {currentChallenge && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
              <div
                className={`text-6xl mb-2 ${
                  currentChallenge.color === "red"
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              >
                {currentChallenge.color === "red" ? "🔴" : "🔵"}
              </div>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <p
                className={`text-2xl font-bold ${
                  feedbackCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                {feedbackCorrect ? "✓ Correct!" : "✗ Wrong"}
              </p>
            </div>
          )}
        </div>

        {/* Side Buttons */}
        {currentChallenge && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSideChoice("left")}
              className="py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              ← Left (Red)
            </button>
            <button
              onClick={() => handleSideChoice("right")}
              className="py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Right (Blue) →
            </button>
          </div>
        )}

        {/* Start Button */}
        {!started && (
          <button
            onClick={handleBounce}
            className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            Start Test
          </button>
        )}
      </Card>
    </div>
  );
}

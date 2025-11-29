import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import type { TestScore } from "../../types";

interface Props {
  onComplete: (testScore: TestScore) => void;
}

type Question = {
  num1: number;
  num2: number;
  type: "bigger" | "smaller";
};

export default function NumberComparisonTest({ onComplete }: Props) {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResponse, setLastResponse] = useState<{
    time: number;
    correct: boolean;
  } | null>(null);

  const totalRounds = 5;

  // Generate a random number between -9999 and 9999
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 19999) - 9999;
  };

  // Generate a new question
  const generateQuestion = useCallback((): Question => {
    const num1 = generateRandomNumber();
    let num2 = generateRandomNumber();

    // Ensure the numbers are different
    while (num2 === num1) {
      num2 = generateRandomNumber();
    }

    const type = Math.random() < 0.5 ? "bigger" : "smaller";

    return { num1, num2, type };
  }, []);

  // Start a new round
  const startRound = useCallback(() => {
    const newQuestion = generateQuestion();
    setQuestion(newQuestion);
    setStartTime(Date.now());
  }, [generateQuestion]);

  // Handle answer selection
  const handleAnswer = (selectedNum: number) => {
    if (!question || !started || showFeedback) return;

    const responseTime = Date.now() - startTime;
    const { num1, num2, type } = question;

    // Determine the correct answer
    const correctNum =
      type === "bigger" ? Math.max(num1, num2) : Math.min(num1, num2);

    const isCorrect = selectedNum === correctNum;

    // Calculate new correct count
    const newCorrectCount = isCorrect ? correctAnswers + 1 : correctAnswers;

    // Add penalty for wrong answers (2000ms)
    const penalty = isCorrect ? 0 : 2000;
    const finalTime = responseTime + penalty;

    const newTimes = [...times, finalTime];

    // Show feedback
    setLastResponse({ time: responseTime, correct: isCorrect });
    setShowFeedback(true);

    // Move to next round or finish after delay
    setTimeout(() => {
      setShowFeedback(false);
      setLastResponse(null);

      if (currentRound + 1 < totalRounds) {
        setTimes(newTimes);
        setCorrectAnswers(newCorrectCount);
        setCurrentRound((prev) => prev + 1);
        startRound();
      } else {
        finishTest(newTimes, newCorrectCount);
      }
    }, 1200);
  };

  // Finish the test
  const finishTest = (allTimes: number[], totalCorrect: number) => {
    const averageTime =
      allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length;

    const testScore: TestScore = {
      times: allTimes,
      averageTime,
      correctAnswers: totalCorrect,
      totalQuestions: totalRounds,
      testType: "number-comparison",
    };

    onComplete(testScore);
    navigate("/results", { state: { testScore } });
  };

  // Start the test
  useEffect(() => {
    if (!started) {
      setStarted(true);
      startRound();
    }
  }, [started, startRound]);

  if (!question) {
    return (
      <Card className="p-8 text-center">
        <p>Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-muted mb-2">
          Round {currentRound + 1} / {totalRounds}
        </p>
        <h2 className="text-2xl font-bold mb-4">
          Which is {question.type.toUpperCase()}?
        </h2>
      </div>

      {showFeedback && lastResponse ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div
            className={`text-6xl font-bold ${
              lastResponse.correct ? "text-green-400" : "text-red-400"
            }`}
          >
            {lastResponse.correct ? "✓" : "✗"}
          </div>
          <div className="text-2xl font-bold">{lastResponse.time}ms</div>
          <div
            className={`text-sm font-semibold ${
              lastResponse.time < 2000
                ? "text-green-400"
                : lastResponse.time < 3000
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {lastResponse.time < 2000
              ? "Fast reaction!"
              : lastResponse.time < 3000
              ? "Good, but can be faster"
              : "Too slow!"}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => handleAnswer(question.num1)}
              variant="default"
              className="text-4xl font-bold py-8"
              fullWidth
            >
              {question.num1}
            </Button>
            <Button
              onClick={() => handleAnswer(question.num2)}
              variant="default"
              className="text-4xl font-bold py-8"
              fullWidth
            >
              {question.num2}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-muted">
            <p>
              Correct: {correctAnswers} / {Math.max(currentRound, 1)}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

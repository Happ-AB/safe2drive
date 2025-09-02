import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onComplete: (reactionTimes: number[]) => void;
}

export default function ReactionTest({ onComplete }: Props) {
  const [stage, setStage] = useState<"waiting" | "active" | "clicked">(
    "waiting"
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [trial, setTrial] = useState(1);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false); // Prevent multiple completions

  const startTest = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      setPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
      setStage("active");
      setStartTime(Date.now());
    }, Math.random() * 3000 + 2000); // 2-5s delay
  }, []);

  useEffect(() => {
    if (trial > 3 && !isCompletedRef.current) {
      isCompletedRef.current = true; // Mark as completed
      if (timerRef.current) clearTimeout(timerRef.current);
      onComplete(reactionTimes);
      navigate("/results", { state: { reactionTimes } }); // Pass reactionTimes instead
      return;
    }
    if (stage === "waiting" && !isCompletedRef.current) {
      startTest();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, trial, startTest, onComplete, navigate, reactionTimes]); // Removed reactionTimes from deps

  const handleClick = () => {
    if (stage !== "active" || isCompletedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const reactionTime = Date.now() - (startTime || 0);
    setReactionTimes((prev) => [...prev, reactionTime]);
    setStage("clicked");
    setTimeout(() => {
      setStage("waiting");
      setTrial((prev) => prev + 1);
    }, 1000);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
      {stage === "waiting" && (
        <p className="text-xl">
          Get ready... Click the circle when it appears!
        </p>
      )}
      {stage === "active" && (
        <div
          className="w-20 h-20 bg-blue-600 rounded-full cursor-pointer"
          style={{ position: "absolute", left: position.x, top: position.y }}
          onClick={handleClick}
        />
      )}
      {stage === "clicked" && (
        <p className="text-xl">
          Good! {trial < 3 ? `${3 - trial} more to go.` : "Test complete!"}
        </p>
      )}
      {trial <= 3 && (
        <p className="absolute top-4 left-4 text-lg">Trial {trial}/3</p>
      )}
    </div>
  );
}

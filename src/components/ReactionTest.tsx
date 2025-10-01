import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import Button from "./ui/Button";

interface Props {
  onComplete: (reactionTimes: number[]) => void;
}

export default function ReactionTest(props: Props) {
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
      isCompletedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      props.onComplete(reactionTimes);
      navigate("/results", { state: { reactionTimes } });
      return;
    }
    if (stage === "waiting" && !isCompletedRef.current) {
      startTest();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, trial, startTest, navigate, reactionTimes, props]);

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
    <div className="relative w-full h-screen flex items-center justify-center flex-col text-foreground">
      {trial < 2 && stage === "waiting" && (
        <Card className="text-base md:text-lg self-center w-72 p-4 text-center animate-fade-in">
          Get ready... Click the circle when it appears!
        </Card>
      )}
      {stage === "active" && (
        <div
          className="w-20 h-20 rounded-full cursor-pointer shadow-glow"
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            background: "radial-gradient(circle at 30% 30%, #60a5fa, #2563eb)",
          }}
          onClick={handleClick}
        />
      )}
      {stage === "clicked" && (
        <Card className="text-base md:text-lg w-72 p-4 text-center">
          Good! {trial < 3 ? `${3 - trial} more to go.` : "Test complete!"}
        </Card>
      )}
    </div>
  );
}

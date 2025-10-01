import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";

interface Props {
  onComplete: () => void;
}

export default function Countdown({ onComplete }: Props) {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) {
      onComplete();
      navigate("/test");
      return;
    }
    const timer = setInterval(() => setCount(count - 1), 1000);
    return () => clearInterval(timer);
  }, [count, onComplete, navigate]);

  const progress = useMemo(() => ((3 - count) / 3) * 100, [count]);

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-8 text-center w-72 animate-slide-up">
        <div className="text-5xl font-extrabold">{count}</div>
        <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-muted">Starting reaction test...</p>
      </Card>
    </div>
  );
}

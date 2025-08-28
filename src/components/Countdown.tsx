import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="flex items-center justify-center h-full text-6xl font-bold">
      {count}
    </div>
  );
}

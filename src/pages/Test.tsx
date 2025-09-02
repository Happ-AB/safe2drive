import ReactionTest from "../components/ReactionTest";
import { useTestLogic } from "../hooks/useTestLogic";

export default function Test() {
  const { evaluateTest } = useTestLogic(); // Only use evaluateTest

  return (
    <div className="flex items-center justify-center h-full">
      <ReactionTest onComplete={evaluateTest} />
    </div>
  );
}

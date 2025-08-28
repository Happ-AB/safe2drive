import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { UserData } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTestLogic } from "../hooks/useTestLogic";

export default function Test() {
  const [userData] = useLocalStorage<UserData>("userData", {
    height: null,
    weight: null,
    alcoholUnits: 0,
  });
  const { result, runTest } = useTestLogic(userData.alcoholUnits);
  const navigate = useNavigate();

  useEffect(() => {
    runTest();
    if (result) {
      navigate("/results", { state: { result } });
    }
  }, [result, runTest, navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-xl">Running Test...</p>
    </div>
  );
}

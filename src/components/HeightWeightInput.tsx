import { useState } from "react";
import type { UserData } from "../types";

interface Props {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export default function HeightWeightInput({ userData, setUserData }: Props) {
  const [height, setHeight] = useState(userData.height || "");
  const [weight, setWeight] = useState(userData.weight || "");

  const handleSave = () => {
    setUserData({
      ...userData,
      height: Number(height),
      weight: Number(weight),
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Height (cm)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          placeholder="e.g., 170"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Weight (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          placeholder="e.g., 70"
        />
      </div>
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}

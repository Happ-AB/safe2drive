import { useState } from "react";
import type { Gender, UserData } from "../types";

interface Props {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export default function PersonalInput({ userData, setUserData }: Props) {
  const [age, setAge] = useState(userData.age || "");
  const [weight, setWeight] = useState(userData.weight || "");
  const [gender, setGender] = useState(userData.gender || undefined);

  const handleSave = () => {
    setUserData({
      ...userData,
      age: Number(age),
      weight: Number(weight),
      gender,
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
      <div className="mb-4">
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          placeholder="Age"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          placeholder="Weight (kg)"
        />
      </div>
      <div className="mb-4">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="">Select Gender</option>
          <option value="male">♂</option>
          <option value="female">♀</option>
          <option value="other">⚤</option>
        </select>
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

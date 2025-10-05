import { useState } from "react";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";
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
    <Card className="p-6 animate-slide-up">
      <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
      <div className="space-y-4">
        <Input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          fullWidth
        />
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (kg)"
          fullWidth
        />
        <Select
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          fullWidth
          className="border rounded-md p-2 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary transition"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Button onClick={handleSave} variant="primary" fullWidth>
          Save
        </Button>
      </div>
    </Card>
  );
}

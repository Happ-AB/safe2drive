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
    const ageNum = Number(age);
    const weightNum = Number(weight);

    setUserData({
      ...userData,
      age: ageNum,
      weight: weightNum,
      gender,
    });
  };

  return (
    <Card className="p-6 animate-slide-up">
      <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
      <div className="space-y-4">
        <Input
          type="text"
          inputMode="numeric"
          value={age}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.startsWith("0")) {
              value = value.replace(/^0+/, "");
            }
            setAge(value);
          }}
          placeholder="Age"
          fullWidth
          className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Input
          type="text"
          inputMode="numeric"
          value={weight}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.startsWith("0")) {
              value = value.replace(/^0+/, "");
            }
            setWeight(value);
          }}
          placeholder="Weight (kg)"
          fullWidth
          className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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

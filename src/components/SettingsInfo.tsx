import { useState, useEffect } from "react";
import { clearLocalStorage } from "../helpers/functions";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Select from "./ui/Select";

const availableTests = [
  { name: "Random (Default)", key: "random" },
  { name: "Reaction Test", key: "reaction" },
  { name: "Decision Test", key: "decision" },
  { name: "Stroop Test", key: "stroop" },
  { name: "Number Comparison Test", key: "number-comparison" },
];

export default function SettingsInfo() {
  const [selectedTestKey, setSelectedTestKey] = useState("random");

  useEffect(() => {
    // Load saved test preference
    const saved = localStorage.getItem("debugTestSelection");
    if (saved) {
      setSelectedTestKey(saved);
    }
  }, []);

  const handleTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTestKey(value);
    localStorage.setItem("debugTestSelection", value);
  };

  const handleResetData = () => {
    clearLocalStorage();
    window.location.href = "/";
  };
  return (
    <Card className="p-6 animate-slide-up">
      <h2 className="text-lg font-semibold mb-4">Settings & Info</h2>
      <div className="mb-6">
        <h3 className="font-medium">How Tests Work</h3>
        <p className="text-sm text-muted">
          Our tests assess your reaction time and coordination to estimate your
          ability to drive safely. Results are{" "}
          <span className="font-bold">RECOMMENDATIONS ONLY</span> based on your
          inputs and test performance.
        </p>
      </div>
      <div className="mb-6">
        <h3 className="font-medium">Privacy Info</h3>
        <p className="text-sm text-muted">
          Your data is stored locally on your device and never shared. We
          prioritize your privacy.
        </p>
      </div>
      <div className="mb-6">
        <Button onClick={handleResetData} variant="danger">
          Reset Data
        </Button>
      </div>
      <div className="mb-6">
        <h3 className="font-medium mb-2">Debug: Test Selection</h3>
        <Select
          value={selectedTestKey}
          onChange={handleTestChange}
          fullWidth
          className="border rounded-md p-2 w-full text-base focus:outline-none focus:ring-2 focus:ring-primary transition"
        >
          {availableTests.map((test) => (
            <option key={test.key} value={test.key}>
              {test.name}
            </option>
          ))}
        </Select>
        <p className="text-xs text-muted mt-1">
          For testing purposes. Select "Random" for normal behavior.
        </p>
      </div>
      <div>
        <h3 className="font-medium">About</h3>
        <p className="text-sm text-muted">
          Fit2Drive helps you make responsible driving decisions. Version 1.0.
        </p>
      </div>
    </Card>
  );
}

import { useState } from "react";

export default function SettingsInfo() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Settings & Info</h2>
      <div className="mb-4">
        <h3 className="font-medium">How Tests Work</h3>
        <p className="text-sm text-gray-600">
          Our tests assess your reaction time and coordination to estimate your
          ability to drive safely. Results are based on your inputs and test
          performance.
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-medium">Privacy Info</h3>
        <p className="text-sm text-gray-600">
          Your data is stored locally on your device and never shared. We
          prioritize your privacy.
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-medium">Settings</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
          />
          Sound
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={vibrationEnabled}
            onChange={() => setVibrationEnabled(!vibrationEnabled)}
          />
          Vibration
        </label>
      </div>
      <div>
        <h3 className="font-medium">About</h3>
        <p className="text-sm text-gray-600">
          SafeDrive helps you make responsible driving decisions. Version 1.0.
        </p>
      </div>
    </div>
  );
}

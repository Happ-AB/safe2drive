import { clearLocalStorage } from "../hooks/useLocalStorage";

export default function SettingsInfo() {
  const handleResetData = () => {
    clearLocalStorage();
    window.location.href = "/";
  };
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Settings & Info</h2>
      <div className="mb-4">
        <h3 className="font-medium">How Tests Work</h3>
        <p className="text-sm text-gray-600">
          Our tests assess your reaction time and coordination to estimate your
          ability to drive safely. Results are{" "}
          <span className="font-bold">RECOMMENDATIONS ONLY</span> based on your
          inputs and test performance.
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
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleResetData}
        >
          Reset Data
        </button>
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

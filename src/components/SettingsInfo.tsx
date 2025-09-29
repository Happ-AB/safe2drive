import { clearLocalStorage } from "../helpers/functions";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function SettingsInfo() {
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
      <div>
        <h3 className="font-medium">About</h3>
        <p className="text-sm text-muted">
          Fit2Drive helps you make responsible driving decisions. Version 1.0.
        </p>
      </div>
    </Card>
  );
}

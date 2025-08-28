import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/24/outline";
import { clearLocalStorage } from "../hooks/useLocalStorage";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-semibold">Safe2Drive</h1>
      {process.env.NODE_ENV === "development" && (
        <button
          className="text-white bg-gray-400 p-2 rounded"
          onClick={clearLocalStorage}
        >
          <div className="text-sm">clear LS</div>
        </button>
      )}
      <Link to="/settings">
        <CogIcon className="h-6 w-6 text-white" />
      </Link>
    </nav>
  );
}

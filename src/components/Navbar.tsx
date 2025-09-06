import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-semibold">
        <Link to="/">Safe2Drive</Link>
      </h1>
      <Link to="/settings">
        <CogIcon className="h-6 w-6 text-white" />
      </Link>
    </nav>
  );
}

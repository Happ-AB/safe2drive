import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40">
      <div className="container py-3">
        <div className="card px-4 py-2 flex items-center justify-between">
          <h1 className="text-base md:text-lg font-semibold tracking-tight">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="logo" className="h-5" />
            </Link>
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/settings" className="btn btn-primary h-9 px-3">
              <CogIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import { CogIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSettingsPage = location.pathname === "/settings";

  const handleIconClick = () => {
    if (isSettingsPage) {
      navigate(-1); // Go back to previous route
    }
  };

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
            {isSettingsPage ? (
              <button
                onClick={handleIconClick}
                className="btn btn-primary h-9 px-3"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            ) : (
              <Link to="/settings" className="btn btn-primary h-9 px-3">
                <CogIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

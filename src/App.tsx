import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import StartInfo from "./pages/StartInfo";
import Test from "./pages/Test";
import Results from "./pages/Results";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col text-foreground">
        <Navbar />
        <main className="flex-1 container py-6 md:py-10 animate-fade-in">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/start" element={<StartInfo />} />
            <Route path="/test" element={<Test />} />
            <Route path="/results" element={<Results />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

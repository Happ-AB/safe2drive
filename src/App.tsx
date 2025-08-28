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
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/start" element={<StartInfo />} />
          <Route path="/test" element={<Test />} />
          <Route path="/results" element={<Results />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

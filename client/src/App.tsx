import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardProvider } from "./context/DashboardContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
import Contact from "./pages/Contact";

function AppWrapper() {
  return (
    <>
      <div className="min-h-screen text-gray-900 dark:text-white relative z-10">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="*"
            element={
              <div className="text-center p-10 text-xl text-gray-600 dark:text-gray-400">
                404 – Page Not Found
              </div>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <Router>
        <AppWrapper />
      </Router>
    </DashboardProvider>
  );
}

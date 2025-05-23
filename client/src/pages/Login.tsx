import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ImageSegmentGrid from "../components/ImageSegmentGrid";
import api from "../utils/axiosInstance";
import HomeButton from "../components/HomeButton";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [segments, setSegments] = useState<number[]>([]);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"LOGIN" | "VERIFY">("LOGIN");

  const navigate = useNavigate();

  useEffect(() => {
    if (step === "VERIFY" && username) {
      api
        .get(`/auth/user-image/${username}`)
        .then((res) => {
          setImageUrl(import.meta.env.VITE_API_BASE + res.data.imageUrl);
        })
        .catch(() => {
          toast.error("Failed to fetch image");
          setImageUrl(null);
        });

      api
        .get(`/auth/user-phone/${username}`)
        .then((res) => setPhone(res.data.phone))
        .catch(() => {
          toast.error("Failed to fetch phone");
          setPhone("");
        });
    }
  }, [step, username]);

  const handleSegmentClick = (index: number) => {
    setSegments((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleLogin = async () => {
    if (!username || !password) return toast.error("Please fill all fields.");

    try {
      const res = await api.post("/auth/login", { username, password });

      if (res.data === "OTP_SENT") {
        toast.success("OTP sent! Proceed to verification.");
        setStep("VERIFY");
      } else {
        toast.error("Unexpected response.");
      }
    } catch (err) {
      toast.error("Login failed.");
      console.error("Login error:", err);
    }
  };

  const verifyOtpAndGrid = async () => {
    if (!otp || segments.length < 3) {
      return toast.error("Enter OTP and select at least 3 segments.");
    }

    try {
      const ip = await (await fetch("https://api.ipify.org?format=json")).json();

      const res = await api.post("/auth/verify-otp-grid", {
        username,
        phone,
        otp,
        segments,
        ip: ip.ip,
      });

      if (res.data.message === "LOGIN_SUCCESS") {
        toast.success(`Welcome ${res.data.username}!`);
        localStorage.setItem("auth", "true");
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        toast.error("Verification failed.");
      }
    } catch (err) {
      toast.error("OTP or graphical password incorrect.");
      console.error("Verify error:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-20"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md -z-10" />

      {/* Card */}
      <div className="z-10 w-full max-w-xl bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl px-8 py-10">
        <Toaster />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Login to <span className="text-pink-400">PicPass</span>
          </h2>

          {step === "LOGIN" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded placeholder-gray-300"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded placeholder-gray-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
              >
                Login
              </button>
            </div>
          )}

          {step === "VERIFY" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded placeholder-gray-300"
              />

              {imageUrl && (
                <ImageSegmentGrid
                  previewUrl={imageUrl}
                  selectedSegments={segments}
                  onSegmentClick={handleSegmentClick}
                  onClear={() => setSegments([])}
                />
              )}

              <p className="text-sm text-gray-300 text-center">
                {segments.length} segments selected
              </p>

              <button
                onClick={verifyOtpAndGrid}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
              >
                Verify & Login
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <a href="/signup" className="text-pink-400 underline hover:text-pink-300">
              Sign Up
            </a>
          </p>
        </motion.div>
      </div>

      <HomeButton />
    </div>
  );
}

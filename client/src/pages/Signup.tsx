import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageSegmentGrid from "../components/ImageSegmentGrid";
import HomeButton from "../components/HomeButton";
import BASE_URL from "../utils/apiBase"; // ✅ Dynamic API URL

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    backupEmail: "",
    mfaEnabled: false,
  });

  const [countryCode, setCountryCode] = useState("+91");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [segments, setSegments] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return toast.error("Upload a valid image.");
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSegmentClick = (index: number) => {
    setSegments((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone: string) => /^\+?\d{10,15}$/.test(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = form.phone.startsWith("+") ? form.phone : `${countryCode}${form.phone}`;

    if (!form.username || !form.email || !form.password || !image) {
      return toast.error("Fill all required fields.");
    }
    if (!isValidEmail(form.email)) {
      return toast.error("Invalid email address.");
    }
    if (!isValidPhone(phone)) {
      return toast.error("Invalid phone number.");
    }
    if (segments.length < 3) {
      return toast.error("Select at least 3 segments.");
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries({ ...form, phone }).forEach(([key, value]) =>
        data.append(key, value.toString())
      );
      data.append("image", image);
      data.append("segments", JSON.stringify(segments));

      await axios.post(`${BASE_URL}/auth/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Signup successful!");
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Signup error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Signup failed.");
      } else if (error instanceof Error) {
        console.error("❌ Signup error:", error.message);
        toast.error("Signup failed.");
      } else {
        console.error("❌ Signup error:", error);
        toast.error("Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans">
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

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-white/10 backdrop-blur-lg bg-white/5">
        <div className="hidden md:flex items-center justify-center px-10 py-20 bg-black/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Join <span className="text-pink-500">PicPass</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-sm mx-auto">
              Your secure vault for files, documents & passwords. Visual login + OTP for maximum protection.
            </p>
          </motion.div>
        </div>

        <div className="p-8 md:p-10 overflow-y-auto">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-semibold text-white text-center mb-6"
          >
            Create Account
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleInputChange}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded w-full placeholder-gray-300"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleInputChange}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded w-full placeholder-gray-300"
                required
              />
            </div>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 text-white px-4 py-2 rounded placeholder-gray-300"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 text-white px-4 py-2 rounded placeholder-gray-300"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-2 rounded placeholder-gray-300 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-white/10 text-white px-4 py-2 rounded border border-white/20"
              />
            </div>

            {preview && (
              <ImageSegmentGrid
                previewUrl={preview}
                selectedSegments={segments}
                onSegmentClick={handleSegmentClick}
                onClear={() => setSegments([])}
              />
            )}

            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleInputChange}
                className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-2 rounded placeholder-gray-300"
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="mfaEnabled"
                checked={form.mfaEnabled}
                onChange={handleInputChange}
              />
              <label className="text-white text-sm">Enable MFA</label>
              <input
                type="email"
                name="backupEmail"
                placeholder="Backup Email"
                value={form.backupEmail}
                onChange={handleInputChange}
                className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-2 rounded placeholder-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-pink-400 hover:underline">Log In</a>
          </p>
        </div>
      </div>

      <Toaster />
      <HomeButton />
    </div>
  );
}

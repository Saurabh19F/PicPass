import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../utils/axiosInstance";

interface ProfileBoxProps {
  username: string;
  email: string;
  mfaEnabled: boolean;
  lastLogin?: string;
  backupEmail?: string;
  avatarPath?: string;
  onAvatarUpload?: (file: File) => void;
}

export default function ProfileBox({
  username,
  email,
  mfaEnabled,
  lastLogin,
  backupEmail,
  avatarPath,
  onAvatarUpload,
}: ProfileBoxProps) {
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("Fetching...");
  const [weather, setWeather] = useState<{ temperature: number; description: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const city = data.city || "Delhi";
        const country = data.country_name || "India";
        const lat = data.latitude || 28.6667;
        const lon = data.longitude || 77.2167;
        setLocation(`${city}, ${country}`);
        return api.get(`/api/weather?lat=${lat}&lon=${lon}`);
      })
      .then((res) => {
        const data = res.data;
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
        });
      })
      .catch((err) => {
        console.error("❌ Weather fetch error:", err);
        setLocation("Delhi, India");
        setWeather(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const form = new URLSearchParams();
      form.append("username", username);
      form.append("newPassword", newPassword);

      await api.post("/dashboard/change-password", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      toast.success("Password updated!");
      setShowModal(false);
      setNewPassword("");
    } catch (err) {
      toast.error("Failed to update password.");
      console.error(err);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image.");
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);

    if (onAvatarUpload) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow space-y-4 transition duration-300">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={
            avatar ||
            (avatarPath ? import.meta.env.VITE_API_BASE + avatarPath
              : `https://api.dicebear.com/7.x/initials/svg?seed=${username}`)
          }
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
        />
        <div>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-blue-600 hover:underline transition"
          >
            Change Picture
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleAvatarChange}
            hidden
          />
        </div>
      </div>

      {/* Info + Weather */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-1 text-gray-900 dark:text-white">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          {backupEmail && <p><strong>Backup Email:</strong> {backupEmail}</p>}
          <p><strong>MFA:</strong> {mfaEnabled ? "Enabled" : "Disabled"}</p>
          <p><strong>Last Login:</strong> {lastLogin ? new Date(lastLogin).toLocaleString() : "Not recorded"}</p>
        </div>

        <div className="bg-gray-700 text-white rounded-md p-3 text-sm md:w-64 space-y-1 self-start">
          <p><span className="font-semibold">🕒 Time:</span> {time.toLocaleTimeString()}</p>
          <p><span className="font-semibold">📍 Location:</span> {location}</p>
          <p>
            <span className="font-semibold">🌤️ Weather:</span>{" "}
            {loading ? "Loading..." : weather ? `${weather.temperature}°C, ${weather.description}` : "n/a"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition hover:scale-105 active:scale-95"
        >
          Change Password
        </button>
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 text-gray-900 dark:text-white">
            <h3 className="text-xl font-semibold">Change Password</h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
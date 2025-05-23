import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import ProfileBox from "../components/ProfileBox";
import ActivityLogItem from "../components/ActivityLogItem";
import { DashboardContext } from "../context/DashboardContext";
import Analytics from "../components/Analytics";
import Dropzone from "react-dropzone";
import { Moon, Sun, Trash2 } from "lucide-react";
import api from "../utils/axiosInstance";
import VaultLock from "../components/VaultLock";
import DashboardStats from "../components/DashboardStats";
import FileTypeChart from "../components/FileTypeChart";


export default function Dashboard() {
  const navigate = useNavigate();
  const dashboard = useContext(DashboardContext);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!dashboard) return;

    if (!isAuthenticated()) {
      toast.error("Not authenticated.");
      navigate("/login");
      return;
    }

    if (!username) {
      toast.error("Username not found.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await api.get(`/dashboard/profile?username=${username}`);
        dashboard.setProfile(profileRes.data);

        const filesRes = await api.get(`/dashboard/files?username=${username}`);
        dashboard.setFileList(filesRes.data);

        const activityRes = await api.get(`/dashboard/activity?username=${username}`);
        dashboard.setActivity(activityRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
        console.error("❌ Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!dashboard) {
    return (
      <div className="p-10 text-red-600">
        ❌ Dashboard context is not available. Please wrap your app in {'<DashboardProvider>'}.
      </div>
    );
  }

  const { profile, fileList, setFileList, activity, files, setFiles } = dashboard;

  const handleUpload = async () => {
    const form = new FormData();
    form.append("username", username || "");
    files.forEach((f: File) => form.append("files", f));
    try {
      await api.post("/dashboard/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Files uploaded!");
      setFiles([]);
      const refresh = await api.get(`/dashboard/files?username=${username}`);
      setFileList(refresh.data);
    } catch (err) {
      toast.error("Upload failed.");
      console.error("❌ Upload failed:", err);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await api.delete("/dashboard/delete", { params: { fileId } });
      toast.success("✅ File deleted");
      const refresh = await api.get(`/dashboard/files?username=${username}`);
      setFileList(refresh.data);
    } catch (err) {
      toast.error("❌ Failed to delete file");
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const theme = darkMode
    ? "bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-gray-100"
    : "bg-gradient-to-tr from-white via-purple-50 to-blue-100 text-gray-900";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-white">
        ⏳ Loading dashboard...
      </div>
    );
  }


  const handleAvatarUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  formData.append("username", username || "");

  try {
    await api.post("/dashboard/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("✅ Avatar updated!");

    const profileRes = await api.get(`/dashboard/profile?username=${username}`);
    dashboard.setProfile(profileRes.data);
  } catch (err) {
    console.error("❌ Avatar upload failed:", err);
    toast.error("Failed to upload avatar.");
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen p-6 transition-colors duration-500 ${theme}`}
    >
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow">
            {profile ? `Welcome, ${profile.username}` : "Loading..."}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-white/10 dark:bg-gray-700 border border-white/20 rounded-full shadow hover:scale-105 transition"
            >
              {darkMode ? <Sun className="text-yellow-300" /> : <Moon className="text-indigo-500" />}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">👤 Profile</h2>
          {profile ? (
            <ProfileBox {...profile} onAvatarUpload={handleAvatarUpload} />

          ) : (
            <p className="text-gray-400 italic">No profile info available.</p>
          )}
        </section>

        {/* File Upload */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">📤 Upload Files</h2>
          <Dropzone onDrop={(acceptedFiles) => setFiles(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-2 border-dashed p-6 rounded-lg bg-white/10 text-center cursor-pointer hover:border-pink-400 transition text-gray-300"
              >
                <input {...getInputProps()} />
                <p>Drag & drop files or click to upload</p>
              </div>
            )}
          </Dropzone>
          {files.length > 0 && (
            <button
              onClick={handleUpload}
              className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded hover:scale-105 transition"
            >
              Upload {files.length} file(s)
            </button>
          )}
        </section>

        {/* Uploaded Files */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">📂 Uploaded Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fileList && fileList.length > 0 ? (
              fileList.map((f, i) => (
                <div key={i} className="p-4 bg-white/20 dark:bg-gray-700 rounded-xl shadow space-y-2">
                  <h4 className="font-semibold text-lg truncate text-white">{f.fileName}</h4>
                  <p className="text-sm text-gray-300">Type: {f.fileType}</p>
                  <p className="text-sm text-gray-300">
                    Size: {(f.fileSize / 1024).toFixed(2)} KB
                  </p>

                  {f.fileType?.startsWith("image/") && (
                    <img
                      src={import.meta.env.VITE_API_BASE + f.fileUrl}
                      alt={f.fileName}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}

                  {f.fileType === "application/pdf" && (
                    <a
                      href={import.meta.env.VITE_API_BASE + f.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 underline hover:text-blue-500"
                    >
                      📄 View PDF
                    </a>
                  )}

                  {!f.fileType?.startsWith("image/") && f.fileType !== "application/pdf" && (
                    <a
                      href={import.meta.env.VITE_API_BASE + f.fileUrl}
                      download
                      className="text-blue-400 hover:underline"
                    >
                      ⬇️ Download
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(f.id)}
                    className="flex items-center gap-2 mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition hover:scale-105"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="italic text-gray-400">No files uploaded yet.</p>
            )}
          </div>
        </section>

        {/* File Distribution & Stats */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-white">📊 File Type Distribution </h2>
          <div className="mb-4">
            <DashboardStats
              totalFiles={fileList?.length || 0}
              totalSize={fileList?.reduce((sum, f) => sum + f.fileSize, 0) || 0}
              lastLogin={profile?.lastLogin}
            />
          </div>
          <FileTypeChart data={fileList || []} />
        </section>

        {/* Analytics Section */}
        <Analytics fileList={fileList || []} />

        {/* Activity Log */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">📜 Activity Log</h2>
          <ul className="space-y-2 list-disc pl-6 text-gray-300">
            {activity && activity.length > 0 ? (
              activity.map((a, i) => (
                <ActivityLogItem
                  key={i}
                  action={a.action}
                  timestamp={a.timestamp}
                  ipAddress={a.ipAddress}
                />
              ))
            ) : (
              <li className="text-sm text-gray-400">No activity logs yet.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Vault Floating Button */}
      <VaultLock />
    </motion.div>
    
  );
}

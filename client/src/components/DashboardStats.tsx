interface DashboardStatsProps {
  totalFiles: number;
  totalSize: number;
  lastLogin?: string;
}

export default function DashboardStats({ totalFiles, totalSize, lastLogin }: DashboardStatsProps) {
  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-xl px-4 py-3 shadow-sm border border-white/10 text-center text-sm md:text-base">
      <div className="px-2">
        <p className="font-bold text-lg">{totalFiles}</p>
        <p className="text-xs text-gray-300">Total Files</p>
      </div>
      <div className="px-2">
        <p className="font-bold text-lg">{formatSize(totalSize)}</p>
        <p className="text-xs text-gray-300">Storage Used</p>
      </div>
      <div className="px-2">
        <p className="font-bold text-lg">
          {lastLogin ? new Date(lastLogin).toLocaleString() : "N/A"}
        </p>
        <p className="text-xs text-gray-300">Last Login</p>
      </div>
    </div>
  );
}

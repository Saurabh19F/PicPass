import { createContext, useState } from "react";

// Define types
interface Profile {
  username: string;
  email: string;
  mfaEnabled: boolean;
  backupEmail: string;
  phone: string;
  profilePicture: string;
  segments: number[];
  lastLogin: string;
  avatarPath?: string;
}

interface ActivityLog {
  action: string;
  actionType: string;
  actionDetails: string;
  actionStatus: string;
  actionResult: string;
  actionError: string;
  actionTime: string;
  actionTimeZone: string;
  actionTimeOffset: string;
  actionTimeOffsetValue: string;
  timestamp: string;
  ipAddress: string;
}

interface UploadedFile {
  id: string;
  fileName: string;
  fileExtension?: string; // ✅ Made optional to match backend response
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

// Create the context type
interface DashboardContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  fileList: UploadedFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  activity: ActivityLog[];
  setActivity: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

// Create and export the context
export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fileList, setFileList] = useState<UploadedFile[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <DashboardContext.Provider
      value={{
        profile,
        setProfile,
        fileList,
        setFileList,
        activity,
        setActivity,
        files,
        setFiles,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};


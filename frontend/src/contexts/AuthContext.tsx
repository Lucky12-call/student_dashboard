import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface StudentAPI {
  student?: {
    user_id?: string;
    email?: string;
    roll_number?: string;
    batch_info?: string;
    submission_date?: string;
    fields?: Record<
      string,
      {
        label: string;
        value?: string;
        url?: string;
        doc_name?: string;
        size?: string;
      }
    >;
  };
  date?: string;
}

interface AuthContextType {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  studentsData: StudentAPI[];
  fetchStudentsData: () => Promise<void>;

  isDownloading: boolean;
  setIsDownloading: (value: boolean) => void;

  isDownloadingStudentDocs: boolean;
  setIsDownloadingStudentDocs: (value: boolean) => void;

  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "wpforms_dashboard_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentsData, setStudentsData] = useState<StudentAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingStudentDocs, setIsDownloadingStudentDocs] =
    useState(false);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(
        "https://student-dashboard-gamma-one.vercel.app/api/v1/admin/login",
        {
          method: "POST",
          credentials: "include", // REQUIRED for cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      setIsAuthenticated(true);
      setIsAuthenticated(true);
      return true; // login success
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  //  FIXED & SAFE DATA FETCH
  const fetchStudentsData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        "https://student-dashboard-gamma-one.vercel.app/api/v1/students"
      );

      if (!Array.isArray(data)) {
        setStudentsData([]);
        return;
      }

      const cleaned = data
        .map((item: StudentAPI, index: number) => {
          const student = item.student || {};

          return {
            student: {
              user_id: student.user_id || `user-${index}`, // unique fallback
              email: student.email || "",
              roll_number: student.roll_number || "",
              batch_info: student.batch_info || "",
              submission_date: student.submission_date || "",
              fields: student.fields || {},
            },
          };
        })
        // remove completely invalid objects
        .filter((item) => item.student && item.student.fields);
      setIsLoading(false);

      setStudentsData(cleaned);
    } catch (err) {
      console.error("ERROR fetching API:", err);
      setStudentsData([]);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        isLoading,
        studentsData,
        fetchStudentsData,
        isDownloading,
        setIsDownloading,
        isDownloadingStudentDocs,
        setIsDownloadingStudentDocs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

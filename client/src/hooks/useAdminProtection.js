"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export const useAdminProtection = () => {
  const { admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      toast.error("Access denied. Admin login required.", {
        icon: "🚫",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });
      router.push("/admin/login");
    }
  }, [admin, loading, router]);

  return {
    isLoading: loading,
    isAuthenticated: !!admin,
    admin,
  };
};

export default useAdminProtection;

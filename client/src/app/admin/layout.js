"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Home,
  Building,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sidebar,
  User,
  ChevronRight,
  Star,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Properties", href: "/admin/properties", icon: Building },
  {
    name: "Features Management",
    href: "/admin/properties/features",
    icon: Star,
  },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Expertise", href: "/admin/expertise", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Sidebar Content", href: "/admin/sidebar", icon: Sidebar },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Don't redirect if we're already on the login page
  const isLoginPage = pathname === "/admin/login";

  React.useEffect(() => {
    if (!loading && !admin && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [admin, loading, router, isLoginPage]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully", {
        icon: "👋",
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
        },
      });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated and on login page, render login page without admin layout
  if (!admin && isLoginPage) {
    return <>{children}</>;
  }

  // If user is not authenticated and not on login page, don't render anything (redirect will happen)
  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <SidebarContent pathname={pathname} admin={admin} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-xl border-r border-gray-100">
          <SidebarContent pathname={pathname} admin={admin} />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72 flex flex-col flex-1">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <div className="h-10 w-10"></div> {/* Spacer */}
          </div>
        </div>

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Pro Housing Admin
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Welcome back, {admin?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Admin Profile */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full pl-3 pr-4 py-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {admin?.name}
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:block">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, admin }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-gray-100">
        <Link href="/" className="flex items-center group">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:shadow-lg transition-all duration-300">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Pro Housing
            </span>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Admin Info */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                                group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200
                                ${
                                  isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                                    : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600"
                                }
                            `}
            >
              <item.icon
                className={`
                                    mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200
                                    ${
                                      isActive
                                        ? "text-white"
                                        : "text-gray-400 group-hover:text-indigo-500"
                                    }
                                `}
              />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-4 w-4 text-white" />}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="px-4 py-6 border-t border-gray-100 space-y-3">
        <Link href="/admin/properties/create">
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <Building className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Link>
        <Link href="/" target="_blank">
          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <Home className="h-4 w-4 mr-2" />
            View Website
          </Button>
        </Link>
      </div>
    </div>
  );
}

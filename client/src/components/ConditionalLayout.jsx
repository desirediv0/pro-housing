"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Check if current path is admin route
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    // For admin routes, just return children without navbar/footer
    return <>{children}</>;
  }

  // For non-admin routes, return with navbar and footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

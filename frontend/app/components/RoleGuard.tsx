"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "../../lib/auth";

interface RoleGuardProps {
  allowedRoles: string[];
  redirectPath?: string;
  children: ReactNode;
}

export default function RoleGuard({
  allowedRoles,
  redirectPath = "/",
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const roleRoutes: Record<string, string> = {
        CUSTOMER: "/",
        RESTAURANT: "/restaurant-dashboard",
        DRIVER: "/driver-dashboard",
        ADMIN: "/admin",
      };

      router.replace(roleRoutes[user.role] || redirectPath);
      return;
    }

    setAuthorized(true);
  }, [allowedRoles, redirectPath, router]);

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm text-neutral-500">Checking access...</p>
      </main>
    );
  }

  return <>{children}</>;
}

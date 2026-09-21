"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getNotifications,
  NotificationResponse,
  UserResponse,
} from "../../lib/api";
import { getToken, getUser, logout } from "../../lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const currentUser = getUser();
      const token = getToken();

      setUser(currentUser);

      if (currentUser?.role === "CUSTOMER" && token) {
        try {
          const data = await getNotifications(token);
          setNotifications(data);
        } catch {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }

      setLoaded(true);
    }

    loadUser();

    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  function handleLogout() {
    logout();
    setNotifications([]);
    window.dispatchEvent(new Event("auth-change"));
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-orange-600">
          FoodDelivery
        </Link>

        <div className="flex items-center gap-4">
          {!loaded ? null : user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>

              {user.role === "CUSTOMER" && (
                <>
                  <Link
                    href="/orders"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>

                  <Link
                    href="/notifications"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-orange-600 px-2 py-1 text-xs font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/cart"
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                  >
                    Cart
                  </Link>
                </>
              )}

              {user.role === "RESTAURANT" && (
                <Link
                  href="/restaurant-dashboard"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Restaurant Dashboard
                </Link>
              )}

              {user.role === "DRIVER" && (
                <Link
                  href="/driver-dashboard"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Driver Dashboard
                </Link>
              )}

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

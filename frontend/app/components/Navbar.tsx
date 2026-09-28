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
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-black text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Chow Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Chow home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white transition-transform duration-200 group-hover:scale-105">
            <span className="text-xl leading-none">✦</span>
          </div>

          <span className="text-3xl font-light tracking-[-0.05em]">
            chow
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          {!loaded ? null : user ? (
            <>
              <span className="mr-2 hidden text-sm text-neutral-400 md:block">
                Hi, {user.name}
              </span>

              {user.role === "CUSTOMER" && (
                <>
                  <Link
                    href="/orders"
                    className="rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white hover:text-black"
                  >
                    Orders
                  </Link>

                  <Link
                    href="/notifications"
                    className="relative rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white hover:text-black"
                  >
                    Notifications

                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-black">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/cart"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
                  >
                    Cart
                  </Link>
                </>
              )}

              {user.role === "RESTAURANT" && (
                <Link
                  href="/restaurant-dashboard"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Restaurant Dashboard
                </Link>
              )}

              {user.role === "DRIVER" && (
                <Link
                  href="/driver-dashboard"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Driver Dashboard
                </Link>
              )}

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="ml-1 rounded-full border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-white hover:bg-white hover:text-black"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-white hover:text-black"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

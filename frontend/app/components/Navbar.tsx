"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserResponse } from "../../lib/api";
import { getUser, logout } from "../../lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function loadUser() {
      setUser(getUser());
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
    window.dispatchEvent(new Event("auth-change"));
  }

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
                <span className="text-sm font-medium text-gray-700">Admin</span>
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

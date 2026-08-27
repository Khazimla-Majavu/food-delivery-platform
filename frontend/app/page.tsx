"use client";

import { useEffect, useState } from "react";
import RestaurantList from "./components/RestaurantList";
import { getUser, logout } from "../lib/auth";
import { UserResponse } from "../lib/api";

export default function Home() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setLoaded(true);
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-2xl font-bold text-orange-600">
            FoodDelivery
          </a>

          <div className="flex items-center gap-4">
            {!loaded ? null : user ? (
              <>
                <span className="text-sm text-gray-600">Hi, {user.name}</span>

                {user.role === "CUSTOMER" && (
                  <>
                    <a
                      href="/orders"
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </a>

                    <a
                      href="/cart"
                      className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                    >
                      Cart
                    </a>
                  </>
                )}

                {user.role === "RESTAURANT" && (
                  <a
                    href="/restaurant-dashboard"
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                  >
                    Restaurant Dashboard
                  </a>
                )}

                {user.role === "DRIVER" && (
                  <a
                    href="/driver-dashboard"
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                  >
                    Driver Dashboard
                  </a>
                )}

                {user.role === "ADMIN" && (
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
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
                <a
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log in
                </a>

                <a
                  href="/register"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-4 font-semibold text-orange-600">
              Delicious food, delivered to you
            </p>

            <h2 className="text-5xl font-bold leading-tight text-gray-900">
              Discover great food near you.
            </h2>

            <p className="mt-6 text-lg text-gray-600">
              Order from local restaurants and get your favourite meals
              delivered straight to your door.
            </p>

            {/* Search */}
            <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter your delivery address"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-4 text-gray-900 outline-none focus:border-orange-500"
              />

              <button className="rounded-lg bg-orange-600 px-7 py-4 font-semibold text-white hover:bg-orange-700">
                Find food
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Discovery */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900">
            Explore restaurants
          </h3>

          <p className="mt-2 text-gray-600">Find something delicious to eat.</p>
        </div>

        <RestaurantList />
      </section>
    </main>
  );
}

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

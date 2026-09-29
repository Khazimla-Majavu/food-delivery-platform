"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantList from "./components/RestaurantList";
import { getToken, getUser } from "../lib/auth";

export default function Home() {
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (token && user && user.role !== "CUSTOMER") {
      const roleRoutes: Record<string, string> = {
        RESTAURANT: "/restaurant-dashboard",
        DRIVER: "/driver-dashboard",
        ADMIN: "/admin",
      };

      router.replace(roleRoutes[user.role] || "/");
      return;
    }

    setCheckingAccess(false);
  }, [router]);

  if (checkingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm text-neutral-500">Checking access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Food from local restaurants
            </p>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
              Good food.
              <br />
              Delivered.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">
              Discover local restaurants, order what you want, and have it
              delivered straight to your door.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#restaurants"
                className="inline-flex items-center justify-center rounded-full bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Explore restaurants
              </a>

              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-7 py-4 text-sm font-semibold text-black transition hover:border-black"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="restaurants"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
      >
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Discover
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Restaurants near you
          </h2>

          <p className="mt-3 max-w-xl text-neutral-500">
            Browse local restaurants and find something worth ordering.
          </p>
        </div>

        <RestaurantList />
      </section>
    </main>
  );
}

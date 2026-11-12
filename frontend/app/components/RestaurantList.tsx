"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRestaurants, Restaurant } from "../../lib/api";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRestaurants() {
      const token = localStorage.getItem("token");

      try {
        const data = await getRestaurants(token || "");
        setRestaurants(data);
      } catch {
        setError("We couldn't load the restaurants. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse overflow-hidden rounded-2xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)]"
          >
            <div className="h-52 bg-[var(--chow-bg-elevated)]" />
            <div className="space-y-3 p-6">
              <div className="h-5 w-2/3 rounded bg-[var(--chow-bg-elevated)]" />
              <div className="h-3 w-full rounded bg-[var(--chow-bg-elevated)]" />
              <div className="h-3 w-1/2 rounded bg-[var(--chow-bg-elevated)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] p-8">
        <p className="text-sm text-[var(--chow-text-muted)]">{error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] px-6 py-16 text-center sm:px-12">
        <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[var(--chow-mint)] opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--chow-border)] bg-[var(--chow-bg-elevated)] text-3xl">
          🍽️
        </div>
        <h3 className="relative mt-6 font-serif text-3xl">
          Something good is coming.
        </h3>
        <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--chow-text-muted)]">
          We&apos;re getting local restaurants ready for you. Check back soon to
          discover what&apos;s cooking.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant, index) => (
        <Link
          key={restaurant.id}
          href={`/restaurants/${restaurant.id}`}
          className="group overflow-hidden rounded-2xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--chow-border-strong)] hover:shadow-2xl hover:shadow-black/20"
        >
          <div
            className={`relative flex h-52 items-center justify-center overflow-hidden ${
              index % 3 === 0
                ? "bg-[radial-gradient(ellipse_at_center,_#46594c,_#26362f_70%)]"
                : index % 3 === 1
                  ? "bg-[radial-gradient(ellipse_at_center,_#60473e,_#342823_70%)]"
                  : "bg-[radial-gradient(ellipse_at_center,_#66583d,_#393225_70%)]"
            }`}
          >
            <div className="absolute inset-5 rounded-full border border-white/10" />
            <div className="absolute inset-9 rounded-full border border-white/10" />
            <span className="relative text-7xl drop-shadow-xl transition duration-500 group-hover:scale-110">
              {index % 3 === 0 ? "🍔" : index % 3 === 1 ? "🍕" : "🍗"}
            </span>
            <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur">
              Local restaurant
            </span>
            <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition group-hover:bg-[var(--chow-mint)] group-hover:text-[#17201d]">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
                className="h-4 w-4" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </span>
          </div>

          <div className="p-6">
            <h3 className="truncate text-xl font-semibold tracking-tight text-[var(--chow-text)]">
              {restaurant.name}
            </h3>

            <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[var(--chow-text-muted)]">
              {restaurant.description || "Discover what&apos;s on the menu."}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--chow-border)] pt-4">
              <p className="truncate text-xs text-[var(--chow-text-subtle)]">
                {restaurant.address}
              </p>
              <span className="shrink-0 text-xs font-semibold text-[var(--chow-mint)] transition group-hover:translate-x-1">
                Explore
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
                  className="ml-1 inline-block h-3.5 w-3.5" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

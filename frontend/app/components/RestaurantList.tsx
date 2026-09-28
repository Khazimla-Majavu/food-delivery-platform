"use client";

import { useEffect, useState } from "react";
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
        setError("Unable to load restaurants.");
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  if (loading) {
    return (
      <p className="py-10 text-sm text-neutral-500">
        Loading restaurants...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <p className="text-sm text-neutral-600">{error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
        <p className="text-neutral-500">No restaurants available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <a
          key={restaurant.id}
          href={`/restaurants/${restaurant.id}`}
          className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl"
        >
          <div className="flex h-52 items-center justify-center bg-neutral-100">
            <span className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-400">
              Restaurant
            </span>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-black">
                {restaurant.name}
              </h3>

              <span className="text-xl text-neutral-400 transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500">
              {restaurant.description}
            </p>

            <p className="mt-5 text-sm font-medium text-neutral-700">
              {restaurant.address}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

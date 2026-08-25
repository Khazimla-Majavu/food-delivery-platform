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

      if (!token) {
        setError("Please log in to view restaurants.");
        setLoading(false);
        return;
      }

      try {
        const data = await getRestaurants(token);
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
    return <p className="text-gray-600">Loading restaurants...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (restaurants.length === 0) {
    return <p className="text-gray-600">No restaurants available yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <a
          key={restaurant.id}
          href={`/restaurants/${restaurant.id}`}
          className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-48 items-center justify-center bg-gray-100">
            <span className="text-gray-400">Restaurant Image</span>
          </div>

          <div className="p-5">
            <h4 className="text-xl font-semibold text-gray-900">
              {restaurant.name}
            </h4>

            <p className="mt-2 text-sm text-gray-500">
              {restaurant.description}
            </p>

            <div className="mt-4">
              <span className="text-sm text-gray-500">
                {restaurant.address}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

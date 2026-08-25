"use client";

import { useEffect, useState } from "react";
import { getRestaurantMenu, MenuItem } from "../../../lib/api";

import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = Number(params.id);

  const { addToCart, items } = useCart();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMenu() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view this restaurant.");
        setLoading(false);
        return;
      }

      if (!restaurantId) {
        setError("Invalid restaurant.");
        setLoading(false);
        return;
      }

      try {
        const data = await getRestaurantMenu(restaurantId, token);
        setMenuItems(data);
      } catch {
        setError("Unable to load the restaurant menu.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [restaurantId]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-orange-600">
              FoodDelivery
            </a>

            <a
              href="/cart"
              className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
            >
              Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </a>
          </div>
        </div>
      </nav>

      {/* Restaurant Header */}
      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-medium text-orange-600">Restaurant</p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Restaurant Menu
          </h1>

          <p className="mt-3 text-gray-600">
            Browse the available food from this restaurant.
          </p>
        </div>
      </section>

      {/* Menu */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Menu</h2>

        {loading && <p className="text-gray-600">Loading menu...</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && menuItems.length === 0 && (
          <p className="text-gray-600">
            This restaurant doesn't have any menu items yet.
          </p>
        )}

        {!loading && !error && menuItems.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-gray-600">{item.description}</p>

                <p className="mt-4 text-lg font-bold text-orange-600">
                  R{Number(item.price).toFixed(2)}
                </p>

                <button
                  onClick={() => addToCart(item)}
                  className="mt-5 w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

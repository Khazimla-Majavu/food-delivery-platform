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

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function loadMenu() {
      const token = localStorage.getItem("token");

      if (!restaurantId) {
        setError("Invalid restaurant.");
        setLoading(false);
        return;
      }

      try {
        const data = await getRestaurantMenu(restaurantId, token || "");
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
    <main className="min-h-screen bg-white text-black">
      {/* Restaurant Header */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <a
            href="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Back to restaurants
          </a>

          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Restaurant
            </p>

            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Menu
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-500">
              Choose something you like and add it to your order.
            </p>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Available now
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Food & drinks
            </h2>
          </div>

          <a
            href="/cart"
            className="shrink-0 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Cart ({cartCount})
          </a>
        </div>

        {loading && (
          <div className="py-12">
            <p className="text-sm text-neutral-500">Loading menu...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm text-neutral-600">{error}</p>
          </div>
        )}

        {!loading && !error && menuItems.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <p className="text-neutral-500">
              This restaurant doesn't have any menu items yet.
            </p>
          </div>
        )}

        {!loading && !error && menuItems.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl"
              >
                <div className="flex h-48 items-center justify-center bg-neutral-100">
                  <span className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-400">
                    Food
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">
                    {item.name}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-neutral-500">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold">
                      R{Number(item.price).toFixed(2)}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRestaurantMenu, MenuItem } from "../../../lib/api";
import { useCart } from "../../context/CartContext";

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = Number(params.id);

  const { addToCart, items, total } = useCart();

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
        setError("Unable to load the restaurant menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [restaurantId]);

  return (
    <main className="chow-page min-h-screen">
      {/* Restaurant introduction */}
      <section className="relative overflow-hidden border-b border-[var(--chow-border)]">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[var(--chow-mint)] opacity-[0.06] blur-3xl" />

        <div className="chow-container relative py-12 sm:py-16 lg:py-20">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-sm text-[var(--chow-text-muted)] transition hover:text-[var(--chow-mint)]"
          >
            <span aria-hidden="true">←</span>
            Back to restaurants
          </Link>

          <div className="max-w-3xl">
            <p className="chow-eyebrow">DISCOVER SOMETHING DELICIOUS</p>

            <h1 className="mt-4 font-serif text-5xl font-medium tracking-tight text-[var(--chow-text)] sm:text-6xl lg:text-7xl">
              Good food.
              <br />
              <span className="text-[var(--chow-mint)]">
                Good mood.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--chow-text-muted)] sm:text-lg">
              Explore the menu, find your favourites, and get your next meal
              started with Chow.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--chow-border)] bg-[var(--chow-bg-card)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--chow-text-muted)]">
                RESTAURANT MENU
              </span>
              <span className="rounded-full border border-[var(--chow-border)] bg-[var(--chow-bg-card)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--chow-text-muted)]">
                {menuItems.length} {menuItems.length === 1 ? "ITEM" : "ITEMS"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu section */}
      <section className="chow-container py-12 sm:py-16">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="chow-eyebrow">MADE FOR YOUR APPETITE</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--chow-text)] sm:text-4xl">
              Explore the menu
            </h2>
            <p className="mt-3 text-sm text-[var(--chow-text-muted)]">
              Find something you love and add it to your basket.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-[var(--chow-border-strong)] bg-[var(--chow-bg-card)] px-5 py-3 text-sm font-semibold text-[var(--chow-text)] transition hover:border-[var(--chow-mint)] hover:text-[var(--chow-mint)]"
          >
            <span>Your basket</span>
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--chow-mint)] px-2 text-xs font-bold text-[#14201B]">
              {cartCount}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)]"
              >
                <div className="h-36 bg-[var(--chow-bg-elevated)]" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-2/3 rounded bg-[var(--chow-bg-elevated)]" />
                  <div className="h-3 w-full rounded bg-[var(--chow-bg-elevated)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--chow-bg-elevated)]" />
                  <div className="flex justify-between pt-3">
                    <div className="h-6 w-20 rounded bg-[var(--chow-bg-elevated)]" />
                    <div className="h-10 w-28 rounded-full bg-[var(--chow-bg-elevated)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] p-8 sm:p-12">
            <div className="mb-4 text-3xl" aria-hidden="true">
              !
            </div>
            <h3 className="text-lg font-semibold text-[var(--chow-text)]">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-[var(--chow-text-muted)]">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="chow-button-primary mt-6"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty menu state */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] px-6 py-16 text-center">
            <div className="mb-5 text-4xl" aria-hidden="true">
              ✳
            </div>
            <h3 className="font-serif text-2xl text-[var(--chow-text)]">
              The menu is getting ready
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--chow-text-muted)]">
              This restaurant hasn&apos;t added any menu items yet. Check back
              soon to see what&apos;s cooking.
            </p>
            <Link href="/" className="chow-button-secondary mt-7 inline-flex">
              Explore other restaurants
            </Link>
          </div>
        )}

        {/* Menu cards */}
        {!loading && !error && menuItems.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => {
              const quantity =
                items.find((cartItem) => cartItem.menuItem.id === item.id)
                  ?.quantity ?? 0;

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] transition duration-300 hover:-translate-y-1 hover:border-[var(--chow-border-strong)] hover:shadow-2xl hover:shadow-black/20"
                >
                  <div className="relative flex h-36 items-center justify-between overflow-hidden bg-[var(--chow-bg-elevated)] px-6">
                    <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border border-[var(--chow-border-strong)] opacity-50 transition duration-500 group-hover:scale-110" />
                    <div className="pointer-events-none absolute -right-2 -top-10 h-32 w-32 rounded-full border border-[var(--chow-border-strong)] opacity-50" />

                    <span className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[var(--chow-text-subtle)]">
                      CHOW MENU
                    </span>

                    {quantity > 0 && (
                      <span className="relative rounded-full bg-[var(--chow-mint)] px-3 py-1.5 text-xs font-bold text-[#14201B]">
                        {quantity} in basket
                      </span>
                    )}

                    <span className="pointer-events-none absolute bottom-3 right-6 font-serif text-6xl text-[var(--chow-mint)] opacity-20">
                      ✳
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--chow-text)]">
                      {item.name}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-[var(--chow-text-muted)]">
                      {item.description || "A delicious choice from our menu."}
                    </p>

                    <div className="mt-7 flex items-center justify-between gap-3 border-t border-[var(--chow-border)] pt-5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--chow-text-subtle)]">
                          PRICE
                        </p>
                        <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--chow-text)]">
                          R{Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--chow-mint)] px-5 py-3 text-sm font-bold text-[#14201B] transition hover:bg-[var(--chow-mint-hover)] active:scale-95"
                      >
                        <span aria-hidden="true">+</span>
                        Add to basket
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Basket summary */}
        {!loading && !error && cartCount > 0 && (
          <div className="mt-12 rounded-3xl border border-[var(--chow-border-strong)] bg-[var(--chow-bg-card)] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <p className="chow-eyebrow">READY WHEN YOU ARE</p>
              <h3 className="mt-2 font-serif text-2xl text-[var(--chow-text)]">
                Your basket is taking shape.
              </h3>
              <p className="mt-2 text-sm text-[var(--chow-text-muted)]">
                {cartCount} {cartCount === 1 ? "item" : "items"} added to your
                basket.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-5 sm:mt-0 sm:justify-end">
              <div>
                <p className="text-xs text-[var(--chow-text-subtle)]">
                  Current subtotal
                </p>
                <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--chow-text)]">
                  R{total.toFixed(2)}
                </p>
              </div>

              <Link
                href="/cart"
                className="chow-button-primary shrink-0"
              >
                View basket <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

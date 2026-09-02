"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../../lib/api";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  async function handleCheckout() {
    setCheckoutError("");
    setOrderSuccess("");

    if (items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    const restaurantIds = [
      ...new Set(items.map((item) => item.menuItem.restaurantId)),
    ];

    if (restaurantIds.length !== 1) {
      setCheckoutError("Your cart can only contain items from one restaurant.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setCheckoutError("Please log in before checking out.");
      return;
    }

    setCheckoutLoading(true);

    try {
      const restaurantId = restaurantIds[0];

      const orderItems = items.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      }));

      const order = await createOrder(restaurantId, orderItems, token);

      clearCart();

      setOrderSuccess(`Order #${order.id} created successfully!`);
    } catch (error) {
      console.error(error);
      setCheckoutError("Unable to create your order. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Cart */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900">Your Cart</h1>

        {orderSuccess && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {orderSuccess}
          </div>
        )}

        {checkoutError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {checkoutError}
          </div>
        )}

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-600">
              Add some food from a restaurant to get started.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Browse restaurants
            </a>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {item.menuItem.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-600">
                        {item.menuItem.description}
                      </p>

                      <p className="mt-2 font-semibold text-orange-600">
                        R{Number(item.menuItem.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.menuItem.id, item.quantity - 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg hover:bg-gray-100"
                      >
                        -
                      </button>

                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.menuItem.id, item.quantity + 1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg hover:bg-gray-100"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="ml-3 text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4 text-right">
                    <span className="font-semibold text-gray-900">
                      Item total: R
                      {(Number(item.menuItem.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-700">
                  Subtotal
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  R{total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="mt-6 w-full rounded-lg bg-orange-600 px-6 py-4 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutLoading ? "Creating order..." : "Proceed to checkout"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

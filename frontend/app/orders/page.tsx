"use client";

import { useEffect, useState } from "react";
import { getMyOrders, OrderResponse } from "../../lib/api";

const statusSteps = [
  {
    status: "PENDING",
    label: "Order placed",
  },
  {
    status: "ACCEPTED",
    label: "Order accepted",
  },
  {
    status: "PREPARING",
    label: "Preparing your food",
  },
  {
    status: "READY",
    label: "Ready for pickup",
  },
  {
    status: "OUT_FOR_DELIVERY",
    label: "On the way",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
  },
];

function getStatusIndex(status: string) {
  return statusSteps.findIndex((step) => step.status === status);
}

function OrderStatusTracker({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-700">Order cancelled</p>

        <p className="mt-1 text-sm text-red-600">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  const currentIndex = getStatusIndex(status);

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Order progress
      </h3>

      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const completed = index <= currentIndex;
          const current = index === currentIndex;

          return (
            <div key={step.status} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    completed
                      ? "bg-orange-600 text-white"
                      : "border-2 border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                {index < statusSteps.length - 1 && (
                  <div
                    className={`mt-1 h-6 w-0.5 ${
                      index < currentIndex
                        ? "bg-orange-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              <div className="pt-1">
                <p
                  className={`font-semibold ${
                    current
                      ? "text-orange-600"
                      : completed
                        ? "text-gray-900"
                        : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>

                {current && status !== "DELIVERED" && (
                  <p className="mt-1 text-sm text-gray-500">
                    Current status
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const data = await getMyOrders(token);
        setOrders(data);
      } catch {
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="text-2xl font-bold text-orange-600"
          >
            FoodDelivery
          </a>

          <a
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-orange-600"
          >
            Continue shopping
          </a>
        </div>
      </nav>

      {/* Orders */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900">
          My Orders
        </h1>

        <p className="mt-2 text-gray-600">
          View your previous and current orders.
        </p>

        {loading && (
          <p className="mt-8 text-gray-600">
            Loading orders...
          </p>
        )}

        {error && (
          <p className="mt-8 text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-600">
              Your orders will appear here after you place one.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Browse restaurants
            </a>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                {/* Order header */}
                <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Restaurant #{order.restaurantId}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                      order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Status tracker */}
                <OrderStatusTracker status={order.status} />

                {/* Items */}
                <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Items
                  </h3>

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.menuItemName}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.quantity} × R
                          {Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        R{Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order total */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="font-medium text-gray-700">
                    Total
                  </span>

                  <span className="text-xl font-bold text-orange-600">
                    R{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>

                {/* Date */}
                <p className="mt-3 text-xs text-gray-500">
                  Placed{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  claimOrder,
  completeDelivery,
  getAvailableDriverOrders,
  getDriverOrders,
  OrderResponse,
} from "../../lib/api";

export default function DriverDashboard() {
  const [availableOrders, setAvailableOrders] = useState<OrderResponse[]>([]);
  const [myOrders, setMyOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadDashboard() {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");

    if (!token || !userJson) {
      setError("Please log in to access the driver dashboard.");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userJson);

      if (user.role !== "DRIVER") {
        setError(
          "You do not have permission to access the driver dashboard.",
        );
        setLoading(false);
        return;
      }

      const [available, mine] = await Promise.all([
        getAvailableDriverOrders(token),
        getDriverOrders(token),
      ]);

      setAvailableOrders(available);
      setMyOrders(mine);
    } catch {
      setError("Unable to load the driver dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleClaim(orderId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    setActionLoading(orderId);
    setError("");

    try {
      await claimOrder(orderId, token);
      await loadDashboard();
    } catch {
      setError("Unable to claim this order.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleComplete(orderId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    setActionLoading(orderId);
    setError("");

    try {
      await completeDelivery(orderId, token);
      await loadDashboard();
    } catch {
      setError("Unable to complete this delivery.");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-gray-600">Loading driver dashboard...</p>
        </div>
      </main>
    );
  }

  if (error && !availableOrders.length && !myOrders.length) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-xl border border-red-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-red-600">
              Dashboard Error
            </h1>

            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-2xl font-bold text-orange-600">
            FoodDelivery
          </a>

          <a
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-orange-600"
          >
            Customer site
          </a>
        </div>
      </nav>

      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-medium text-orange-600">
            Driver Management
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Driver Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Find available deliveries and manage your assigned orders.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Available Deliveries
              </h2>

              <p className="mt-1 text-gray-600">
                Orders ready to be collected.
              </p>
            </div>

            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              {availableOrders.length}{" "}
              {availableOrders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {availableOrders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-gray-600">
                No deliveries are currently available.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {availableOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Restaurant #{order.restaurantId}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <h4 className="font-semibold text-gray-900">Items</h4>

                    <div className="mt-3 space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.quantity} × {item.menuItemName}
                          </span>

                          <span className="font-medium text-gray-900">
                            R{Number(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                    <span className="font-semibold text-gray-700">
                      Order Total
                    </span>

                    <span className="text-xl font-bold text-orange-600">
                      R{Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleClaim(order.id)}
                    disabled={actionLoading === order.id}
                    className="mt-6 w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionLoading === order.id
                      ? "Claiming..."
                      : "Claim Order"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                My Deliveries
              </h2>

              <p className="mt-1 text-gray-600">
                Orders assigned to you.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
              {myOrders.length}{" "}
              {myOrders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {myOrders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-gray-600">
                You don't have any assigned deliveries yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Restaurant #{order.restaurantId}
                      </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.quantity} × {item.menuItemName}
                          </span>

                          <span className="font-medium text-gray-900">
                            R{Number(item.subtotal).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                    <span className="font-semibold text-gray-700">
                      Order Total
                    </span>

                    <span className="text-xl font-bold text-orange-600">
                      R{Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  {order.status === "OUT_FOR_DELIVERY" && (
                    <button
                      onClick={() => handleComplete(order.id)}
                      disabled={actionLoading === order.id}
                      className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading === order.id
                        ? "Completing..."
                        : "Mark Delivered"}
                    </button>
                  )}

                  {order.status === "DELIVERED" && (
                    <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-center font-semibold text-green-700">
                      Delivery completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

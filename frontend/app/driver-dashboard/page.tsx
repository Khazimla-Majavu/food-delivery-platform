"use client";

import RoleGuard from "../components/RoleGuard";

import { useEffect, useState } from "react";
import {
  claimOrder,
  completeDelivery,
  getAvailableDriverOrders,
  getDriverOrders,
  getDeliveryLocation,
  OrderResponse,
} from "../../lib/api";

function DriverDashboardContent() {
  const [availableOrders, setAvailableOrders] = useState<OrderResponse[]>([]);
  const [myOrders, setMyOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    Record<number, string>
  >({});

  async function loadDashboard() {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");

    if (!token || !userJson) {
      setError("Please log in to access the driver dashboard.");
      setLoading(false);
      return;
    }

    try {

      const [available, mine] = await Promise.all([
        getAvailableDriverOrders(token),
        getDriverOrders(token),
      ]);

      setAvailableOrders(available);
      setMyOrders(mine);

      const locations = await Promise.all(
        mine.map(async (order) => {
          try {
            const location = await getDeliveryLocation(order.id, token);
            return [order.id, location.address] as const;
          } catch {
            return [order.id, "Delivery address unavailable"] as const;
          }
        }),
      );

      setDeliveryAddresses(Object.fromEntries(locations));
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
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm text-neutral-500">
            Loading driver dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error && !availableOrders.length && !myOrders.length) {
    return (
      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
              Driver Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              Something went wrong
            </h1>

            <p className="mt-3 text-neutral-500">{error}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">

            <div className="max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Driver Management
              </p>

              <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Driver Dashboard
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-500">
                Find available deliveries and manage your assigned orders.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          {error && (
            <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm text-neutral-700">{error}</p>
            </div>
          )}

          {/* Available deliveries */}
          <div>
            <div className="flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Available now
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  Available Deliveries
                </h2>

                <p className="mt-3 max-w-xl text-neutral-500">
                  Orders ready to be collected.
                </p>
              </div>

              <span className="w-fit rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700">
                {availableOrders.length}{" "}
                {availableOrders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            {availableOrders.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-semibold shadow-sm">
                  —
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                  No deliveries available
                </h3>

                <p className="mt-2 text-neutral-500">
                  There are currently no orders waiting for a driver.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {availableOrders.map((order) => (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="border-b border-neutral-200 p-7">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
                            Order #{order.id}
                          </p>

                          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                            {order.restaurantName}
                          </h3>

                          <p className="mt-2 text-sm text-neutral-500">
                            {order.restaurantAddress}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                          {order.status.replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="p-7">
                      <div>
                        <div className="mb-5 flex items-center justify-between">
                          <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                            Items
                          </h4>

                          <span className="text-sm text-neutral-400">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-6"
                            >
                              <div>
                                <p className="font-semibold text-black">
                                  {item.menuItemName}
                                </p>

                                <p className="mt-1 text-sm text-neutral-500">
                                  {item.quantity} × R
                                  {Number(item.price).toFixed(2)}
                                </p>
                              </div>

                              <span className="shrink-0 font-semibold text-black">
                                R{Number(item.subtotal).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-7 flex items-end justify-between border-t border-neutral-200 pt-6">
                        <span className="text-sm text-neutral-500">
                          Order Total
                        </span>

                        <span className="text-3xl font-semibold tracking-[-0.03em]">
                          R{Number(order.totalAmount).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleClaim(order.id)}
                        disabled={actionLoading === order.id}
                        className="mt-7 w-full rounded-full bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading === order.id
                          ? "Claiming..."
                          : "Claim Order"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My deliveries */}
          <div className="mt-20">
            <div className="flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Your deliveries
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  My Deliveries
                </h2>

                <p className="mt-3 max-w-xl text-neutral-500">
                  Orders currently assigned to you.
                </p>
              </div>

              <span className="w-fit rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700">
                {myOrders.length} {myOrders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            {myOrders.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
                <p className="text-neutral-500">
                  You don't have any assigned deliveries yet.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
                  >
                    <div className="border-b border-neutral-200 p-7 sm:p-8">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
                            Order #{order.id}
                          </p>

                          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                            {order.restaurantName}
                          </h3>

                          <p className="mt-2 text-sm text-neutral-500">
                            {order.restaurantAddress}
                          </p>

                          <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                              Delivery address
                            </p>

                            <p className="mt-2 text-sm font-medium text-neutral-800">
                              {deliveryAddresses[order.id] || "Loading..."}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] ${
                            order.status === "DELIVERED"
                              ? "bg-black text-white"
                              : "border border-neutral-300 bg-white text-black"
                          }`}
                        >
                          {order.status.replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="p-7 sm:p-8">
                      <div>
                        <div className="mb-5 flex items-center justify-between">
                          <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                            Items
                          </h4>

                          <span className="text-sm text-neutral-400">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-6"
                            >
                              <div>
                                <p className="font-semibold text-black">
                                  {item.menuItemName}
                                </p>

                                <p className="mt-1 text-sm text-neutral-500">
                                  {item.quantity} × R
                                  {Number(item.price).toFixed(2)}
                                </p>
                              </div>

                              <span className="shrink-0 font-semibold text-black">
                                R{Number(item.subtotal).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-7 flex items-end justify-between border-t border-neutral-200 pt-6">
                        <span className="text-sm text-neutral-500">
                          Order Total
                        </span>

                        <span className="text-3xl font-semibold tracking-[-0.03em]">
                          R{Number(order.totalAmount).toFixed(2)}
                        </span>
                      </div>

                      {order.status === "OUT_FOR_DELIVERY" && (
                        <button
                          onClick={() => handleComplete(order.id)}
                          disabled={actionLoading === order.id}
                          className="mt-7 w-full rounded-full bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === order.id
                            ? "Completing..."
                            : "Mark Delivered"}
                        </button>
                      )}

                      {order.status === "DELIVERED" && (
                        <div className="mt-7 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-center">
                          <p className="text-sm font-semibold text-black">
                            Delivery completed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
  );
}

export default function DriverDashboard() {
  return (
    <RoleGuard allowedRoles={["DRIVER"]}>
      <DriverDashboardContent />
    </RoleGuard>
  );
}

"use client";

import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RoleGuard from "../components/RoleGuard";

const DriverTrackingMap = dynamic(
  () => import("../components/DriverTrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <p className="text-sm text-neutral-500">Loading live tracking map...</p>
      </div>
    ),
  },
);
import { isOrderHistory, sortOrdersBySection } from "../../lib/orderSorting";
import {
  getMyOrders,
  getDeliveryDistance,
  getDeliveryPin,
  OrderResponse,
} from "../../lib/api";

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
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="font-semibold text-black">Order cancelled</p>

        <p className="mt-1 text-sm text-neutral-500">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  const currentIndex = getStatusIndex(status);

  return (
    <div className="mt-8">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
          Order progress
        </h3>

        {status === "DELIVERED" && (
          <span className="text-sm font-semibold text-black">
            Complete
          </span>
        )}
      </div>

      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const completed = index <= currentIndex;
          const current = index === currentIndex;

          return (
            <div key={step.status} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    completed
                      ? "bg-black text-white"
                      : "border border-neutral-300 bg-white text-neutral-400"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                {index < statusSteps.length - 1 && (
                  <div
                    className={`mt-1 h-6 w-px ${
                      index < currentIndex
                        ? "bg-black"
                        : "bg-neutral-200"
                    }`}
                  />
                )}
              </div>

              <div className="pt-1">
                <p
                  className={`font-semibold ${
                    current
                      ? "text-black"
                      : completed
                        ? "text-neutral-700"
                        : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </p>

                {current && status !== "DELIVERED" && (
                  <p className="mt-1 text-sm text-neutral-500">
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
  const [deliveryDistances, setDeliveryDistances] = useState<
    Record<number, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryPins, setDeliveryPins] = useState<Record<number, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const interval = window.setInterval(async () => {
      try {
        const latestOrders = await getMyOrders(token);
        setOrders(latestOrders);
      } catch {
        // Keep the current order display if a refresh temporarily fails.
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const activeOrders = orders.filter(
      (order) => order.status === "OUT_FOR_DELIVERY",
    );
    if (activeOrders.length === 0) return;

    let cancelled = false;

    async function loadDeliveryPins() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const entries = await Promise.all(
        activeOrders.map(async (order) => {
          try {
            const result = await getDeliveryPin(order.id, token);
            return [order.id, result.pin] as const;
          } catch {
            return null;
          }
        }),
      );

      if (cancelled) return;
      const validEntries = entries.filter(
        (entry): entry is readonly [number, string] => entry !== null,
      );
      if (validEntries.length > 0) {
        setDeliveryPins((current) => ({
          ...current,
          ...Object.fromEntries(validEntries),
        }));
      }
    }

    void loadDeliveryPins();
    return () => {
      cancelled = true;
    };
  }, [orders]);

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

        const distanceEntries = await Promise.all(
          data.map(async (order) => {
            try {
              const distance = await getDeliveryDistance(order.id, token);
              return [order.id, distance.distanceKm] as const;
            } catch {
              return null;
            }
          }),
        );

        setDeliveryDistances(
          Object.fromEntries(
            distanceEntries.filter(
              (entry): entry is readonly [number, number] =>
                entry !== null,
            ),
          ),
        );
      } catch {
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <RoleGuard allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-white text-black">
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <a
            href="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Continue shopping
          </a>

          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Your account
            </p>

            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              My Orders
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-500">
              Track your current orders and view your previous orders.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        {loading && (
          <div className="py-12">
            <p className="text-sm text-neutral-500">
              Loading orders...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm text-neutral-700">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center sm:p-14">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
              Nothing here yet
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-neutral-500">
              Your orders will appear here after you place one.
            </p>

            <a
              href="/"
              className="mt-7 inline-flex rounded-full bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Browse restaurants
            </a>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-8">
            {sortOrdersBySection(orders).map((order, index, sortedOrders) => (
              <Fragment key={order.id}>
              {(index === 0 ||
                  isOrderHistory(order) !==
                    isOrderHistory(sortedOrders[index - 1])) && (
                  <div className="pb-1 pt-2">
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                      {isOrderHistory(order)
                        ? "Order History"
                        : "Ongoing Orders"}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      {isOrderHistory(order)
                        ? "Delivered and cancelled orders."
                        : "Orders that are still being processed or delivered."}
                    </p>
                  </div>
                )}
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
              >
                <div className="border-b border-neutral-200 p-6 sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
                        Order #{order.id}
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                        {order.restaurantName}
                      </h2>

                      <p className="mt-2 text-sm text-neutral-500">
                        {order.restaurantAddress}
                      </p>

                      {deliveryDistances[order.id] !== undefined && (
                        <p className="mt-2 text-sm font-medium text-neutral-700">
                          {deliveryDistances[order.id].toFixed(2)} km delivery
                        </p>
                      )}
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] ${
                        order.status === "CANCELLED"
                          ? "bg-neutral-100 text-neutral-600"
                          : order.status === "DELIVERED"
                            ? "bg-black text-white"
                            : "border border-neutral-300 bg-white text-black"
                      }`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <OrderStatusTracker status={order.status} />

                  {order.status === "OUT_FOR_DELIVERY" && (
                    <>
                      <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                          Delivery confirmation PIN
                        </p>
                        <p className="mt-3 text-3xl font-semibold tracking-[0.3em] text-black">
                          {deliveryPins[order.id] ?? "------"}
                        </p>
                        <p className="mt-3 text-sm text-neutral-600">
                          Give this six-digit PIN to your driver when your order arrives. The driver needs it to complete the delivery.
                        </p>
                      </div>
                      <DriverTrackingMap orderId={order.id} />
                    </>
                  )}

                  <div className="mt-10 border-t border-neutral-200 pt-8">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                        Items
                      </h3>

                      <span className="text-sm text-neutral-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <div className="space-y-5">
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

                          <p className="shrink-0 font-semibold text-black">
                            R{Number(item.subtotal).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex items-end justify-between border-t border-neutral-200 pt-6">
                    <div>
                      <p className="text-sm text-neutral-500">
                        Total
                      </p>

                      <p className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
                        R{Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>

                    <p className="text-right text-xs text-neutral-400">
                      Placed
                      <br />
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </article>
              </Fragment>
            ))}
          </div>
        )}
      </section>
      </main>
    </RoleGuard>
  );
}

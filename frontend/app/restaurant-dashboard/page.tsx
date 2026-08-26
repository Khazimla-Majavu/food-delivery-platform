"use client";

import { useEffect, useState } from "react";
import {
  getMyRestaurants,
  getRestaurantOrders,
  updateOrderStatus,
  Restaurant,
  OrderResponse,
} from "../../lib/api";

export default function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");

      if (!token || !userJson) {
        setError("Please log in to access the restaurant dashboard.");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userJson);

        if (user.role !== "RESTAURANT") {
          setError(
            "You do not have permission to access the restaurant dashboard.",
          );
          setLoading(false);
          return;
        }

        const myRestaurants = await getMyRestaurants(token);

        setRestaurants(myRestaurants);

        if (myRestaurants.length > 0) {
          const restaurantOrders = await getRestaurantOrders(
            myRestaurants[0].id,
            token,
          );

          setOrders(restaurantOrders);
        }
      } catch {
        setError("Unable to load the restaurant dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleStatusUpdate(
    orderId: number,
    status: string,
  ) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    setUpdatingOrderId(orderId);
    setError("");

    try {
      const updatedOrder = await updateOrderStatus(
        orderId,
        status,
        token,
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );
    } catch {
      setError("Unable to update the order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  function getNextStatus(status: string): {
    status: string;
    label: string;
  } | null {
    switch (status) {
      case "PENDING":
        return {
          status: "ACCEPTED",
          label: "Accept Order",
        };

      case "ACCEPTED":
        return {
          status: "PREPARING",
          label: "Start Preparing",
        };

      case "PREPARING":
        return {
          status: "READY",
          label: "Mark Ready",
        };

      case "READY":
        return {
          status: "OUT_FOR_DELIVERY",
          label: "Send Out For Delivery",
        };

      case "OUT_FOR_DELIVERY":
        return {
          status: "DELIVERED",
          label: "Mark Delivered",
        };

      default:
        return null;
    }
  }

  function canCancel(status: string): boolean {
    return status === "PENDING" ||
      status === "ACCEPTED" ||
      status === "PREPARING";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-gray-600">
            Loading restaurant dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error && restaurants.length === 0) {
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
            Customer site
          </a>
        </div>
      </nav>

      {/* Dashboard Header */}
      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-medium text-orange-600">
            Restaurant Management
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Restaurant Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your restaurant and view incoming orders.
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Error */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Restaurants */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Restaurants
          </h2>

          {restaurants.length === 0 ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-gray-600">
                You don't have any restaurants yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {restaurant.description}
                  </p>

                  <p className="mt-4 text-sm text-gray-500">
                    {restaurant.address}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Incoming Orders
              </h2>

              <p className="mt-1 text-gray-600">
                Orders placed at your restaurant.
              </p>
            </div>

            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              {orders.length}{" "}
              {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-gray-600">No orders yet.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {orders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                const isUpdating = updatingOrderId === order.id;

                return (
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
                          Customer #{order.customerId}
                        </p>
                      </div>

                      <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                        {order.status}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <h4 className="font-semibold text-gray-900">
                        Items
                      </h4>

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
                              R
                              {Number(item.subtotal).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                      <span className="font-semibold text-gray-700">
                        Order Total
                      </span>

                      <span className="text-xl font-bold text-orange-600">
                        R{Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    {/* Actions */}
                    {(nextStatus || canCancel(order.status)) && (
                      <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                        {nextStatus && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                order.id,
                                nextStatus.status,
                              )
                            }
                            disabled={isUpdating}
                            className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating
                              ? "Updating..."
                              : nextStatus.label}
                          </button>
                        )}

                        {canCancel(order.status) && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                order.id,
                                "CANCELLED",
                              )
                            }
                            disabled={isUpdating}
                            className="rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

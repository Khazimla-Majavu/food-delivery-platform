"use client";

import { useEffect, useState } from "react";
import {
  getMyRestaurants,
  getRestaurantOrders,
  getRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateOrderStatus,
  Restaurant,
  OrderResponse,
  MenuItem,
} from "../../lib/api";

export default function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuError, setMenuError] = useState("");
  const [menuSubmitting, setMenuSubmitting] = useState(false);

  const [editingMenuItemId, setEditingMenuItemId] = useState<number | null>(
    null,
  );
  const [editMenuName, setEditMenuName] = useState("");
  const [editMenuDescription, setEditMenuDescription] = useState("");
  const [editMenuPrice, setEditMenuPrice] = useState("");
  const [editMenuError, setEditMenuError] = useState("");
  const [editMenuSubmitting, setEditMenuSubmitting] = useState(false);

  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function handleAddMenuItem(event: React.FormEvent) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMenuError("Please log in again.");
      return;
    }

    if (restaurants.length === 0) {
      setMenuError("No restaurant found.");
      return;
    }

    if (!menuName.trim() || !menuDescription.trim() || !menuPrice) {
      setMenuError("Please complete all fields.");
      return;
    }

    const price = Number(menuPrice);

    if (Number.isNaN(price) || price <= 0) {
      setMenuError("Please enter a valid price.");
      return;
    }

    try {
      setMenuSubmitting(true);
      setMenuError("");

      const restaurantId = restaurants[0].id;

      const newMenuItem = await createMenuItem(
        restaurantId,
        {
          name: menuName.trim(),
          description: menuDescription.trim(),
          price,
        },
        token,
      );

      setMenuItems((currentItems) => [...currentItems, newMenuItem]);

      setMenuName("");
      setMenuDescription("");
      setMenuPrice("");
      setShowAddForm(false);
    } catch {
      setMenuError("Unable to add the menu item.");
    } finally {
      setMenuSubmitting(false);
    }
  }

  function startEditingMenuItem(item: MenuItem) {
    setEditingMenuItemId(item.id);
    setEditMenuName(item.name);
    setEditMenuDescription(item.description);
    setEditMenuPrice(String(item.price));
    setEditMenuError("");
  }

  function cancelEditingMenuItem() {
    setEditingMenuItemId(null);
    setEditMenuName("");
    setEditMenuDescription("");
    setEditMenuPrice("");
    setEditMenuError("");
  }

  async function handleUpdateMenuItem(
    event: React.FormEvent,
    menuItemId: number,
  ) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setEditMenuError("Please log in again.");
      return;
    }

    if (restaurants.length === 0) {
      setEditMenuError("No restaurant found.");
      return;
    }

    if (!editMenuName.trim() || !editMenuDescription.trim() || !editMenuPrice) {
      setEditMenuError("Please complete all fields.");
      return;
    }

    const price = Number(editMenuPrice);

    if (Number.isNaN(price) || price <= 0) {
      setEditMenuError("Please enter a valid price.");
      return;
    }

    try {
      setEditMenuSubmitting(true);
      setEditMenuError("");

      const restaurantId = restaurants[0].id;

      const updatedMenuItem = await updateMenuItem(
        restaurantId,
        menuItemId,
        {
          name: editMenuName.trim(),
          description: editMenuDescription.trim(),
          price,
        },
        token,
      );

      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item.id === menuItemId ? updatedMenuItem : item,
        ),
      );

      cancelEditingMenuItem();
    } catch {
      setEditMenuError("Unable to update the menu item.");
    } finally {
      setEditMenuSubmitting(false);
    }
  }

  async function handleDeleteMenuItem(menuItemId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    if (restaurants.length === 0) {
      setError("No restaurant found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const restaurantId = restaurants[0].id;

      await deleteMenuItem(restaurantId, menuItemId, token);

      setMenuItems((currentItems) =>
        currentItems.filter((item) => item.id !== menuItemId),
      );
    } catch {
      setError("Unable to delete the menu item.");
    }
  }

  async function handleOrderStatusUpdate(orderId: number, status: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      setError("");

      const updatedOrder = await updateOrderStatus(orderId, status, token);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order,
        ),
      );
    } catch {
      setError("Unable to update the order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  function renderOrderActions(order: OrderResponse) {
    const isUpdating = updatingOrderId === order.id;

    if (order.status === "PENDING") {
      return (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "ACCEPTED")}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Accept Order"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "CANCELLED")}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Order
          </button>
        </div>
      );
    }

    if (order.status === "ACCEPTED") {
      return (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "PREPARING")}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Start Preparing"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "CANCELLED")}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Order
          </button>
        </div>
      );
    }

    if (order.status === "PREPARING") {
      return (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "READY")}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Mark Ready"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "CANCELLED")}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Order
          </button>
        </div>
      );
    }

    if (order.status === "READY") {
      return (
        <p className="text-sm font-medium text-neutral-500">
          Ready for driver pickup.
        </p>
      );
    }

    if (order.status === "OUT_FOR_DELIVERY") {
      return (
        <p className="text-sm font-medium text-neutral-500">
          Order is out for delivery.
        </p>
      );
    }

    if (order.status === "DELIVERED") {
      return (
        <p className="text-sm font-medium text-neutral-700">
          Order delivered.
        </p>
      );
    }

    if (order.status === "CANCELLED") {
      return (
        <p className="text-sm font-medium text-neutral-500">
          Order cancelled.
        </p>
      );
    }

    return null;
  }

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
          const restaurantId = myRestaurants[0].id;

          const [restaurantOrders, restaurantMenu] = await Promise.all([
            getRestaurantOrders(restaurantId, token),
            getRestaurantMenu(restaurantId, token),
          ]);

          setOrders(restaurantOrders);
          setMenuItems(restaurantMenu);
        }
      } catch {
        setError("Unable to load the restaurant dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-sm text-neutral-500">
            Loading restaurant dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
              Dashboard
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
          <a
            href="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Back to Chow
          </a>

          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Restaurant Management
            </p>

            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Restaurant Dashboard
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-500">
              Manage your restaurant, menu, and incoming orders from one place.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Restaurant overview */}
        <div>
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Overview
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Your Restaurants
            </h2>
          </div>

          {restaurants.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8">
              <p className="text-neutral-500">
                You don't have any restaurants yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lg font-semibold text-white">
                    {restaurant.name.charAt(0).toUpperCase()}
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                    {restaurant.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {restaurant.description}
                  </p>

                  <div className="mt-6 border-t border-neutral-200 pt-5">
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                      Address
                    </p>

                    <p className="mt-2 text-sm font-medium text-neutral-700">
                      {restaurant.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="mt-20">
          <div className="flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Menu
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Your Menu
              </h2>

              <p className="mt-3 max-w-xl text-neutral-500">
                Manage the food items available at your restaurant.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700">
                {menuItems.length}{" "}
                {menuItems.length === 1 ? "item" : "items"}
              </span>

              {restaurants.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm((current) => !current);
                    setMenuError("");
                  }}
                  className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  {showAddForm ? "Cancel" : "Add Menu Item"}
                </button>
              )}
            </div>
          </div>

          {showAddForm && (
            <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-7 sm:p-8">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
                  New item
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                  Add Menu Item
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  Add a new food item to your restaurant menu.
                </p>

                {menuError && (
                  <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
                    <p className="text-sm text-neutral-700">{menuError}</p>
                  </div>
                )}

                <form onSubmit={handleAddMenuItem} className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="menuName"
                      className="mb-2 block text-sm font-medium text-black"
                    >
                      Item Name
                    </label>

                    <input
                      id="menuName"
                      type="text"
                      value={menuName}
                      onChange={(event) => setMenuName(event.target.value)}
                      placeholder="e.g. Chicken Burger"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="menuDescription"
                      className="mb-2 block text-sm font-medium text-black"
                    >
                      Description
                    </label>

                    <textarea
                      id="menuDescription"
                      value={menuDescription}
                      onChange={(event) =>
                        setMenuDescription(event.target.value)
                      }
                      placeholder="Describe the menu item"
                      rows={3}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="menuPrice"
                      className="mb-2 block text-sm font-medium text-black"
                    >
                      Price
                    </label>

                    <div className="flex">
                      <span className="flex items-center rounded-l-xl border border-r-0 border-neutral-300 bg-white px-4 text-neutral-500">
                        R
                      </span>

                      <input
                        id="menuPrice"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={menuPrice}
                        onChange={(event) => setMenuPrice(event.target.value)}
                        placeholder="75.00"
                        className="w-full rounded-r-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={menuSubmitting}
                    className="w-full rounded-full bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {menuSubmitting ? "Adding..." : "Add Menu Item"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {menuItems.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">
                You don't have any menu items yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {editingMenuItemId === item.id ? (
                    <form
                      onSubmit={(event) => handleUpdateMenuItem(event, item.id)}
                      className="p-7"
                    >
                      <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
                        Editing
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                        {item.name}
                      </h3>

                      {editMenuError && (
                        <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                          <p className="text-sm text-neutral-700">
                            {editMenuError}
                          </p>
                        </div>
                      )}

                      <div className="mt-6 space-y-5">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Item Name
                          </label>

                          <input
                            type="text"
                            value={editMenuName}
                            onChange={(event) =>
                              setEditMenuName(event.target.value)
                            }
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3.5 text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Description
                          </label>

                          <textarea
                            value={editMenuDescription}
                            onChange={(event) =>
                              setEditMenuDescription(event.target.value)
                            }
                            rows={3}
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3.5 text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Price
                          </label>

                          <div className="flex">
                            <span className="flex items-center rounded-l-xl border border-r-0 border-neutral-300 bg-neutral-50 px-4 text-neutral-500">
                              R
                            </span>

                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={editMenuPrice}
                              onChange={(event) =>
                                setEditMenuPrice(event.target.value)
                              }
                              className="w-full rounded-r-xl border border-neutral-300 px-4 py-3.5 text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={editMenuSubmitting}
                            className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {editMenuSubmitting ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditingMenuItem}
                            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-black transition hover:border-black"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex h-40 items-center justify-center bg-neutral-100">
                        <span className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-400">
                          Food
                        </span>
                      </div>

                      <div className="p-7">
                        <h3 className="text-2xl font-semibold tracking-[-0.02em]">
                          {item.name}
                        </h3>

                        <p className="mt-3 min-h-12 text-sm leading-6 text-neutral-500">
                          {item.description}
                        </p>

                        <p className="mt-6 text-xl font-semibold">
                          R{Number(item.price).toFixed(2)}
                        </p>

                        <div className="mt-6 flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEditingMenuItem(item)}
                            className="flex-1 rounded-full border border-neutral-300 px-4 py-3 text-sm font-semibold text-black transition hover:border-black"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="rounded-full border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-600 transition hover:border-black hover:text-black"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="mt-20">
          <div className="flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Orders
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Incoming Orders
              </h2>

              <p className="mt-3 max-w-xl text-neutral-500">
                Orders placed at your restaurant.
              </p>
            </div>

            <span className="w-fit rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center">
              <p className="text-neutral-500">No orders yet.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {orders.map((order) => (
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
                          Customer #{order.customerId}
                        </h3>
                      </div>

                      <span
                        className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] ${
                          order.status === "DELIVERED"
                            ? "bg-black text-white"
                            : order.status === "CANCELLED"
                              ? "bg-neutral-100 text-neutral-500"
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

                    <div className="mt-7 border-t border-neutral-200 pt-6">
                      {renderOrderActions(order)}
                    </div>
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

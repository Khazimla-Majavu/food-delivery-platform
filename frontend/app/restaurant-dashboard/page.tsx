"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  getMyRestaurants,
  getRestaurantOrders,
  getRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  Restaurant,
  OrderResponse,
  MenuItem,
} from "../../lib/api";

export default function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [menuPrice, setMenuPrice] = useState("");

  const [menuError, setMenuError] = useState("");
  const [menuSubmitting, setMenuSubmitting] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function resetMenuForm() {
    setMenuName("");
    setMenuDescription("");
    setMenuPrice("");
    setMenuError("");
    setEditingItemId(null);
    setShowAddForm(false);
  }

  function startEditing(item: MenuItem) {
    setEditingItemId(item.id);
    setMenuName(item.name);
    setMenuDescription(item.description);
    setMenuPrice(String(item.price));
    setMenuError("");
    setShowAddForm(false);
  }

  async function handleAddMenuItem(event: FormEvent<HTMLFormElement>) {
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

      resetMenuForm();
    } catch {
      setMenuError("Unable to add the menu item.");
    } finally {
      setMenuSubmitting(false);
    }
  }

  async function handleUpdateMenuItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMenuError("Please log in again.");
      return;
    }

    if (restaurants.length === 0 || editingItemId === null) {
      setMenuError("Unable to update this menu item.");
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

      const updatedItem = await updateMenuItem(
        restaurantId,
        editingItemId,
        {
          name: menuName.trim(),
          description: menuDescription.trim(),
          price,
        },
        token,
      );

      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item,
        ),
      );

      resetMenuForm();
    } catch {
      setMenuError("Unable to update the menu item.");
    } finally {
      setMenuSubmitting(false);
    }
  }

  async function handleDeleteMenuItem(menuItemId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMenuError("Please log in again.");
      return;
    }

    if (restaurants.length === 0) {
      setMenuError("No restaurant found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingItemId(menuItemId);
      setMenuError("");

      const restaurantId = restaurants[0].id;

      await deleteMenuItem(restaurantId, menuItemId, token);

      setMenuItems((currentItems) =>
        currentItems.filter((item) => item.id !== menuItemId),
      );

      if (editingItemId === menuItemId) {
        resetMenuForm();
      }
    } catch {
      setMenuError("Unable to delete the menu item.");
    } finally {
      setDeletingItemId(null);
    }
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
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-gray-600">Loading restaurant dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-xl border border-red-200 bg-white p-6">
            <h1 className="text-2xl font-bold text-red-600">Dashboard Error</h1>

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
            Manage your restaurant, menu, and incoming orders.
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Restaurants */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Restaurants</h2>

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

        {/* Menu */}
        <div className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Menu</h2>

              <p className="mt-1 text-gray-600">
                Manage the food items available at your restaurant.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                {menuItems.length} {menuItems.length === 1 ? "item" : "items"}
              </span>

              {restaurants.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (showAddForm) {
                      resetMenuForm();
                    } else {
                      setEditingItemId(null);
                      setMenuName("");
                      setMenuDescription("");
                      setMenuPrice("");
                      setMenuError("");
                      setShowAddForm(true);
                    }
                  }}
                  className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
                >
                  {showAddForm ? "Cancel" : "Add Menu Item"}
                </button>
              )}
            </div>
          </div>

          {/* Menu Error */}
          {menuError && !showAddForm && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{menuError}</p>
            </div>
          )}

          {/* Add Menu Item Form */}
          {showAddForm && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Menu Item
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Add a new food item to your restaurant menu.
              </p>

              {menuError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{menuError}</p>
                </div>
              )}

              <form onSubmit={handleAddMenuItem} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="menuName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item Name
                  </label>

                  <input
                    id="menuName"
                    type="text"
                    value={menuName}
                    onChange={(event) => setMenuName(event.target.value)}
                    placeholder="e.g. Chicken Burger"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="menuDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="menuDescription"
                    value={menuDescription}
                    onChange={(event) => setMenuDescription(event.target.value)}
                    placeholder="Describe the menu item"
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="menuPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>

                  <div className="mt-2 flex">
                    <span className="flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-gray-600">
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
                      className="w-full rounded-r-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={menuSubmitting}
                    className="flex-1 rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {menuSubmitting ? "Adding..." : "Add Menu Item"}
                  </button>

                  <button
                    type="button"
                    onClick={resetMenuForm}
                    disabled={menuSubmitting}
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Menu Item Form */}
          {editingItemId !== null && (
            <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Menu Item
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Update the details of this menu item.
              </p>

              {menuError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-600">{menuError}</p>
                </div>
              )}

              <form onSubmit={handleUpdateMenuItem} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="editMenuName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item Name
                  </label>

                  <input
                    id="editMenuName"
                    type="text"
                    value={menuName}
                    onChange={(event) => setMenuName(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editMenuDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="editMenuDescription"
                    value={menuDescription}
                    onChange={(event) => setMenuDescription(event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editMenuPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>

                  <div className="mt-2 flex">
                    <span className="flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 px-4 text-gray-600">
                      R
                    </span>

                    <input
                      id="editMenuPrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={menuPrice}
                      onChange={(event) => setMenuPrice(event.target.value)}
                      className="w-full rounded-r-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={menuSubmitting}
                    className="flex-1 rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {menuSubmitting ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={resetMenuForm}
                    disabled={menuSubmitting}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Menu Items */}
          {menuItems.length === 0 ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-gray-600">
                You don't have any menu items yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.name}
                    </h3>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      #{item.id}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>

                  <p className="mt-4 text-lg font-bold text-orange-600">
                    R{Number(item.price).toFixed(2)}
                  </p>

                  <div className="mt-5 flex gap-3 border-t border-gray-100 pt-5">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      disabled={deletingItemId === item.id}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMenuItem(item.id)}
                      disabled={deletingItemId === item.id}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingItemId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
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
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-gray-600">No orders yet.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {orders.map((order) => (
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

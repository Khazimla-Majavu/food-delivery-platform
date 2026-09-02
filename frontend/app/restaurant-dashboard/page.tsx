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
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Accept Order"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "CANCELLED")}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Start Preparing"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "CANCELLED")}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Mark Ready"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleOrderStatusUpdate(order.id, "CANCELLED")}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Order
          </button>
        </div>
      );
    }

    if (order.status === "READY") {
      return (
        <p className="text-sm font-medium text-gray-600">
          Ready for driver pickup.
        </p>
      );
    }

    if (order.status === "OUT_FOR_DELIVERY") {
      return (
        <p className="text-sm font-medium text-gray-600">
          Order is out for delivery.
        </p>
      );
    }

    if (order.status === "DELIVERED") {
      return (
        <p className="text-sm font-medium text-green-600">Order delivered.</p>
      );
    }

    if (order.status === "CANCELLED") {
      return (
        <p className="text-sm font-medium text-red-600">Order cancelled.</p>
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

      <section className="mx-auto max-w-7xl px-6 py-12">
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
                    setShowAddForm((current) => !current);
                    setMenuError("");
                  }}
                  className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
                >
                  {showAddForm ? "Cancel" : "Add Menu Item"}
                </button>
              )}
            </div>
          </div>

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

                <button
                  type="submit"
                  disabled={menuSubmitting}
                  className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {menuSubmitting ? "Adding..." : "Add Menu Item"}
                </button>
              </form>
            </div>
          )}

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
                  {editingMenuItemId === item.id ? (
                    <form
                      onSubmit={(event) => handleUpdateMenuItem(event, item.id)}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900">
                        Edit Menu Item
                      </h3>

                      {editMenuError && (
                        <p className="text-sm text-red-600">{editMenuError}</p>
                      )}

                      <input
                        type="text"
                        value={editMenuName}
                        onChange={(event) =>
                          setEditMenuName(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
                      />

                      <textarea
                        value={editMenuDescription}
                        onChange={(event) =>
                          setEditMenuDescription(event.target.value)
                        }
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
                      />

                      <div className="flex">
                        <span className="flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-gray-600">
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
                          className="w-full rounded-r-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={editMenuSubmitting}
                          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {editMenuSubmitting ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditingMenuItem}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-gray-600">
                        {item.description}
                      </p>

                      <p className="mt-4 text-lg font-bold text-orange-600">
                        R{Number(item.price).toFixed(2)}
                      </p>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEditingMenuItem(item)}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

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

                  <div className="mt-5 border-t border-gray-100 pt-5">
                    {renderOrderActions(order)}
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

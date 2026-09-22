"use client";

import { useEffect, useState } from "react";
import {
  getFinancialRecord,
  backfillFinancialRecords,
  getFinancialSummary,
  getUsers,
  getAdminOrders,
  getAdminRestaurants,
  getAdminPayments,
  FinancialRecordResponse,
  FinancialSummaryResponse,
  PaymentResponse,
  UserResponse,
  OrderResponse,
  Restaurant,
} from "@/lib/api";

export default function AdminPage() {
  const [orderId, setOrderId] = useState("");
  const [record, setRecord] = useState<FinancialRecordResponse | null>(null);
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummaryResponse | null>(null);
  const [financialSummaryError, setFinancialSummaryError] = useState("");
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [error, setError] = useState("");
  const [usersError, setUsersError] = useState("");
  const [ordersError, setOrdersError] = useState("");
  const [restaurantsError, setRestaurantsError] = useState("");
  const [paymentsError, setPaymentsError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      const token = localStorage.getItem("token");

      if (!token) {
        setUsersError("You must be logged in.");
        return;
      }

      try {
        const data = await getUsers(token);
        setUsers(data);
      } catch {
        setUsersError("Unable to load users.");
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("token");

      if (!token) {
        setOrdersError("You must be logged in.");
        return;
      }

      try {
        const data = await getAdminOrders(token);
        setOrders(data);
      } catch {
        setOrdersError("Unable to load orders.");
      }
    }

    loadOrders();
  }, []);

  useEffect(() => {
    async function loadRestaurants() {
      const token = localStorage.getItem("token");

      if (!token) {
        setRestaurantsError("You must be logged in.");
        return;
      }

      try {
        const data = await getAdminRestaurants(token);
        setRestaurants(data);
      } catch {
        setRestaurantsError("Unable to load restaurants.");
      }
    }

    loadRestaurants();
  }, []);

  useEffect(() => {
    async function loadFinancialSummary() {
      const token = localStorage.getItem("token");

      if (!token) {
        setFinancialSummaryError("You must be logged in.");
        return;
      }

      try {
        const data = await getFinancialSummary(token);
        setFinancialSummary(data);
      } catch {
        setFinancialSummaryError("Unable to load financial summary.");
      }
    }

    loadFinancialSummary();
  }, []);

  useEffect(() => {
    async function loadPayments() {
      const token = localStorage.getItem("token");

      if (!token) {
        setPaymentsError("You must be logged in.");
        return;
      }

      try {
        const data = await getAdminPayments(token);
        setPayments(data);
      } catch {
        setPaymentsError("Unable to load payments.");
      }
    }

    loadPayments();
  }, []);

  async function handleSearch() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    if (!orderId) {
      setError("Enter an order ID.");
      return;
    }

    try {
      setError("");
      const data = await getFinancialRecord(Number(orderId), token);
      setRecord(data);
    } catch {
      setRecord(null);
      setError("Unable to load financial record.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 rounded-lg border p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Financial Summary
          </h2>

          <button
            onClick={async () => {
              const token = localStorage.getItem("token");

              if (!token) {
                setFinancialSummaryError("You must be logged in.");
                return;
              }

              try {
                await backfillFinancialRecords(token);
                const updatedSummary = await getFinancialSummary(token);
                setFinancialSummary(updatedSummary);
                setFinancialSummaryError("");
              } catch {
                setFinancialSummaryError(
                  "Unable to backfill financial records.",
                );
              }
            }}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Backfill Financial Records
          </button>
        </div>

        {financialSummaryError && (
          <p className="text-red-600">
            {financialSummaryError}
          </p>
        )}

        {financialSummary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-600">
                Completed Orders
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {financialSummary.completedOrders}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-600">
                Restaurant Commissions
              </p>
              <p className="mt-2 text-2xl font-semibold">
                R{financialSummary.totalRestaurantCommission.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-600">
                Driver Commissions
              </p>
              <p className="mt-2 text-2xl font-semibold">
                R{financialSummary.totalDriverCommission.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-600">
                Driver Earnings
              </p>
              <p className="mt-2 text-2xl font-semibold">
                R{financialSummary.totalDriverEarnings.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-600">
                Platform Revenue
              </p>
              <p className="mt-2 text-2xl font-semibold">
                R{financialSummary.totalPlatformRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Payments
        </h2>

        {paymentsError && (
          <p className="text-red-600">
            {paymentsError}
          </p>
        )}

        {!paymentsError && payments.length === 0 && (
          <p className="text-gray-600">
            No payments found.
          </p>
        )}

        {payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="px-4 py-3">{payment.id}</td>
                    <td className="px-4 py-3">{payment.orderId}</td>
                    <td className="px-4 py-3">
                      R{payment.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{payment.status}</td>
                    <td className="px-4 py-3">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Restaurants
        </h2>

        {restaurantsError && (
          <p className="text-red-600">
            {restaurantsError}
          </p>
        )}

        {!restaurantsError && restaurants.length === 0 && (
          <p className="text-gray-600">
            No restaurants found.
          </p>
        )}

        {restaurants.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Owner</th>
                </tr>
              </thead>

              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="border-b">
                    <td className="px-4 py-3">{restaurant.id}</td>
                    <td className="px-4 py-3">{restaurant.name}</td>
                    <td className="px-4 py-3">
                      {restaurant.description}
                    </td>
                    <td className="px-4 py-3">
                      {restaurant.address}
                    </td>
                    <td className="px-4 py-3">
                      {restaurant.ownerId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Orders
        </h2>

        {ordersError && (
          <p className="text-red-600">
            {ordersError}
          </p>
        )}

        {!ordersError && orders.length === 0 && (
          <p className="text-gray-600">
            No orders found.
          </p>
        )}

        {orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Restaurant</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Subtotal</th>
                  <th className="px-4 py-3">Delivery</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">{order.customerId}</td>
                    <td className="px-4 py-3">{order.restaurantName}</td>
                    <td className="px-4 py-3">
                      {order.driverId ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-3">
                      R{order.subtotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      R{order.deliveryFee.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      R{order.serviceFee.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      R{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Users
        </h2>

        {usersError && (
          <p className="text-red-600">
            {usersError}
          </p>
        )}

        {!usersError && users.length === 0 && (
          <p className="text-gray-600">
            No users found.
          </p>
        )}

        {users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

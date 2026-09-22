"use client";

import { useEffect, useState } from "react";
import {
  getFinancialRecord,
  getUsers,
  FinancialRecordResponse,
  UserResponse,
} from "@/lib/api";

export default function AdminPage() {
  const [orderId, setOrderId] = useState("");
  const [record, setRecord] = useState<FinancialRecordResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [error, setError] = useState("");
  const [usersError, setUsersError] = useState("");

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
        <h2 className="mb-4 text-xl font-semibold">
          Order Financials
        </h2>

        <div className="flex gap-3">
          <input
            type="number"
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Order ID"
            className="rounded border px-3 py-2"
          />

          <button
            onClick={handleSearch}
            className="rounded bg-black px-4 py-2 text-white"
          >
            View
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}
      </div>

      {record && (
        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-6 text-xl font-semibold">
            Order #{record.orderId}
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Restaurant commission</span>
              <strong>R{record.restaurantCommission.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between">
              <span>Driver commission</span>
              <strong>R{record.driverCommission.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between">
              <span>Driver earnings</span>
              <strong>R{record.driverEarnings.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between border-t pt-4">
              <span>Platform revenue</span>
              <strong>R{record.platformRevenue.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}

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

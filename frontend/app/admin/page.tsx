"use client";

import { useState } from "react";
import { getFinancialRecord, FinancialRecordResponse } from "@/lib/api";

export default function AdminPage() {
  const [orderId, setOrderId] = useState("");
  const [record, setRecord] = useState<FinancialRecordResponse | null>(null);
  const [error, setError] = useState("");

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
    <main className="mx-auto max-w-4xl p-6">
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
        <div className="rounded-lg border p-6">
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
    </main>
  );
}

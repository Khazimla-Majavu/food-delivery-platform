"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getNotifications,
  NotificationResponse,
} from "../../lib/api";
import { getToken, getUser } from "../../lib/auth";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      const user = getUser();
      const token = getToken();

      if (!user || user.role !== "CUSTOMER" || !token) {
        setError("Please log in as a customer to view notifications.");
        setLoading(false);
        return;
      }

      try {
        const data = await getNotifications(token);
        setNotifications(data);
      } catch {
        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Notifications
        </h1>
        <p className="mt-4 text-gray-600">Loading notifications...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>
          <p className="mt-2 text-gray-600">
            Updates about your orders.
          </p>
        </div>

        <Link
          href="/orders"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          My Orders
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!error && notifications.length === 0 && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-gray-600">
          You have no notifications.
        </div>
      )}

      {!error && notifications.length > 0 && (
        <div className="mt-8 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${
                notification.read
                  ? "border-gray-200 bg-white"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium text-gray-900">
                  {notification.message}
                </p>

                {!notification.read && (
                  <span className="rounded-full bg-orange-600 px-2 py-1 text-xs font-bold text-white">
                    New
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

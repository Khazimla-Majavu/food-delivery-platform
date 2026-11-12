"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getNotifications,
  markNotificationAsRead,
  NotificationResponse,
} from "../../lib/api";
import { getToken, getUser } from "../../lib/auth";
import RoleGuard from "../components/RoleGuard";

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

        await Promise.all(
          data
            .filter((notification) => !notification.read)
            .map((notification) =>
              markNotificationAsRead(notification.id, token),
            ),
        );

        setNotifications(
          data.map((notification) => ({
            ...notification,
            read: true,
          })),
        );

        window.dispatchEvent(new Event("notifications-read"));
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
        <h1 className="text-3xl font-bold text-[#F3EFE5]">
          Notifications
        </h1>
        <p className="mt-4 text-[#B8B7AE]">Loading notifications...</p>
      </main>
    );
  }

  return (
    <RoleGuard allowedRoles={["CUSTOMER"]}>
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F3EFE5]">
            Notifications
          </h1>
          <p className="mt-2 text-[#B8B7AE]">
            Updates about your orders.
          </p>
        </div>

        <Link
          href="/orders"
          className="rounded-lg border border-[#465453] px-4 py-2 text-sm font-medium text-[#B8B7AE] hover:bg-[#263234]"
        >
          My Orders
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-[#754B43] bg-[#302322] p-4 text-[#FF9A86]">
          {error}
        </div>
      )}

      {!error && notifications.length === 0 && (
        <div className="mt-8 rounded-lg border border-[#303D3E] bg-[#202B2D] p-6 text-[#B8B7AE]">
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
                  ? "border-[#303D3E] bg-[#202B2D]"
                  : "border-[#465453] bg-[#263234]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium text-[#F3EFE5]">
                  {notification.message}
                </p>

                {!notification.read && (
                  <span className="rounded-full bg-[#A8DFC5] px-2 py-1 text-xs font-bold text-[#17201D]">
                    New
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-[#89938E]">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      </main>
    </RoleGuard>
  );
}

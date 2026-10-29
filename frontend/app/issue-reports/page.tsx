"use client";

import { useCallback, useEffect, useState } from "react";
import RoleGuard from "../components/RoleGuard";
import {
  getMyOrderIssueReports,
  OrderIssueReportResponse,
  OrderIssueStatus,
} from "@/lib/api";

const statuses: OrderIssueStatus[] = ["OPEN", "IN_REVIEW", "RESOLVED"];

function statusLabel(status: OrderIssueStatus) {
  if (status === "IN_REVIEW") return "In review";
  if (status === "RESOLVED") return "Resolved";
  return "Open";
}

function statusStyle(status: OrderIssueStatus) {
  if (status === "RESOLVED") {
    return "border-neutral-300 bg-neutral-100 text-neutral-700";
  }
  if (status === "IN_REVIEW") {
    return "border-blue-200 bg-blue-50 text-blue-800";
  }
  return "border-amber-200 bg-amber-50 text-amber-800";
}

export default function IssueReportsPage() {
  const [reports, setReports] = useState<OrderIssueReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your issue reports.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const data = await getMyOrderIssueReports(token);
      setReports(
        [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        ),
      );
    } catch {
      setError("Unable to load your reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  return (
    <RoleGuard allowedRoles={["CUSTOMER", "DRIVER"]}>
      <main className="min-h-screen bg-white px-4 py-10 text-black sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <a
            href="/"
            className="text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ← Back to home
          </a>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Your account
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                My issue reports
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-neutral-500">
                Track reports you have submitted to Chow and check their latest status.
                Your reports are private to you and the Chow team.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void loadReports();
              }}
              className="w-fit rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-black"
            >
              Refresh reports
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {statuses.map((status) => (
              <div
                key={status}
                className="rounded-2xl border border-neutral-200 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {statusLabel(status)}
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {reports.filter((report) => report.status === status).length}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-200 p-5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {loading ? (
            <p className="py-12 text-sm text-neutral-500">
              Loading your reports...
            </p>
          ) : reports.length === 0 && !error ? (
            <div className="mt-8 rounded-3xl border border-neutral-200 px-6 py-12 text-center">
              <h2 className="text-lg font-semibold">No reports submitted</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                When you submit a report about an order, you can track its progress here.
              </p>
              <a
                href="/orders"
                className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                View my orders
              </a>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-3xl border border-neutral-200 p-5 sm:p-7"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                        Report #{report.id} · Order #{report.orderId}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold">
                        {report.category.replaceAll("_", " ")}
                      </h2>
                      <p className="mt-2 text-xs text-neutral-500">
                        Submitted {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-2 text-xs font-semibold ${statusStyle(report.status)}`}
                    >
                      {statusLabel(report.status)}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-700">
                      {report.description}
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-neutral-500">
                    Last updated {new Date(report.updatedAt).toLocaleString()}
                  </p>

                  {report.status === "RESOLVED" && (
                    <p className="mt-3 text-sm font-medium text-neutral-700">
                      This report has been marked as resolved by the Chow team.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </RoleGuard>
  );
}

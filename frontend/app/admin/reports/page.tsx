"use client";

import { useCallback, useEffect, useState } from "react";
import RoleGuard from "../../components/RoleGuard";
import {
  getAdminOrderIssueReports,
  updateOrderIssueReportStatus,
  OrderIssueReportResponse,
  OrderIssueStatus,
} from "@/lib/api";

const statuses: OrderIssueStatus[] = ["OPEN", "IN_REVIEW", "RESOLVED"];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<OrderIssueReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadReports = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in as an administrator.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      const data = await getAdminOrderIssueReports(token);
      setReports(data);
    } catch {
      setError("Unable to load issue reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  async function changeStatus(
    reportId: number,
    status: OrderIssueStatus,
  ) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Your session is missing. Please log in again.");
      return;
    }

    setUpdatingId(reportId);
    setError("");

    try {
      const updated = await updateOrderIssueReportStatus(
        reportId,
        status,
        token,
      );
      setReports((current) =>
        current.map((report) =>
          report.id === reportId ? updated : report,
        ),
      );
    } catch {
      setError(`Unable to update report #${reportId}.`);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Chow administration
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Order issue reports
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Review private reports submitted by customers and drivers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadReports();
            }}
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-100"
          >
            Refresh reports
          </button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {statuses.map((status) => (
            <div
              key={status}
              className="rounded-2xl border border-neutral-200 p-5"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                {status.replaceAll("_", " ")}
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {reports.filter((report) => report.status === status).length}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <p role="alert" className="mb-5 rounded-xl border border-red-200 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-10 text-sm text-neutral-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 p-10 text-center">
            <h2 className="font-semibold">No issue reports yet</h2>
            <p className="mt-2 text-sm text-neutral-500">
              New customer and driver reports will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                      Report #{report.id} · Order #{report.orderId}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold">
                      {report.category.replaceAll("_", " ")}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      Reported by {report.reporterName} ({report.reporterRole})
                    </p>
                    {report.reportedUserId != null && (
                      <p className="mt-1 text-xs text-neutral-500">
                        Related user ID: {report.reportedUserId}
                      </p>
                    )}
                  </div>

                  <label className="flex flex-col gap-2 text-sm font-medium">
                    Report status
                    <select
                      value={report.status}
                      disabled={updatingId === report.id}
                      onChange={(event) =>
                        void changeStatus(
                          report.id,
                          event.target.value as OrderIssueStatus,
                        )
                      }
                      className="min-w-44 rounded-xl border border-neutral-300 bg-white px-3 py-2.5 disabled:opacity-50"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 rounded-xl bg-neutral-50 p-4">
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-neutral-800">
                    {report.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-1 text-xs text-neutral-500 sm:flex-row sm:justify-between">
                  <span>
                    Submitted: {new Date(report.createdAt).toLocaleString()}
                  </span>
                  <span>
                    Updated: {new Date(report.updatedAt).toLocaleString()}
                  </span>
                </div>

                {updatingId === report.id && (
                  <p className="mt-3 text-xs text-neutral-500">
                    Updating status...
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </RoleGuard>
  );
}

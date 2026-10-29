"use client";

import { FormEvent, useState } from "react";
import {
  createOrderIssueReport,
  OrderIssueCategory,
} from "../../lib/api";

const commonCategories: { value: OrderIssueCategory; label: string }[] = [
  { value: "MISSING_ITEMS", label: "Missing items" },
  { value: "WRONG_ORDER", label: "Wrong order" },
  { value: "LATE_DELIVERY", label: "Late delivery" },
  { value: "RESTAURANT_ISSUE", label: "Restaurant issue" },
  { value: "DELIVERY_ADDRESS", label: "Delivery address issue" },
  { value: "PAYMENT_ISSUE", label: "Payment issue" },
  { value: "SAFETY_CONCERN", label: "Safety concern" },
  { value: "OTHER", label: "Other issue" },
];

export default function ReportOrderIssueForm({
  orderId,
  role,
}: {
  orderId: number;
  role: "CUSTOMER" | "DRIVER";
}) {
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState<OrderIssueCategory>(
    role === "DRIVER" ? "CUSTOMER_CONDUCT" : "MISSING_ITEMS",
  );
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    ...commonCategories,
    ...(role === "CUSTOMER"
      ? [{ value: "DRIVER_CONDUCT" as const, label: "Driver conduct" }]
      : [{ value: "CUSTOMER_CONDUCT" as const, label: "Customer conduct" }]),
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = description.trim();
    if (!trimmed || trimmed.length > 2000 || submitting) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again to submit a report.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await createOrderIssueReport(orderId, category, trimmed, token);
      setSuccess("Your report has been submitted privately to the Chow team.");
      setDescription("");
      setExpanded(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your report.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-5 rounded-3xl border border-neutral-200 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Report an issue</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Your report is private and reviewed by the Chow team.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setExpanded((current) => !current);
            setError("");
          }}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-black"
          aria-expanded={expanded}
        >
          {expanded ? "Close form" : "Report issue"}
        </button>
      </div>

      {success && (
        <p role="status" className="mt-4 text-sm text-neutral-700">{success}</p>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>
      )}

      {expanded && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor={`issue-category-${orderId}`} className="mb-2 block text-sm font-medium">
              What happened?
            </label>
            <select
              id={`issue-category-${orderId}`}
              value={category}
              onChange={(event) => setCategory(event.target.value as OrderIssueCategory)}
              className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`issue-description-${orderId}`} className="mb-2 block text-sm font-medium">
              Details
            </label>
            <textarea
              id={`issue-description-${orderId}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={4}
              required
              placeholder="Describe the issue so our team can review it."
              className="w-full resize-y rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
            <p className="mt-1 text-right text-xs text-neutral-400">
              {description.length}/2000
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting || !description.trim()}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Submit private report"}
          </button>
        </form>
      )}
    </section>
  );
}

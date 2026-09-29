"use client";

import { useParams, useRouter } from "next/navigation";
import RoleGuard from "../../components/RoleGuard";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id;

  return (
    <RoleGuard allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
            ✓
          </div>

          <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Payment successful
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Order confirmed
          </h1>

          <p className="mt-5 text-lg leading-8 text-neutral-500">
            Your order has been successfully placed and paid for.
            The restaurant can now begin processing your order.
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-neutral-50 p-6">
            <p className="text-sm text-neutral-500">
              Order number
            </p>

            <p className="mt-2 text-3xl font-semibold">
              #{orderId}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/orders")}
              className="rounded-full bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              View my orders
            </button>

            <button
              onClick={() => router.push("/")}
              className="rounded-full border border-neutral-300 px-7 py-4 text-sm font-semibold transition hover:border-black"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </section>
      </main>
    </RoleGuard>
  );
}

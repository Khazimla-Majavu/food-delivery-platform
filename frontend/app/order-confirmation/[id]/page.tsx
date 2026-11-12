"use client";

import { useParams, useRouter } from "next/navigation";
import RoleGuard from "../../components/RoleGuard";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id;

  return (
    <RoleGuard allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[#14191B] text-[#F3EFE5]">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-[#303D3E] bg-[#1C2728] p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#A8DFC5] text-2xl text-[#14191B]">
            ✓
          </div>

          <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-[#B8B7AE]">
            Payment successful
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Order confirmed
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#B8B7AE]">
            Your order has been successfully placed and paid for.
            The restaurant can now begin processing your order.
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-[#202B2D] p-6">
            <p className="text-sm text-[#B8B7AE]">
              Order number
            </p>

            <p className="mt-2 text-3xl font-semibold">
              #{orderId}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => router.push("/orders")}
              className="rounded-full bg-[#A8DFC5] px-7 py-4 text-sm font-semibold text-[#14191B] transition hover:bg-[#BCEBD5]"
            >
              View my orders
            </button>

            <button
              onClick={() => router.push("/")}
              className="rounded-full border border-[#465453] px-7 py-4 text-sm font-semibold text-[#F3EFE5] transition hover:border-[#A8DFC5]"
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

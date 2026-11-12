"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "../../lib/api";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [message, setMessage] = useState(
    "Confirm your email address to activate your Chow account."
  );
  const [status, setStatus] = useState<"ready" | "loading" | "success" | "error">(
    "ready"
  );

  async function handleVerify() {
    if (!token || status === "loading" || status === "success") {
      return;
    }

    setStatus("loading");
    setMessage("Verifying your email...");

    try {
      const result = await verifyEmail(token);
      setMessage(result);
      setStatus("success");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Verification failed. Please request a new verification email."
      );
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#14191B] px-6 text-[#F3EFE5]">
      <section className="w-full max-w-md text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Chow</h1>
        <h2 className="mt-8 text-xl font-semibold">
          {status === "success"
            ? "Email verified successfully"
            : "Verify your email"}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#B8B7AE]">{message}</p>

        {status !== "success" && (
          <button
            type="button"
            onClick={handleVerify}
            disabled={!token || status === "loading"}
            className="mt-8 inline-flex rounded-full bg-[#A8DFC5] px-6 py-3 text-sm font-semibold text-[#14191B] transition hover:bg-[#BCEBD5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Verifying..." : "Confirm email"}
          </button>
        )}

        <div>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-full border border-[#465453] px-6 py-3 text-sm font-semibold text-[#F3EFE5] transition hover:border-[#A8DFC5]"
          >
            Go to login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#14191B] p-8 text-center text-[#F3EFE5]">Loading...</main>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

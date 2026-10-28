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
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
      <section className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Chow</h1>
        <h2 className="mt-8 text-xl font-semibold">
          {status === "success"
            ? "Email verified successfully"
            : "Verify your email"}
        </h2>
        <p className="mt-4 text-sm leading-6 text-neutral-600">{message}</p>

        {status !== "success" && (
          <button
            type="button"
            onClick={handleVerify}
            disabled={!token || status === "loading"}
            className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Verifying..." : "Confirm email"}
          </button>
        )}

        <div>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-full border border-black px-6 py-3 text-sm font-semibold text-black"
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
    <Suspense fallback={<main className="p-8 text-center">Loading...</main>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

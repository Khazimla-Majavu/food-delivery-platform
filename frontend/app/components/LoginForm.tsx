"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login, resendVerification } from "../../lib/api";

interface LoginFormProps {
  redirect?: string;
}

function getRoleRoute(role: string): string {
  switch (role) {
    case "RESTAURANT":
      return "/restaurant-dashboard";
    case "DRIVER":
      return "/driver-dashboard";
    case "ADMIN":
      return "/admin";
    case "CUSTOMER":
    default:
      return "/";
  }
}

export default function LoginForm({ redirect = "/" }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("auth-change"));

      const role = data.user.role;

      if (role === "CUSTOMER" && redirect !== "/") {
        router.push(redirect);
      } else {
        router.push(getRoleRoute(role));
      }

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#F3EFE5]"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3.5 text-[#F3EFE5] outline-none transition placeholder:text-[#89938E] focus:border-[#A8DFC5] focus:ring-1 focus:ring-[#A8DFC5]"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#F3EFE5]"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3.5 text-[#F3EFE5] outline-none transition placeholder:text-[#89938E] focus:border-[#A8DFC5] focus:ring-1 focus:ring-[#A8DFC5]"
          placeholder="Your password"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3">
          <p className="text-sm text-[#FF8068]">{error}</p>
          {error.toLowerCase().includes("verify your email") && (
            <button
              type="button"
              disabled={resending || !email.trim()}
              onClick={async () => {
                setResending(true);
                setResendMessage("");
                try {
                  setResendMessage(await resendVerification(email.trim()));
                } catch (resendError) {
                  setResendMessage(resendError instanceof Error ? resendError.message : "Unable to resend verification email.");
                } finally {
                  setResending(false);
                }
              }}
              className="mt-3 text-sm font-semibold text-[#A8DFC5] underline underline-offset-4 disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          )}
          {resendMessage && <p className="mt-2 text-sm text-[#B8B7AE]">{resendMessage}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#A8DFC5] px-5 py-4 text-sm font-semibold text-[#14191B] transition hover:bg-[#BDE9D3] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}

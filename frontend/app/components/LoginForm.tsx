"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/api";

interface LoginFormProps {
  redirect?: string;
}

export default function LoginForm({ redirect = "/" }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.dispatchEvent(new Event("auth-change"));

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-black"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-black"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
          placeholder="Your password"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="text-sm text-neutral-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}

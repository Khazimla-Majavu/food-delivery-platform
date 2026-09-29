"use client";

import { FormEvent, useState } from "react";
import { register } from "../../lib/api";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, phone, password);

      setSuccess("Account created successfully. You can now log in.");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-black"
        >
          Full name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
          placeholder="Your name"
        />
      </div>

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
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-black"
        >
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
          placeholder="0821234567"
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
          minLength={8}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-black"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={8}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
          placeholder="Repeat your password"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="text-sm text-neutral-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <p className="text-sm text-neutral-700">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-black px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

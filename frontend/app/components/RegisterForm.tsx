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

      setSuccess("Account created. Check your email to verify your address before logging in.");

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
          className="mb-2 block text-sm font-medium text-[#F3EFE5]"
        >
          Full name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3.5 text-[#F3EFE5] outline-none transition placeholder:text-[#89938E] focus:border-[#A8DFC5] focus:ring-1 focus:ring-[#A8DFC5]"
          placeholder="Your name"
        />
      </div>

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
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-[#F3EFE5]"
        >
          Phone
        </label>

        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          className="w-full rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3.5 text-[#F3EFE5] outline-none transition placeholder:text-[#89938E] focus:border-[#A8DFC5] focus:ring-1 focus:ring-[#A8DFC5]"
          placeholder="0821234567"
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
          minLength={8}
          className="w-full rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3.5 text-[#F3EFE5] outline-none transition placeholder:text-[#89938E] focus:border-[#A8DFC5] focus:ring-1 focus:ring-[#A8DFC5]"
          placeholder="At least 8 characters"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-[#F3EFE5]"
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
          className="w-full rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3.5 text-[#F3EFE5] outline-none transition placeholder:text-[#89938E] focus:border-[#A8DFC5] focus:ring-1 focus:ring-[#A8DFC5]"
          placeholder="Repeat your password"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3">
          <p className="text-sm text-[#FF8068]">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-[#465453] bg-[#202B2D] px-4 py-3">
          <p className="text-sm text-[#A8DFC5]">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#A8DFC5] px-5 py-4 text-sm font-semibold text-[#14191B] transition hover:bg-[#BCEBD5] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

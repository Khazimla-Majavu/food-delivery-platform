"use client";

import { FormEvent, useState } from "react";
import { submitWorkWithChowEnquiry } from "@/lib/api";

export default function WorkWithChowPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const type = String(formData.get("type") ?? "");

    if (type !== "RESTAURANT" && type !== "DRIVER") {
      setErrorMessage("Please choose Restaurant or Driver.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await submitWorkWithChowEnquiry({
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        type,
        message: String(formData.get("message") ?? ""),
        website: String(formData.get("company-website-check") ?? ""),
      });

      setSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't send your enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-white text-black">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center px-6 py-16 lg:px-8">
          <div className="w-full rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
              ✓
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Thanks for reaching out.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-neutral-600">
              We&apos;ve received your interest in working with Chow. We&apos;ll
              review your details and get in touch with you soon.
            </p>

            <a
              href="/"
              className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Back to Chow
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white text-black">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Work with Chow
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Let&apos;s work together.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
              Whether you&apos;re a restaurant looking to reach more customers
              or a driver looking for delivery opportunities, leave your
              details and we&apos;ll get in touch.
            </p>

            <div className="mt-10 space-y-4 text-sm text-neutral-500">
              <p>Restaurants — bring your food to more customers.</p>
              <p>Drivers — help us deliver great food.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px overflow-hidden"
              >
                <label htmlFor="company-website-check">Leave this field empty</label>
                <input
                  id="company-website-check"
                  name="company-website-check"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Your phone number"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black"
                />
              </div>

              <fieldset>
                <legend className="mb-3 block text-sm font-medium text-black">
                  I&apos;d like to work with Chow as a
                </legend>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="RESTAURANT"
                      required
                      className="peer sr-only"
                    />

                    <span className="flex rounded-2xl border border-neutral-300 bg-white px-4 py-4 text-sm font-medium transition peer-checked:border-black peer-checked:bg-black peer-checked:text-white">
                      Restaurant
                    </span>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="DRIVER"
                      required
                      className="peer sr-only"
                    />

                    <span className="flex rounded-2xl border border-neutral-300 bg-white px-4 py-4 text-sm font-medium transition peer-checked:border-black peer-checked:bg-black peer-checked:text-white">
                      Driver
                    </span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Message{" "}
                  <span className="text-neutral-400">(optional)</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us a little about yourself or your business..."
                  className="w-full resize-none rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black"
                />
              </div>

              {errorMessage && (
                <p role="alert" className="text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send enquiry"}
              </button>

              <p className="text-center text-xs leading-5 text-neutral-500">
                By submitting this form, you&apos;re asking Chow to contact you
                about working with us.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

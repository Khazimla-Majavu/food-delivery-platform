"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RestaurantList from "./components/RestaurantList";
import { getToken, getUser } from "../lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (token && user && user.role !== "CUSTOMER") {
      const roleRoutes: Record<string, string> = {
        RESTAURANT: "/restaurant-dashboard",
        DRIVER: "/driver-dashboard",
        ADMIN: "/admin",
      };

      router.replace(roleRoutes[user.role] || "/");
      return;
    }

  }, [router]);


  return (
    <main className="min-h-screen overflow-hidden bg-[var(--chow-bg)] text-[var(--chow-text)]">
      <section className="relative border-b border-[var(--chow-border)]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[var(--chow-mint)] opacity-[0.07] blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-1 lg:gap-10 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <p className="chow-eyebrow mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--chow-coral)]" />
              Your city. Your food. Your Chow.
            </p>

            <h1 className="font-serif text-6xl leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[6.5rem]">
              Good food.
              <br />
              <span className="italic text-[var(--chow-mint)]">
                Good mood.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-8 text-[var(--chow-text-muted)] sm:text-lg">
              Your favourite local flavours, all in one place. Discover
              restaurants around you and get the good stuff delivered.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#restaurants"
                className="chow-button-primary min-h-14 rounded-xl px-7"
              >
                Explore restaurants
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
                  className="ml-2 inline-block h-4 w-4" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>

              <Link
                href="/register"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-[var(--chow-border-strong)] px-7 text-sm font-semibold text-[var(--chow-text)] transition hover:border-[var(--chow-mint)] hover:text-[var(--chow-mint)]"
              >
                Create an account
              </Link>
            </div>


          </div>


        </div>
      </section>

      <section
        id="restaurants"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="chow-eyebrow mb-4">The neighbourhood menu</p>
            <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">
              Find your next <span className="italic text-[var(--chow-mint)]">favourite.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--chow-text-muted)] sm:text-base">
              Explore local restaurants and discover something worth looking
              forward to.
            </p>
          </div>

          <span className="text-xs uppercase tracking-[0.16em] text-[var(--chow-text-subtle)]">
            Made for good moments
          </span>
        </div>

        <RestaurantList />
      </section>

      <section className="border-t border-[var(--chow-border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="font-serif text-2xl italic">Good things are worth sharing.</p>
            <p className="mt-2 text-sm text-[var(--chow-text-subtle)]">
              Bring your cravings. We&apos;ll bring the Chow.
            </p>
          </div>
          <Link href="/register" className="chow-button-primary self-start">
            Get started
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"
              className="ml-2 inline-block h-4 w-4" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </Link>
        </div>
      </section>

    </main>
  );
}

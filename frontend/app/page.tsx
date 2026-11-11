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

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-12 lg:py-28">
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
                Explore restaurants <span aria-hidden="true">↗</span>
              </a>

              <Link
                href="/register"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-[var(--chow-border-strong)] px-7 text-sm font-semibold text-[var(--chow-text)] transition hover:border-[var(--chow-mint)] hover:text-[var(--chow-mint)]"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-4 border-t border-[var(--chow-border)] pt-7">
              <div className="flex -space-x-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--chow-bg)] bg-[#344B43] text-sm">🍔</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--chow-bg)] bg-[#60483D] text-sm">🍕</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--chow-bg)] bg-[#66513A] text-sm">🍗</span>
              </div>
              <p className="text-xs leading-5 text-[var(--chow-text-subtle)]">
                Local favourites.
                <br />
                Delivered with care.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-[var(--chow-mint)] opacity-10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--chow-border-strong)] bg-[var(--chow-bg-card)] p-5 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <span className="chow-eyebrow">A little something good</span>
                <span className="rounded-full border border-[var(--chow-border)] px-3 py-1 text-[10px] uppercase tracking-widest text-[var(--chow-text-subtle)]">
                  CHOW
                </span>
              </div>

              <div className="relative my-8 flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-[radial-gradient(ellipse_at_center,_#40534a_0%,_#263a33_48%,_#1b2927_100%)]">
                <div className="absolute h-[72%] w-[72%] rounded-full border border-white/10" />
                <div className="absolute h-[58%] w-[58%] rounded-full border border-white/10" />
                <span className="relative -rotate-6 text-[8rem] drop-shadow-2xl sm:text-[10rem]">
                  🍔
                </span>
                <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs text-white/80 backdrop-blur">
                  Made for your cravings
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--chow-text-subtle)]">
                    The good stuff
                  </p>
                  <h2 className="mt-2 font-serif text-3xl italic">
                    Starts here.
                  </h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--chow-mint)] text-xl text-[#17201d]">
                  ↗
                </span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-[var(--chow-border-strong)] bg-[var(--chow-bg-elevated)] px-5 py-3 shadow-xl sm:block">
              <p className="text-xs text-[var(--chow-text-subtle)]">Your next favourite</p>
              <p className="mt-1 text-sm font-semibold text-[var(--chow-mint)]">
                Is just around the corner.
              </p>
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
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

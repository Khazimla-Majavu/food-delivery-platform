"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getNotifications,
  NotificationResponse,
  UserResponse,
} from "../../lib/api";
import { getToken, getUser, logout } from "../../lib/auth";

export default function Navbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function navLinkClass(href: string) {
    return isActive(href)
      ? "rounded-full bg-[#a8dfc5] px-4 py-2 text-sm font-semibold text-[#17201d] transition"
      : "rounded-full px-4 py-2 text-sm text-[#c2c5bd] transition hover:bg-[#263234] hover:text-[#a8dfc5]";
  }

  const [user, setUser] = useState<UserResponse | null>(null);
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const currentUser = getUser();
      const token = getToken();

      setUser(currentUser);

      if (currentUser?.role === "CUSTOMER" && token) {
        try {
          const data = await getNotifications(token);
          setNotifications(data);
        } catch {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }

      setLoaded(true);
    }

    loadUser();

    window.addEventListener("auth-change", loadUser);

    return () => {
      window.removeEventListener("auth-change", loadUser);
    };
  }, []);

  function handleLogout() {
    logout();
    setNotifications([]);
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const dashboardLink =
    user?.role === "RESTAURANT"
      ? { href: "/restaurant-dashboard", label: "Restaurant dashboard" }
      : user?.role === "DRIVER"
        ? { href: "/driver-dashboard", label: "Driver dashboard" }
        : user?.role === "ADMIN"
          ? { href: "/admin", label: "Admin dashboard" }
          : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#303a39] bg-[#14191b]/95 text-[#f3efe5] backdrop-blur-xl">
      <nav
        className="mx-auto flex min-h-[68px] max-w-[1160px] items-center justify-between px-5 sm:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className="font-serif text-[1.8rem] font-bold tracking-[-0.07em] text-[#f3efe5] transition hover:text-[#a8dfc5]"
          aria-label="Chow home"
        >
          chow.
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {!loaded ? null : user ? (
            <>
              {user.role === "CUSTOMER" && (
                <>
                  <Link
                    href="/"
                    className={navLinkClass("/")}
                  >
                    Find food
                  </Link>
                  <Link
                    href="/#restaurants"
                    className={navLinkClass("/#restaurants")}
                  >
                    Restaurants
                  </Link>
                  <Link
                    href="/orders"
                    className={navLinkClass("/orders")}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/notifications"
                    className={`relative ${navLinkClass("/notifications")}`}
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#ff8068] px-1.5 text-xs font-bold text-[#241a18]">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/cart"
                    className={navLinkClass("/cart")}
                  >
                    Your Cart
                  </Link>
                </>
              )}

              {dashboardLink && (
                <Link
                  href={dashboardLink.href}
                  className={navLinkClass(dashboardLink.href)}
                >
                  {dashboardLink.label}
                </Link>
              )}

              <span className="max-w-32 truncate text-sm text-[#b8b7ae]">
                {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-[#b8b7ae] transition hover:text-[#ff8068]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/work-with-chow"
                className={navLinkClass("/work-with-chow")}
              >
                Work with Chow
              </Link>
              <Link
                href="/login"
                className={navLinkClass("/login")}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={navLinkClass("/register")}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#465453] text-[#f3efe5] transition hover:border-[#a8dfc5] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span className="text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#303a39] bg-[#182022] px-5 py-5 md:hidden"
        >
          <div className="mx-auto flex max-w-[1160px] flex-col gap-1">
            {!loaded ? null : user ? (
              <>
                <p className="mb-3 px-3 text-sm text-[#b8b7ae]">
                  Signed in as <span className="text-[#f3efe5]">{user.name}</span>
                </p>

                {user.role === "CUSTOMER" && (
                  <>
                    <Link
                      href="/"
                      onClick={closeMenu}
                      className={`rounded-lg px-3 py-3 text-sm ${isActive("/") ? "bg-[#a8dfc5] font-semibold text-[#17201d]" : "hover:bg-[#263234]"}`}
                    >
                      Find food
                    </Link>
                    <Link
                      href="/#restaurants"
                      onClick={closeMenu}
                      className={`rounded-lg px-3 py-3 text-sm ${isActive("/#restaurants") ? "bg-[#a8dfc5] font-semibold text-[#17201d]" : "hover:bg-[#263234]"}`}
                    >
                      Restaurants
                    </Link>
                    <Link
                      href="/orders"
                      onClick={closeMenu}
                      className={`rounded-lg px-3 py-3 text-sm ${isActive("/orders") ? "bg-[#a8dfc5] font-semibold text-[#17201d]" : "hover:bg-[#263234]"}`}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={closeMenu}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm ${isActive("/notifications") ? "bg-[#a8dfc5] font-semibold text-[#17201d]" : "hover:bg-[#263234]"}`}
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-[#ff8068] px-2 py-0.5 text-xs font-bold text-[#241a18]">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/cart"
                      onClick={closeMenu}
                      className={`mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold ${isActive("/cart") ? "bg-[#a8dfc5] text-[#17201d]" : "border border-[#465453] text-[#f3efe5] hover:bg-[#263234]"}`}
                    >
                      Your Cart
                    </Link>
                  </>
                )}

                {dashboardLink && (
                  <Link
                    href={dashboardLink.href}
                    onClick={closeMenu}
                    className={`mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold ${isActive(dashboardLink.href) ? "bg-[#a8dfc5] text-[#17201d]" : "border border-[#465453] text-[#f3efe5] hover:bg-[#263234]"}`}
                  >
                    {dashboardLink.label}
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 rounded-lg px-3 py-3 text-left text-sm text-[#ff8068] hover:bg-[#263234]"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/work-with-chow"
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-3 text-sm ${isActive("/work-with-chow") ? "bg-[#a8dfc5] font-semibold text-[#17201d]" : "hover:bg-[#263234]"}`}
                >
                  Work with Chow
                </Link>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-3 text-sm ${isActive("/login") ? "bg-[#a8dfc5] font-semibold text-[#17201d]" : "hover:bg-[#263234]"}`}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className={`mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold ${isActive("/register") ? "bg-[#a8dfc5] text-[#17201d]" : "border border-[#465453] text-[#f3efe5] hover:bg-[#263234]"}`}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

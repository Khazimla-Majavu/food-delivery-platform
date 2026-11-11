"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import RoleGuard from "../components/RoleGuard";
import {
  createOrder,
  createPayment,
  createDeliveryLocation,
  testPay,
} from "../../lib/api";

interface Pricing {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
}

interface AddressSuggestion {
  properties: {
    formatted?: string;
    lat?: number;
    lon?: number;
    place_id?: string;
  };
}

export default function CartPage() {
  const router = useRouter();

  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [paymentMode, setPaymentMode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [addressSearching, setAddressSearching] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState("");
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  useEffect(() => {
    const query = deliveryAddress.trim();

    if (query.length < 3 || selectedAddress === deliveryAddress) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

      if (!apiKey) {
        setAddressSuggestions([]);
        setAddressSearching(false);
        setAddressSearchError(
          "Address search is not configured yet. Please try again later.",
        );
        return;
      }

      setAddressSearching(true);
      setAddressSearchError("");

      try {
        const params = new URLSearchParams({
          text: query,
          filter: "countrycode:za",
          format: "geojson",
          apiKey,
        });

        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${params}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Address search request failed.");
        }

        const data = (await response.json()) as {
          features?: AddressSuggestion[];
        };

        setAddressSuggestions(data.features ?? []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setAddressSuggestions([]);
        setAddressSearchError(
          "Unable to search addresses. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setAddressSearching(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [deliveryAddress, selectedAddress]);

  function handleProceedToCheckout() {
    setCheckoutError("");

    if (items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?redirect=/cart");
      return;
    }

    const restaurantIds = [
      ...new Set(items.map((item) => item.menuItem.restaurantId)),
    ];

    if (restaurantIds.length !== 1) {
      setCheckoutError(
        "Your cart can only contain items from one restaurant.",
      );
      return;
    }

    setCheckoutMode(true);
  }

  async function handleContinueToPayment() {
    setCheckoutError("");

    if (!deliveryAddress.trim() || !selectedLocation ||
        selectedAddress !== deliveryAddress) {
      setCheckoutError(
        "Please select a delivery address from the suggestions.",
      );
      return;
    }

    if (items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?redirect=/cart");
      return;
    }

    const restaurantIds = [
      ...new Set(items.map((item) => item.menuItem.restaurantId)),
    ];

    if (restaurantIds.length !== 1) {
      setCheckoutError(
        "Your cart can only contain items from one restaurant.",
      );
      return;
    }

    setCheckoutLoading(true);

    try {
      const location = selectedLocation;

      const restaurantId = restaurantIds[0];

      const orderItems = items.map((item) => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
      }));

      const order = await createOrder(
        restaurantId,
        orderItems,
        token,
      );

      const calculatedPricing = await createDeliveryLocation(
        order.id,
        deliveryAddress.trim(),
        token,
        location.latitude,
        location.longitude,
      );

      const payment = await createPayment(order.id, token);

      setPendingOrderId(order.id);
      setPricing({
        subtotal: calculatedPricing.subtotal,
        deliveryFee: calculatedPricing.deliveryFee,
        serviceFee: calculatedPricing.serviceFee,
        totalAmount: calculatedPricing.totalAmount,
      });
      setPaymentId(payment.id);
      setPaymentMode(true);
    } catch (error) {
      console.error(error);
      setCheckoutError(
        "Unable to prepare your order for payment. Please try again.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleTestPayment() {
    setCheckoutError("");

    if (!pendingOrderId || !pricing) {
      setCheckoutError("Your order is not ready for payment.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?redirect=/cart");
      return;
    }

    setPaymentLoading(true);

    try {
      const payment = await testPay(pendingOrderId, token);

      if (payment.status !== "PAID") {
        throw new Error("Payment was not successful.");
      }

      clearCart();

      router.push(
        `/order-confirmation/${pendingOrderId}`,
      );
    } catch (error) {
      console.error(error);
      setCheckoutError(
        "Payment could not be completed. Please try again.",
      );
    } finally {
      setPaymentLoading(false);
    }
  }

  function handleBack() {
    setCheckoutError("");

    if (paymentMode) {
      setPaymentMode(false);
      return;
    }

    if (checkoutMode) {
      setCheckoutMode(false);
      return;
    }

    router.push("/");
  }

  return (
    <RoleGuard allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[var(--chow-bg)] text-[var(--chow-text)]">
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mb-10">
            <button
              onClick={handleBack}
              className="text-sm font-medium text-[var(--chow-text-muted)] transition hover:text-[var(--chow-mint)]"
            >
              ←{" "}
              {paymentMode ? "Back to delivery details" : checkoutMode ? "Back to cart" : "Continue shopping"}
            </button>

            <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="chow-eyebrow">YOUR CHOW ORDER</p>
                <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
                  {paymentMode ? "Review & payment" : checkoutMode ? "Delivery details" : "Your basket"}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--chow-text-muted)]">
                  {paymentMode
                    ? "Your order is almost ready. Review the breakdown before proceeding."
                    : checkoutMode
                      ? "Where should we bring your food?"
                      : "Good food is just a few steps away. Review your selection before checking out."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className={`rounded-full px-3 py-2 ${!checkoutMode ? "bg-[var(--chow-mint)] text-[#14201B]" : "border border-[var(--chow-border)] text-[var(--chow-text-muted)]"}`}>
                  01 Basket
                </span>
                <span className="h-px w-3 bg-[var(--chow-border)]" />
                <span className={`rounded-full px-3 py-2 ${checkoutMode && !paymentMode ? "bg-[var(--chow-mint)] text-[#14201B]" : "border border-[var(--chow-border)] text-[var(--chow-text-muted)]"}`}>
                  02 Delivery
                </span>
                <span className="h-px w-3 bg-[var(--chow-border)]" />
                <span className={`rounded-full px-3 py-2 ${paymentMode ? "bg-[var(--chow-mint)] text-[#14201B]" : "border border-[var(--chow-border)] text-[var(--chow-text-muted)]"}`}>
                  03 Payment
                </span>
              </div>
            </div>
          </div>

          {checkoutError && (
            <div className="mb-6 rounded-2xl border border-[#FF8068]/40 bg-[#FF8068]/10 p-4 text-sm text-[#FF9B88]">
              {checkoutError}
            </div>
          )}

          {items.length === 0 && !paymentMode ? (
            <div className="rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--chow-bg-elevated)] text-3xl">
                🛍️
              </div>
              <h2 className="mt-6 font-serif text-3xl">Your basket is empty</h2>
              <p className="mt-3 text-sm text-[var(--chow-text-muted)]">
                Something delicious is waiting to be discovered.
              </p>
              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-[var(--chow-mint)] px-7 py-3.5 text-sm font-semibold text-[#14201B] transition hover:bg-[var(--chow-mint-hover)]"
              >
                Browse restaurants
              </Link>
            </div>
          ) : (
            <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                {!paymentMode && (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <article
                        key={item.menuItem.id}
                        className="rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] p-5 sm:p-6"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <h2 className="text-lg font-semibold">{item.menuItem.name}</h2>
                            <p className="mt-1 text-sm leading-6 text-[var(--chow-text-muted)]">
                              {item.menuItem.description}
                            </p>
                            <p className="mt-3 text-sm font-medium text-[var(--chow-mint)]">
                              R{Number(item.menuItem.price).toFixed(2)} each
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-3 rounded-full border border-[var(--chow-border)] bg-[var(--chow-bg-elevated)] p-1">
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                aria-label={`Decrease ${item.menuItem.name} quantity`}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-[var(--chow-border)]"
                              >
                                −
                              </button>
                              <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                aria-label={`Increase ${item.menuItem.name} quantity`}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--chow-mint)] text-lg text-[#14201B] transition hover:bg-[var(--chow-mint-hover)]"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-sm font-medium text-[var(--chow-text-subtle)] transition hover:text-[var(--chow-coral)]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-[var(--chow-border)] pt-4">
                          <span className="text-xs text-[var(--chow-text-subtle)]">Item total</span>
                          <span className="font-semibold">
                            R{(Number(item.menuItem.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {checkoutMode && !paymentMode && (
                  <div className="rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--chow-bg-elevated)] text-xl">
                        📍
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Delivery location</h2>
                        <p className="mt-1 text-sm text-[var(--chow-text-muted)]">
                          Enter where you would like your order delivered.
                        </p>
                      </div>
                    </div>

                    <label htmlFor="deliveryAddress" className="mt-8 block text-sm font-medium">
                      Delivery address
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="deliveryAddress"
                        type="text"
                        autoComplete="street-address"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={addressSuggestions.length > 0}
                        aria-controls="delivery-address-suggestions"
                        value={deliveryAddress}
                        onChange={(event) => {
                          setDeliveryAddress(event.target.value);
                          setSelectedAddress("");
                          setSelectedLocation(null);
                          setAddressSuggestions([]);
                          setAddressSearching(false);
                          setAddressSearchError("");
                          setCheckoutError("");
                        }}
                        placeholder="Start typing a South African address"
                        className="chow-input w-full"
                      />

                      {addressSearching && (
                        <p className="mt-2 text-sm text-[var(--chow-text-muted)]">
                          Searching addresses...
                        </p>
                      )}

                      {addressSuggestions.length > 0 && (
                        <ul
                          id="delivery-address-suggestions"
                          role="listbox"
                          className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[var(--chow-border-strong)] bg-[var(--chow-bg-elevated)] py-2 shadow-2xl"
                        >
                          {addressSuggestions.map((suggestion, index) => {
                            const properties = suggestion.properties;
                            const formatted = properties.formatted;

                            if (
                              !formatted ||
                              typeof properties.lat !== "number" ||
                              typeof properties.lon !== "number"
                            ) {
                              return null;
                            }

                            return (
                              <li
                                key={properties.place_id ?? `${formatted}-${index}`}
                                role="option"
                                aria-selected={false}
                              >
                                <button
                                  type="button"
                                  className="w-full px-4 py-3 text-left text-sm transition hover:bg-[var(--chow-bg-card)]"
                                  onClick={() => {
                                    setDeliveryAddress(formatted);
                                    setSelectedAddress(formatted);
                                    setSelectedLocation({
                                      latitude: properties.lat!,
                                      longitude: properties.lon!,
                                    });
                                    setAddressSuggestions([]);
                                    setAddressSearchError("");
                                    setCheckoutError("");
                                  }}
                                >
                                  {formatted}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {addressSearchError && (
                        <p className="mt-2 text-sm text-[var(--chow-coral)]" role="status">
                          {addressSearchError}
                        </p>
                      )}

                      {selectedLocation && selectedAddress === deliveryAddress && (
                        <p className="mt-3 flex items-center gap-2 text-sm text-[var(--chow-mint)]">
                          <span>✓</span> Delivery address selected.
                        </p>
                      )}
                    </div>

                    <p className="mt-4 text-xs leading-5 text-[var(--chow-text-subtle)]">
                      Select a suggested address so we can calculate your delivery fee. You can enter an address for someone else.
                    </p>
                    <p className="mt-2 text-xs text-[var(--chow-text-subtle)]">
                      Address search by{" "}
                      <a
                        href="https://www.geoapify.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-[var(--chow-mint)]"
                      >
                        Geoapify
                      </a>
                    </p>
                  </div>
                )}

                {paymentMode && pricing && (
                  <div className="rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] p-6 sm:p-8">
                    <div className="mb-7">
                      <p className="chow-eyebrow">AMOUNT TO PAY</p>
                      <h2 className="mt-3 font-serif text-5xl tracking-tight text-[var(--chow-mint)]">
                        R{pricing.totalAmount.toFixed(2)}
                      </h2>
                    </div>

                    <div className="space-y-4 border-t border-[var(--chow-border)] pt-5">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--chow-text-muted)]">Food</span>
                        <span>R{pricing.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--chow-text-muted)]">Delivery</span>
                        <span>R{pricing.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--chow-text-muted)]">Service fee</span>
                        <span>R{pricing.serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-[var(--chow-border)] pt-4 text-base font-semibold">
                        <span>Total</span>
                        <span>R{pricing.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {paymentId && (
                      <p className="mt-5 text-xs text-[var(--chow-text-subtle)]">
                        Test payment #{paymentId}
                      </p>
                    )}

                    <button
                      onClick={handleTestPayment}
                      disabled={paymentLoading}
                      className="chow-button-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {paymentLoading ? "Processing test payment..." : `Pay R${pricing.totalAmount.toFixed(2)}`}
                    </button>

                    <div className="mt-5 rounded-2xl border border-[#FF8068]/30 bg-[#FF8068]/10 p-4">
                      <p className="text-xs leading-5 text-[#FF9B88]">
                        <strong>Test payment mode:</strong> No real payment is being collected. The live payment gateway is still being integrated.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <aside className="h-fit rounded-3xl border border-[var(--chow-border)] bg-[var(--chow-bg-card)] p-6 lg:sticky lg:top-8">
                {!paymentMode ? (
                  <>
                    <p className="chow-eyebrow">YOUR ORDER</p>
                    <h2 className="mt-2 font-serif text-2xl">Order summary</h2>

                    <div className="mt-7 flex items-center justify-between border-b border-[var(--chow-border)] pb-5">
                      <span className="text-sm text-[var(--chow-text-muted)]">Food subtotal</span>
                      <span className="text-xl font-semibold">R{total.toFixed(2)}</span>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-[var(--chow-text-muted)]">
                      Delivery and service fees will be calculated using your selected delivery location.
                    </p>

                    {!checkoutMode ? (
                      <button
                        onClick={handleProceedToCheckout}
                        className="chow-button-primary mt-7 w-full"
                      >
                        Proceed to checkout
                      </button>
                    ) : (
                      <button
                        onClick={handleContinueToPayment}
                        disabled={checkoutLoading}
                        className="chow-button-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {checkoutLoading ? "Calculating total..." : "Continue to payment"}
                      </button>
                    )}

                    <p className="mt-4 text-center text-xs text-[var(--chow-text-subtle)]">
                      Secure checkout experience
                    </p>
                  </>
                ) : (
                  <>
                    <p className="chow-eyebrow">ORDER READY</p>
                    <h2 className="mt-2 font-serif text-2xl">Payment summary</h2>
                    <p className="mt-4 text-sm leading-6 text-[var(--chow-text-muted)]">
                      Your delivery location and order total have been calculated.
                    </p>
                    <div className="mt-6 rounded-2xl bg-[var(--chow-bg-elevated)] p-4">
                      <p className="text-xs text-[var(--chow-text-subtle)]">Total payable</p>
                      <p className="mt-1 text-2xl font-semibold text-[var(--chow-mint)]">
                        R{pricing?.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <p className="mt-4 text-xs leading-5 text-[var(--chow-text-subtle)]">
                      This checkout currently uses a test payment flow.
                    </p>
                  </>
                )}
              </aside>
            </div>
          )}
        </section>
      </main>
    </RoleGuard>
  );
}

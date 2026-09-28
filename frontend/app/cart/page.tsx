"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
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

export default function CartPage() {
  const router = useRouter();

  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [paymentMode, setPaymentMode] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  function getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => reject(new Error("Unable to get your location.")),
      );
    });
  }

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

    if (!deliveryAddress.trim()) {
      setCheckoutError("Please enter your delivery address.");
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
      const location = await getCurrentLocation();
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
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            ←{" "}
            {paymentMode
              ? "Back to delivery details"
              : checkoutMode
                ? "Back to cart"
                : "Continue shopping"}
          </button>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
            {paymentMode
              ? "Review & payment"
              : checkoutMode
                ? "Checkout"
                : "Your Cart"}
          </h1>

          <p className="mt-2 text-neutral-500">
            {paymentMode
              ? "Review your order total before completing payment."
              : checkoutMode
                ? "Enter your delivery details to continue."
                : "Review your items before checking out."}
          </p>
        </div>

        {checkoutError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {checkoutError}
          </div>
        )}

        {items.length === 0 && !paymentMode ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <h2 className="text-xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-2 text-neutral-500">
              Add some food from a restaurant to get started.
            </p>

            <a
              href="/"
              className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Browse restaurants
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {!paymentMode && (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {item.menuItem.name}
                        </h2>

                        <p className="mt-1 text-sm text-neutral-500">
                          {item.menuItem.description}
                        </p>

                        <p className="mt-2 font-medium">
                          R{Number(item.menuItem.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.menuItem.id,
                              item.quantity - 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-lg transition hover:border-black"
                        >
                          -
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.menuItem.id,
                              item.quantity + 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-lg transition hover:border-black"
                        >
                          +
                        </button>

                        <button
                          onClick={() =>
                            removeFromCart(item.menuItem.id)
                          }
                          className="ml-3 text-sm font-medium text-neutral-500 transition hover:text-black"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-neutral-100 pt-4 text-right">
                      <span className="font-semibold">
                        Item total: R
                        {(
                          Number(item.menuItem.price) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {checkoutMode && !paymentMode && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h2 className="text-xl font-semibold">
                  Delivery details
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  Enter where you would like your order delivered.
                </p>

                <label
                  htmlFor="deliveryAddress"
                  className="mt-6 block text-sm font-medium"
                >
                  Delivery address
                </label>

                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(event) =>
                    setDeliveryAddress(event.target.value)
                  }
                  placeholder="Enter your delivery address"
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
                />

                <p className="mt-3 text-xs text-neutral-500">
                  Your location will also be used to calculate the
                  delivery fee.
                </p>
              </div>
            )}

            {paymentMode && pricing && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="mb-6">
                  <p className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500">
                    Order total
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                    R{pricing.totalAmount.toFixed(2)}
                  </h2>
                </div>

                <div className="space-y-4 border-t border-neutral-200 pt-5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">
                      Food
                    </span>

                    <span className="font-medium">
                      R{pricing.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-500">
                      Delivery
                    </span>

                    <span className="font-medium">
                      R{pricing.deliveryFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-500">
                      Service fee
                    </span>

                    <span className="font-medium">
                      R{pricing.serviceFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-neutral-200 pt-4 text-lg font-semibold">
                    <span>Total</span>

                    <span>
                      R{pricing.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {paymentId && (
                  <p className="mt-5 text-xs text-neutral-400">
                    Test payment #{paymentId}
                  </p>
                )}

                <button
                  onClick={handleTestPayment}
                  disabled={paymentLoading}
                  className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paymentLoading
                    ? "Processing payment..."
                    : `Pay R${pricing.totalAmount.toFixed(2)}`}
                </button>

                <p className="mt-4 text-center text-xs text-neutral-500">
                  Test payment mode is active while the real payment
                  gateway is being integrated.
                </p>
              </div>
            )}

            {!paymentMode && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h2 className="text-xl font-semibold">
                  Order summary
                </h2>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-neutral-500">
                    Food subtotal
                  </span>

                  <span className="text-2xl font-semibold">
                    R{total.toFixed(2)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-neutral-500">
                  Delivery and service fees will be calculated using
                  your delivery location.
                </p>

                {!checkoutMode ? (
                  <button
                    onClick={handleProceedToCheckout}
                    className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Proceed to checkout
                  </button>
                ) : (
                  <button
                    onClick={handleContinueToPayment}
                    disabled={checkoutLoading}
                    className="mt-6 w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {checkoutLoading
                      ? "Calculating total..."
                      : "Continue to payment"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

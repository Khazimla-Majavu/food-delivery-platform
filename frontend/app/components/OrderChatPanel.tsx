"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  getOrderChatMessages,
  sendOrderChatMessage,
  OrderChatMessageResponse,
} from "../../lib/api";

export default function OrderChatPanel({
  orderId,
  orderStatus,
}: {
  orderId: number;
  orderStatus: string;
}) {
  const [messages, setMessages] = useState<OrderChatMessageResponse[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const canSend = orderStatus === "OUT_FOR_DELIVERY";

  const refreshMessages = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again to access chat.");
      setLoading(false);
      return;
    }
    try {
      const result = await getOrderChatMessages(orderId, token);
      setMessages(result);
      setError("");
    } catch {
      setError("Unable to load this order's chat.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (cancelled) return;
      await refreshMessages();
    };
    void load();
    const interval = window.setInterval(() => {
      if (!cancelled) void refreshMessages();
    }, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [refreshMessages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > 2000 || sending || !canSend) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again to send a message.");
      return;
    }

    setSending(true);
    setError("");
    try {
      const sent = await sendOrderChatMessage(orderId, trimmed, token);
      setMessages((current) =>
        current.some((item) => item.id === sent.id)
          ? current
          : [...current, sent].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
                a.id - b.id,
            ),
      );
      setMessage("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send message.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Delivery chat</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Messages are visible to the customer and assigned driver.
          </p>
        </div>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500">
          Order #{orderId}
        </span>
      </div>

      <div className="mt-5 max-h-80 space-y-3 overflow-y-auto rounded-2xl bg-neutral-50 p-4">
        {loading && (
          <p className="text-sm text-neutral-500">Loading messages…</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            No messages yet. Use this chat to coordinate the delivery.
          </p>
        )}
        {messages.map((item) => (
          <article key={item.id} className="rounded-xl border border-neutral-200 bg-white p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-black">
                {item.senderName}{" "}
                <span className="font-normal text-neutral-500">
                  · {item.senderRole.toLowerCase()}
                </span>
              </p>
              <time className="text-xs text-neutral-400">
                {new Date(item.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-700">
              {item.message}
            </p>
          </article>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>
      )}

      {canSend ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label htmlFor={`chat-message-${orderId}`} className="sr-only">
            Write a message
          </label>
          <textarea
            id={`chat-message-${orderId}`}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Write a message…"
            className="w-full resize-y rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-neutral-400">
              {message.length}/2000
            </span>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? "Sending…" : "Send message"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-neutral-500">
          Messaging is available while the order is out for delivery. You can still view previous messages here.
        </p>
      )}
    </section>
  );
}

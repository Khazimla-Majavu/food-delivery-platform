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
    <section className="mt-8 rounded-3xl border border-[#303D3E] bg-[#1C2728] p-5 text-[#F3EFE5] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Delivery chat</h3>
          <p className="mt-1 text-sm text-[#B8B7AE]">
            Messages are visible to the customer and assigned driver.
          </p>
        </div>
        <span className="rounded-full border border-[#465453] px-3 py-1 text-xs text-[#B8B7AE]">
          Order #{orderId}
        </span>
      </div>

      <div className="mt-5 max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-[#303D3E] bg-[#14191B] p-4">
        {loading && (
          <p className="text-sm text-neutral-500">Loading messages…</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            No messages yet. Use this chat to coordinate the delivery.
          </p>
        )}
        {messages.map((item) => (
          <article key={item.id} className="rounded-xl border border-[#303D3E] bg-[#263234] p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-[#F3EFE5]">
                {item.senderName}{" "}
                <span className="font-normal text-[#89938E]">
                  · {item.senderRole.toLowerCase()}
                </span>
              </p>
              <time className="text-xs text-[#89938E]">
                {new Date(item.createdAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#F3EFE5]">
              {item.message}
            </p>
          </article>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-[#FF8068]">{error}</p>
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
            className="w-full resize-y rounded-2xl border border-[#465453] bg-[#202B2D] px-4 py-3 text-sm text-[#F3EFE5] placeholder:text-[#89938E] outline-none transition focus:border-[#A8DFC5] focus:ring-1 focus:ring-[#A8DFC5]"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[#89938E]">
              {message.length}/2000
            </span>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="rounded-full bg-[#A8DFC5] px-5 py-3 text-sm font-semibold text-[#14191B] transition hover:bg-[#BDE9D3] disabled:cursor-not-allowed disabled:opacity-40"
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

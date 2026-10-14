import type { OrderResponse } from "./api";

export function isOrderHistory(order: OrderResponse): boolean {
  return order.status === "DELIVERED" || order.status === "CANCELLED";
}

export function sortOrdersNewestFirst<T extends { createdAt: string }>(
  orders: T[],
): T[] {
  return [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function sortOrdersBySection(orders: OrderResponse[]): OrderResponse[] {
  const newestFirst = sortOrdersNewestFirst(orders);

  return [
    ...newestFirst.filter((order) => !isOrderHistory(order)),
    ...newestFirst.filter(isOrderHistory),
  ];
}

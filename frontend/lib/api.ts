const API_URL = "http://localhost:8080";

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  ownerId: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  restaurantId: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface OrderItemResponse {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  customerId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantAddress: string;
  driverId: number | null;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface MenuItemRequest {
  name: string;
  description: string;
  price: number;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json();
}

export async function register(
  name: string,
  email: string,
  phone: string,
  password: string,
): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("This email is already registered.");
    }

    throw new Error(`Registration failed: ${response.status}`);
  }

  return response.json();
}

export async function getRestaurants(token: string): Promise<Restaurant[]> {
  const response = await fetch(`${API_URL}/api/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants: ${response.status}`);
  }

  return response.json();
}

export async function getRestaurantMenu(
  restaurantId: number,
  token: string,
): Promise<MenuItem[]> {
  const response = await fetch(
    `${API_URL}/api/restaurants/${restaurantId}/menu`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch menu: ${response.status}`);
  }

  return response.json();
}

export async function createOrder(
  restaurantId: number,
  items: OrderItemRequest[],
  token: string,
): Promise<OrderResponse> {
  const response = await fetch(
    `${API_URL}/api/orders/restaurant/${restaurantId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create order: ${response.status}`);
  }

  return response.json();
}

export async function getMyOrders(token: string): Promise<OrderResponse[]> {
  const response = await fetch(`${API_URL}/api/orders/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  return response.json();
}

export async function getMyRestaurants(token: string): Promise<Restaurant[]> {
  const response = await fetch(`${API_URL}/api/restaurants/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants: ${response.status}`);
  }

  return response.json();
}

export async function getRestaurantOrders(
  restaurantId: number,
  token: string,
): Promise<OrderResponse[]> {
  const response = await fetch(
    `${API_URL}/api/orders/restaurant/${restaurantId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant orders: ${response.status}`);
  }

  return response.json();
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  token: string,
): Promise<OrderResponse> {
  const response = await fetch(
    `${API_URL}/api/orders/${orderId}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update order status: ${response.status}`);
  }

  return response.json();
}

export async function getAvailableDriverOrders(
  token: string,
): Promise<OrderResponse[]> {
  const response = await fetch(`${API_URL}/api/orders/driver/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch available driver orders: ${response.status}`,
    );
  }

  return response.json();
}

export async function claimOrder(
  orderId: number,
  token: string,
): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/claim`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to claim order: ${response.status}`);
  }

  return response.json();
}

export async function getDriverOrders(token: string): Promise<OrderResponse[]> {
  const response = await fetch(`${API_URL}/api/orders/driver/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch driver orders: ${response.status}`);
  }

  return response.json();
}

export async function completeDelivery(
  orderId: number,
  token: string,
): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/complete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to complete delivery: ${response.status}`);
  }

  return response.json();
}

export async function createMenuItem(
  restaurantId: number,
  request: MenuItemRequest,
  token: string,
): Promise<MenuItem> {
  const response = await fetch(
    `${API_URL}/api/restaurants/${restaurantId}/menu`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create menu item: ${response.status}`);
  }

  return response.json();
}

export async function updateMenuItem(
  restaurantId: number,
  menuItemId: number,
  request: MenuItemRequest,
  token: string,
): Promise<MenuItem> {
  const response = await fetch(
    `${API_URL}/api/restaurants/${restaurantId}/menu/${menuItemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update menu item: ${response.status}`);
  }

  return response.json();
}

export async function deleteMenuItem(
  restaurantId: number,
  menuItemId: number,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/restaurants/${restaurantId}/menu/${menuItemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete menu item: ${response.status}`);
  }
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  amount: number;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED";
  createdAt: string;
}

export async function createPayment(
  orderId: number,
  token: string,
): Promise<PaymentResponse> {
  const response = await fetch(
    `${API_URL}/api/payments/order/${orderId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create payment: ${response.status}`);
  }

  return response.json();
}

export async function getPayment(
  orderId: number,
  token: string,
): Promise<PaymentResponse> {
  const response = await fetch(
    `${API_URL}/api/payments/order/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch payment: ${response.status}`);
  }

  return response.json();
}

export async function createDeliveryLocation(
  orderId: number,
  address: string,
  token: string,
  latitude?: number,
  longitude?: number,
): Promise<{
  id: number;
  orderId: number;
  address: string;
  latitude: number | null;
  longitude: number | null;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
}> {
  const params = new URLSearchParams({
    address,
  });

  if (latitude !== undefined) {
    params.set("latitude", latitude.toString());
  }

  if (longitude !== undefined) {
    params.set("longitude", longitude.toString());
  }

  const response = await fetch(
    `${API_URL}/api/delivery-locations/order/${orderId}?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create delivery location: ${response.status}`);
  }

  return response.json();
}

export async function getDeliveryLocation(
  orderId: number,
  token: string,
): Promise<{
  id: number;
  orderId: number;
  address: string;
  latitude: number | null;
  longitude: number | null;
}> {
  const response = await fetch(
    `${API_URL}/api/delivery-locations/order/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch delivery location: ${response.status}`);
  }

  return response.json();
}

export async function getDeliveryDistance(
  orderId: number,
  token: string,
): Promise<{ orderId: number; distanceKm: number }> {
  const response = await fetch(
    `${API_URL}/api/delivery-distance/order/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to get delivery distance: ${response.status}`);
  }

  return response.json();
}

export interface NotificationResponse {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function getNotifications(
  token: string,
): Promise<NotificationResponse[]> {
  const response = await fetch(`${API_URL}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  return response.json();
}

export async function markNotificationAsRead(
  notificationId: number,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/notifications/${notificationId}/read`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to mark notification as read: ${response.status}`,
    );
  }
}

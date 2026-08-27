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

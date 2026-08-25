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

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
  };
}

export async function login(
  email: string,
  password: string
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

export async function getRestaurants(
  token: string
): Promise<Restaurant[]> {
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
  token: string
): Promise<MenuItem[]> {
  const response = await fetch(
    `${API_URL}/api/restaurants/${restaurantId}/menu`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant menu: ${response.status}`);
  }

  return response.json();
}

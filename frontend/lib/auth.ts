import { UserResponse } from "./api";

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

export function getUser(): UserResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as UserResponse;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { MenuItem } from "../../lib/api";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("cart");
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  function addToCart(menuItem: MenuItem) {
    console.log("ADDING TO CART:", menuItem);

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.menuItem.id === menuItem.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.menuItem.id === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          menuItem,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(menuItemId: number) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.menuItem.id !== menuItemId,
      ),
    );
  }

  function updateQuantity(menuItemId: number, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.menuItem.id === menuItemId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.menuItem.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}

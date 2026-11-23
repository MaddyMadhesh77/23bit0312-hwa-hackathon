"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type CartItem = {
  productId: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isHydrated: boolean;
};

const STORAGE_KEY = "ticktail-cart";

export const CartContext = createContext<CartContextValue | null>(null);

function parseStoredItems(raw: string): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry): CartItem[] => {
      if (typeof entry !== "object" || entry === null) return [];
      const { productId, qty } = entry as {
        productId?: unknown;
        qty?: unknown;
      };
      if (typeof productId !== "string" || productId.length === 0) return [];
      if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1) {
        return [];
      }
      return [{ productId, qty }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Always start empty so the first client render matches the server render.
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Read localStorage only after mount, so hydration can never mismatch.
  useEffect(() => {
    let stored: CartItem[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = parseStoredItems(raw);
    } catch {
      // Storage may be unavailable (private mode, blocked cookies, etc.).
    }
    setItems(stored);
    setIsHydrated(true);
  }, []);

  // Persist on every change, but never before the stored cart has been loaded.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write failures; the in-memory cart still works.
    }
  }, [items, isHydrated]);

  const addItem = useCallback((productId: string, qty: number) => {
    if (!Number.isInteger(qty) || qty < 1) return;
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (!existing) return [...current, { productId, qty }];
      return current.map((item) =>
        item.productId === productId
          ? { ...item, qty: item.qty + qty }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  }, []);

  // A quantity of zero or less removes the line entirely.
  const setQty = useCallback((productId: string, qty: number) => {
    if (!Number.isFinite(qty)) return;
    setItems((current) => {
      if (!current.some((item) => item.productId === productId)) return current;
      if (qty <= 0) {
        return current.filter((item) => item.productId !== productId);
      }
      const nextQty = Math.floor(qty);
      return current.map((item) =>
        item.productId === productId ? { ...item, qty: nextQty } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      cartCount,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      isHydrated,
    }),
    [
      items,
      addItem,
      removeItem,
      setQty,
      clearCart,
      cartCount,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      isHydrated,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

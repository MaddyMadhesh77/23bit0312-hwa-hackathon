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
  hydrated: boolean;
};

export const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ticktail-cart";

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
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load the saved cart only after mount so server and client renders match.
  useEffect(() => {
    let storedItems: CartItem[] = [];

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) storedItems = parseStoredItems(raw);
    } catch {
      // Storage can be unavailable in private or restricted browser modes.
    }

    setItems(storedItems);
    setHydrated(true);
  }, []);

  // Persist every cart change after the initial localStorage load completes.
  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart remains usable in memory when storage is unavailable.
    }
  }, [items, hydrated]);

  const addItem = useCallback((productId: string, qty: number) => {
    if (!Number.isInteger(qty) || qty < 1) return;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === productId,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === productId
            ? { ...item, qty: item.qty + qty }
            : item,
        );
      }

      return [...currentItems, { productId, qty }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((currentItems) => {
      if (qty <= 0) {
        return currentItems.filter((item) => item.productId !== productId);
      }

      return currentItems.map((item) =>
        item.productId === productId ? { ...item, qty } : item,
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
      hydrated,
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
      hydrated,
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

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductData } from "@/data/initialProducts";

export interface SelectedAccessory {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique item composite key: slug + size + accessories ids
  product: ProductData;
  size: string;
  sizePriceModifier: number;
  accessories: SelectedAccessory[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: ProductData,
    sizeName?: string,
    accessories?: SelectedAccessory[],
    quantity?: number
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "blooming_oasis_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read cart from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to write cart to localStorage:", e);
    }
  }, [items, isLoaded]);

  const addItem = (
    product: ProductData,
    sizeName: string = "Small",
    accessories: SelectedAccessory[] = [],
    quantity: number = 1
  ) => {
    const sizeObj = product.sizes?.find((s) => s.name === sizeName) || {
      name: sizeName,
      priceModifier: 0,
    };
    const sizeModifier = sizeObj.priceModifier || 0;
    const accessoriesTotal = accessories.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = product.price + sizeModifier + accessoriesTotal;

    const accIdsKey = accessories
      .map((a) => a.id)
      .sort()
      .join("-");
    const compositeId = `${product.slug}_${sizeName}_${accIdsKey}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === compositeId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * updated[existingIndex].unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: compositeId,
          product,
          size: sizeName,
          sizePriceModifier: sizeModifier,
          accessories,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  // Free delivery on orders over $75
  const shipping = subtotal > 0 && subtotal < 75 ? 12 : 0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        shipping,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


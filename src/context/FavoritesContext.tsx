import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../lib/storage";

interface ToastMessage {
  id: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
}

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string, tourTitle?: string) => void;
  removeFavorite: (slug: string) => void;
  clearFavorites: () => void;
  count: number;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
}

const STORAGE_KEY = "velora_favorites_v1";

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEY, [])
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, favorites);
  }, [favorites]);

  const addToast = (message: string, actionLabel?: string, actionUrl?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, actionLabel, actionUrl }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  const toggleFavorite = (slug: string, tourTitle?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(slug);
      if (exists) {
        addToast(`Removed from saved journeys`);
        return prev.filter((s) => s !== slug);
      } else {
        addToast(
          tourTitle ? `Saved "${tourTitle}"` : "Saved to your journeys",
          "View saved",
          "/favorites"
        );
        return [...prev, slug];
      }
    });
  };

  const removeFavorite = (slug: string) => {
    setFavorites((prev) => prev.filter((s) => s !== slug));
    addToast("Removed from saved journeys");
  };

  const clearFavorites = () => {
    setFavorites([]);
    addToast("Saved journeys cleared");
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        count: favorites.length,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
};

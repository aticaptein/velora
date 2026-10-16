import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../lib/storage";
import { generateBookingRef } from "../lib/format";

export interface SimulatedBooking {
  id: string;
  reference: string;
  tourSlug: string;
  tourTitle: string;
  destination: string;
  departureDate: string;
  adults: number;
  children: number;
  packageId: string;
  packageName: string;
  packageFactor: number;
  extras: { id: string; name: string; price: number }[];
  totalPrice: number;
  passenger: {
    fullName: string;
    email: string;
    phone: string;
    dietary?: string;
    requests?: string;
  };
  status: "confirmed" | "cancelled";
  createdAt: string;
}

interface BookingContextType {
  bookings: SimulatedBooking[];
  createBooking: (
    data: Omit<SimulatedBooking, "id" | "reference" | "createdAt" | "status">
  ) => SimulatedBooking;
  cancelBooking: (reference: string) => boolean;
  getBookingByRef: (reference: string) => SimulatedBooking | undefined;
}

const STORAGE_KEY = "velora_simulated_bookings_v1";

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<SimulatedBooking[]>(() =>
    loadFromStorage<SimulatedBooking[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEY, bookings);
  }, [bookings]);

  const createBooking = (
    data: Omit<SimulatedBooking, "id" | "reference" | "createdAt" | "status">
  ): SimulatedBooking => {
    const newBooking: SimulatedBooking = {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      reference: generateBookingRef(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (reference: string): boolean => {
    let updated = false;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.reference.toUpperCase() === reference.toUpperCase()) {
          updated = true;
          return { ...b, status: "cancelled" };
        }
        return b;
      })
    );
    return updated;
  };

  const getBookingByRef = (reference: string): SimulatedBooking | undefined => {
    return bookings.find(
      (b) => b.reference.toUpperCase() === reference.trim().toUpperCase()
    );
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        cancelBooking,
        getBookingByRef,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = (): BookingContextType => {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return ctx;
};

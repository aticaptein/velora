import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import { BookingProvider } from "./context/BookingContext";
import { Layout } from "./components/layout/Layout";

import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { TourDetailPage } from "./pages/TourDetailPage";
import { DestinationsPage } from "./pages/DestinationsPage";
import { DestinationDetailPage } from "./pages/DestinationDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { BookingPage } from "./pages/BookingPage";
import { ManageBookingPage } from "./pages/ManageBookingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { FaqPage } from "./pages/FaqPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <FavoritesProvider>
        <BookingProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="tours" element={<ExplorePage />} />
              <Route path="tours/:slug" element={<TourDetailPage />} />
              <Route path="destinations" element={<DestinationsPage />} />
              <Route path="destinations/:slug" element={<DestinationDetailPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="book/:slug" element={<BookingPage />} />
              <Route path="manage-booking" element={<ManageBookingPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BookingProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
};

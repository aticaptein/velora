import React, { useState } from "react";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { Icon } from "../common/Icon";
import { Dialog } from "../common/Dialog";

interface TourGalleryProps {
  images: string[];
  title: string;
}

export const TourGallery: React.FC<TourGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[selectedIndex] || images[0] || "hero-cappadocia";

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="tour-gallery" style={{ display: "grid", gap: "1rem" }}>
      {/* Main Image */}
      <div
        style={{
          position: "relative",
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          aspectRatio: "16 / 10",
          boxShadow: "var(--shadow-float)",
        }}
      >
        <ResponsiveImage
          name={currentImage}
          alt={`${title} - View ${selectedIndex + 1}`}
          sizes="(min-width: 1200px) 900px, 100vw"
          fetchPriority="high"
          loading="eager"
        />

        {/* Expand / Lightbox Button */}
        <button
          type="button"
          className="fav-btn"
          style={{ position: "absolute", right: "1rem", bottom: "1rem", zIndex: 2 }}
          onClick={() => setLightboxOpen(true)}
          aria-label="Open image in fullscreen view"
        >
          <Icon name="expand" size={20} aria-hidden="true" />
        </button>

        {/* Counter Badge */}
        <span
          style={{
            position: "absolute",
            left: "1rem",
            bottom: "1rem",
            padding: "0.35rem 0.8rem",
            borderRadius: "var(--r-pill)",
            background: "rgba(14, 43, 46, 0.85)",
            color: "var(--salt)",
            fontSize: "0.85rem",
            fontWeight: 600,
            backdropFilter: "blur(4px)",
            zIndex: 2,
          }}
        >
          {selectedIndex + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${images.length}, 1fr)`,
            gap: "0.75rem",
          }}
          role="tablist"
          aria-label="Image gallery thumbnails"
        >
          {images.map((img, idx) => (
            <button
              key={img + idx}
              type="button"
              role="tab"
              aria-selected={idx === selectedIndex}
              aria-label={`Show photo ${idx + 1} of ${title}`}
              onClick={() => setSelectedIndex(idx)}
              style={{
                borderRadius: "var(--r-md)",
                overflow: "hidden",
                aspectRatio: "16 / 10",
                border: idx === selectedIndex ? "2.5px solid var(--saffron)" : "2px solid transparent",
                opacity: idx === selectedIndex ? 1 : 0.7,
                transition: "opacity var(--dur-micro) ease, border-color var(--dur-micro) ease",
                padding: 0,
              }}
            >
              <ResponsiveImage
                name={img}
                alt=""
                sizes="180px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={title}
      >
        <div style={{ display: "grid", gap: "1rem", textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              aspectRatio: "16 / 10",
              maxHeight: "65vh",
            }}
          >
            <ResponsiveImage
              name={currentImage}
              alt={`${title} - Large view ${selectedIndex + 1}`}
              sizes="1200px"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={prevImage}
              aria-label="Previous photo"
            >
              <Icon name="arrowLeft" size={16} aria-hidden="true" />
              <span>Previous</span>
            </button>
            <span style={{ fontWeight: 600, color: "var(--fg-muted)" }}>
              {selectedIndex + 1} of {images.length}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={nextImage}
              aria-label="Next photo"
            >
              <span>Next</span>
              <Icon name="arrowRight" size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

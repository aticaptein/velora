import React, { useState } from "react";

interface ResponsiveImageProps {
  name: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  aspectRatio?: string;
  style?: React.CSSProperties;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  name,
  alt,
  sizes = "(min-width: 1200px) 1200px, 100vw",
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
  aspectRatio,
  style,
}) => {
  const [hasError, setHasError] = useState(false);

  // If name is a full URL or path, use it directly
  const isHttp = name.startsWith("http://") || name.startsWith("https://");
  const cleanName = name.startsWith("/") ? name.slice(1) : name;
  const baseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  const basePath = isHttp
    ? name
    : `${baseUrl}${cleanName.startsWith("img/") ? cleanName : `img/${cleanName}`}`;

  if (hasError) {
    return (
      <div className={`media is-fallback ${className}`} style={{ aspectRatio, ...style }}>
        <div className="fallback-label">{alt || "VELORA Journey"}</div>
      </div>
    );
  }

  if (isHttp) {
    return (
      <div className={`media ${className}`} style={{ aspectRatio, ...style }}>
        <img
          src={name}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  const srcSet = `
    ${basePath}-480.webp 480w,
    ${basePath}-960.webp 960w,
    ${basePath}-1600.webp 1600w
  `.trim();

  return (
    <div className={`media ${className}`} style={{ aspectRatio, ...style }}>
      <img
        src={`${basePath}-960.webp`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

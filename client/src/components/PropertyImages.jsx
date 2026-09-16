import React, { useState } from "react";
import { assets } from "../assets/data";

/**
 * PropertyImages – displays a gallery of property images.
 * Supports any number of images, shows a thumbnail strip and a full‑screen lightbox.
 */
const PropertyImages = ({ images = [] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const openLightbox = (idx) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const next = () => setActiveIdx((i) => (i + 1) % images.length);
  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);

  if (!images || images.length === 0) {
    // graceful fallback – show placeholder image
    return (
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <img src={assets.placeholderImg} alt="No image" className="object-cover w-full h-full" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main image */}
      <div
        className="relative w-full aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
        onClick={() => openLightbox(0)}
      >
        <img src={images[0]} alt="Property" className="object-cover w-full h-full transition-transform duration-200 hover:scale-105" />
        {images.length > 1 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-lg font-medium">View {images.length} photos</span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto py-1">
          {images.slice(1).map((src, idx) => (
            <button
              key={idx}
              onClick={() => openLightbox(idx + 1)}
              className="flex-shrink-0 w-20 h-16 rounded overflow-hidden border border-gray-200"
            >
              <img src={src} alt={`thumb-${idx}`} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white text-3xl hover:text-amber-400"
            aria-label="Previous"
          >
            ‹
          </button>
          <img src={images[activeIdx]} alt={`lightbox-${activeIdx}`} className="max-w-full max-h-full rounded" />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white text-3xl hover:text-amber-400"
            aria-label="Next"
          >
            ›
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white text-2xl hover:text-amber-400"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyImages;
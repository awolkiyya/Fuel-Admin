"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Screenshot {
  src: string;
  alt: string;
  /** Optional 10px base64 blur placeholder generated at build time */
  blurDataURL?: string;
}

interface ProductScreenshotProps {
  /** One or more screenshots. Multiple = auto-crossfade "live" effect. */
  screenshots: Screenshot[];
  /**
   * Optional. Only set this when ProductScreenshot is used standalone
   * (NOT inside PhoneFrame/BrowserFrame) and needs to reserve its own
   * space. Inside a frame, leave this unset — the component fills the
   * frame's screen area exactly, so there's nothing to mismatch.
   */
  aspectRatio?: string;
  /** Seconds between crossfades when screenshots.length > 1 */
  intervalSeconds?: number;
  className?: string;
  /** Mark true only for the above-the-fold hero image */
  priority?: boolean;
}

/**
 * Renders one or more real product screenshots, auto-crossfading
 * between them to simulate a live, updating screen — the same trick
 * Linear/Stripe/Vercel use instead of recreating the UI in JSX.
 *
 * Always fills 100% of its parent (h-full w-full) rather than
 * declaring its own size. This is what makes it "fit the frame":
 * PhoneFrame / BrowserFrame own the actual screen dimensions, this
 * component just fills whatever box it's handed, edge to edge, with
 * object-cover so nothing letterboxes or overflows the bezel.
 *
 * Usage:
 *   <PhoneFrame>
 *     <ProductScreenshot
 *       screenshots={[
 *         { src: "/screens/driver-request.png", alt: "Fuel request submitted" },
 *         { src: "/screens/driver-dispensing.png", alt: "Fuel dispensing in progress" },
 *       ]}
 *     />
 *   </PhoneFrame>
 */
export const ProductScreenshot: React.FC<ProductScreenshotProps> = ({
  screenshots,
  aspectRatio,
  intervalSeconds = 3.5,
  className = "",
  priority = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (screenshots.length <= 1 || prefersReducedMotion.current) return;

    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % screenshots.length);
    }, intervalSeconds * 1000);

    return () => window.clearInterval(timer);
  }, [screenshots.length, intervalSeconds]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[inherit] ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {screenshots.map((shot, i) => (
        <Image
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          fill
          priority={priority && i === 0}
          placeholder={shot.blurDataURL ? "blur" : undefined}
          blurDataURL={shot.blurDataURL}
          sizes="(max-width: 768px) 90vw, 480px"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* subtle top-down vignette so status bars / toolbars sitting
          right above this stay legible against bright screenshots */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/15 to-transparent" />
    </div>
  );
};

export default ProductScreenshot;
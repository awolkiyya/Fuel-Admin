import React from "react";
import ProductScreenshot from "./ProductScreenshot";

interface Screenshot {
  src: string;
  alt: string;
  blurDataURL?: string;
}

interface ScreenshotCardProps {
  screenshots: Screenshot[];
  aspectRatio: string;
  intervalSeconds?: number;
  priority?: boolean;
}

/**
 * Use this instead of PhoneFrame/BrowserFrame when the screenshot
 * ALREADY shows the real status bar, browser toolbar, or window
 * chrome — stacking our fake chrome on top of a real one is the
 * most common way this pattern goes wrong. This just gives the
 * image a soft shadow, rounded corners, and a hairline border so it
 * still reads as a "device," without redrawing chrome that's
 * already in the pixels.
 */
export const ScreenshotCard: React.FC<ScreenshotCardProps> = ({
  screenshots,
  aspectRatio,
  intervalSeconds,
  priority,
}) => (
  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
    <ProductScreenshot
      screenshots={screenshots}
      aspectRatio={aspectRatio}
      intervalSeconds={intervalSeconds}
      priority={priority}
    />
  </div>
);

export default ScreenshotCard;
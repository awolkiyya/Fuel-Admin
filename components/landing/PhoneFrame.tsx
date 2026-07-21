import React from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
  /**
   * True when children is a real screenshot that already contains its
   * own status bar (ProductScreenshot). Removes the fake status bar
   * and padding so the image bleeds edge-to-edge with no double chrome.
   * False (default) keeps the fake status bar + padding, for the
   * hand-built mock screens (DriverAppScreen, etc).
   */
  isScreenshot?: boolean;
}

/**
 * Realistic device chrome (notch + status bar) so whatever is passed
 * as children reads as "an actual app screen," not a floating card.
 *
 * The screen area is a fixed aspect ratio (9 / 19.5, a standard modern
 * phone ratio) so any child that fills its parent (h-full w-full,
 * e.g. ProductScreenshot) fits exactly — no overflow past the bezel,
 * no gaps.
 */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isScreenshot = false }) => (
  <div className="relative mx-auto w-[260px] rounded-[2.5rem] border-[6px] border-white/10 bg-[#0F0D0C] p-2 shadow-2xl">
    {/* notch */}
    <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0F0D0C]" />

    <div className="relative flex flex-col overflow-hidden rounded-[1.9rem] bg-[#161311]">
      {/* fake status bar — omit when the screenshot already has a real one */}
      {!isScreenshot && (
        <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10px] text-white/70">
          <span className="font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {/* fixed-ratio screen area: children that fill h-full w-full fit exactly */}
      <div
        className={`relative w-full ${isScreenshot ? "" : "px-3.5 pb-5 pt-2"}`}
        style={{ aspectRatio: isScreenshot ? "9 / 19.5" : undefined, minHeight: isScreenshot ? undefined : 420 }}
      >
        {children}
      </div>
    </div>
  </div>
);

export default PhoneFrame;
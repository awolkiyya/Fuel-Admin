import React from "react";
import { ShieldCheck } from "lucide-react";

interface BrowserFrameProps {
  children: React.ReactNode;
  url: string;
  /**
   * True when children is a real screenshot (ProductScreenshot).
   * Gives the content area a fixed 16/10 aspect ratio and drops the
   * inner padding so the image fills edge-to-edge with no gaps.
   * False (default) keeps padding, for hand-built mock content.
   */
  isScreenshot?: boolean;
}

/**
 * Standard traffic-light chrome + URL bar so the dashboard content
 * reads as "a real web app," not a bare screenshot.
 */
export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  children,
  url,
  isScreenshot = false,
}) => (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#161311] shadow-2xl">
    <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-3.5 py-2.5">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <div className="flex flex-1 items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/40">
        <ShieldCheck className="h-2.5 w-2.5 text-teal-400" />
        {url}
      </div>
    </div>

    <div
      className={`relative w-full ${isScreenshot ? "" : "p-4"}`}
      style={{ aspectRatio: isScreenshot ? "16 / 10" : undefined }}
    >
      {children}
    </div>
  </div>
);

export default BrowserFrame;
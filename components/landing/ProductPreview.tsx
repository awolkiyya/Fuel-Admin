import React from "react";
import { Smartphone, Building2 } from "lucide-react";
import PhoneFrame from "./PhoneFrame";
import BrowserFrame from "./BrowserFrame";
import ProductScreenshot from "./ProductScreenshot";

/**
 * "One flow, two screens" — shows the driver's live dispensing view
 * next to the station's live request dashboard, side by side, so the
 * product's two-sided sync is something visible rather than a claim.
 *
 * Renders real product screenshots via ProductScreenshot, which fills
 * the frame's fixed-ratio screen area exactly (isScreenshot on both
 * frames) and auto-crossfades between the two images passed in.
 *
 * Self-contained: drop <ProductPreview /> into any page. It renders
 * its own <section id="product"> with full spacing, so no wrapper
 * markup is needed at the call site.
 */
export const ProductPreview: React.FC = () => {
  return (
    <section
      id="product"
      className="scroll-mt-20 border-t border-white/10 px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40">
            See it in action
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            One flow, two screens
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
            The driver watches fuel dispense live. The station sees the
            same request update in real time — on any browser.
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-8">
          {/* PHONE — driver app, screenshot fills the frame exactly */}
          <div className="flex flex-col items-center">
            <PhoneFrame isScreenshot>
              <ProductScreenshot
                priority
                screenshots={[
                  {
                    src: "/images/landing/Screenshot_1780222736.png",
                    alt: "FuelFlow driver app showing a submitted fuel request",
                  },
                ]}
              />
            </PhoneFrame>
            <div className="mt-5 flex items-center gap-1.5 text-xs text-white/40">
              <Smartphone className="h-3.5 w-3.5 text-orange-400" />
              Driver app
            </div>
          </div>

          {/* BROWSER — station dashboard, screenshot fills the frame exactly */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md md:translate-y-4">
              <BrowserFrame url="app.fuelflow.com/station" isScreenshot>
                <ProductScreenshot
                  screenshots={[
                    {
                      src: "/images/landing/dashboard.png",
                      alt: "Station dashboard showing pending pump requests",
                    },
                  ]}
                />
              </BrowserFrame>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs text-white/40">
              <Building2 className="h-3.5 w-3.5 text-teal-400" />
              Station web dashboard
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
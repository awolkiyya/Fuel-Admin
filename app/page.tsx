"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Fuel,
  Smartphone,
  Building2,
  Gauge,
  Route,
  ShieldCheck,
  Apple,
  PlayCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Navigation,
  MapPin,
  Radar,
  Wifi,
  Signal,
  BatteryFull,
  ClipboardList,
  Search,
  Bell,
  Droplets,
  Menu,
  X,
  Star,
  ChevronDown,
  Mail,
  Loader2,
  AlertCircle,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import ProductPreview from "@/components/landing/ProductPreview";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

/* =========================================================
   DESIGN TOKENS
   Color: asphalt charcoal (#1C1917) + fuel amber (#EA580C)
           + route teal (#0D9488), warm card (#FDF6EC)
   Light mode swaps the roles of asphalt charcoal and warm
   card: charcoal becomes the text/ink color, warm card
   becomes the page background. Accents (amber/teal) stay
   the same in both modes.
   Type:  condensed bold display (signage feel) / clean sans body
           / mono for stats (pump-readout feel)
========================================================= */

const NAV_LINKS = [
  { id: "product", label: "Product" },
  { id: "how-it-works", label: "How it works" },
  { id: "finder", label: "AI finder" },
  { id: "faq", label: "FAQ" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "om", label: "Afaan Oromoo" },
  { code: "am", label: "አማርኛ" },
]

/* =========================================================
   HEADER
   Sticky, with a lightweight scrollspy so the active section
   is always legible — small "smart" touch that also helps
   orientation on a long single-page product site.
========================================================= */
const Header: React.FC<{
  activeSection: string;
  onNavigate: (id: string) => void;
  siginIn:()=>void;
}> = ({ activeSection, onNavigate,siginIn }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    theme,
    setTheme,
    resolvedTheme,
  } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-orange-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || menuOpen
            ? "border-b border-black/10 bg-[#FDF6EC]/90 backdrop-blur-md dark:border-white/10 dark:bg-[#1C1917]/90"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNav("hero");
            }}
            className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDF6EC] dark:focus-visible:ring-offset-[#1C1917]"
          >
            
            <img
              src="/images/mark.png"
              alt="Logo"
              className="
                h-7
                w-7
                md:h-8
                md:w-8
              "
            />
            <span className="text-sm font-bold tracking-tight">FuelConnect</span>
          </a>

          {/* desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.id);
                }}
                aria-current={activeSection === link.id ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  activeSection === link.id
                    ? "text-[#1C1917] dark:text-white"
                    : "text-black/50 hover:text-black/80 dark:text-white/50 dark:hover:text-white/80"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-orange-500" />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button
                onClick={siginIn}
                variant="outline"
              className="h-9 border-black/15 bg-transparent text-xs text-[#1C1917] hover:bg-black/5 hover:text-[#1C1917] dark:border-white/15 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
            >
              Sign in
            </Button>
            {/* Controls */}
        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* Language */}
          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button
                variant="ghost"
                size="icon"
              >
                <Globe className="h-4 w-4"/>
              </Button>

            </DropdownMenuTrigger>


            <DropdownMenuContent align="end">

              {
                LANGUAGES.map((lang)=>(
                  <DropdownMenuItem
                    key={lang.code}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))
              }

            </DropdownMenuContent>


          </DropdownMenu>



          {/* Theme */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(
                resolvedTheme === "dark"
                ? "light"
                : "dark"
              )
            }
          >

            {
              resolvedTheme === "dark"
              ?
              <Sun className="h-4 w-4"/>
              :
              <Moon className="h-4 w-4"/>
            }

          </Button>


        </div>
          </div>

          {/* mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/15 text-[#1C1917] dark:border-white/15 dark:text-white md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* mobile menu panel */}
        {menuOpen && (
          <div className="border-t border-black/10 bg-[#FDF6EC] px-6 pb-6 pt-2 dark:border-white/10 dark:bg-[#1C1917] md:hidden">
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.id);
                  }}
                  className={`border-b border-black/[0.06] py-3.5 text-sm font-medium dark:border-white/[0.06] ${
                    activeSection === link.id ? "text-orange-500 dark:text-orange-400" : "text-black/70 dark:text-white/70"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2.5">
              <Button
                onClick={siginIn}
                variant="outline"
                className="h-10 w-full border-black/15 bg-transparent text-sm text-[#1C1917] hover:bg-black/5 hover:text-[#1C1917] dark:border-white/15 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                Sign in
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

/* =========================================================
   AUDIENCE CARD
========================================================= */
interface AudienceCardProps {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  children: React.ReactNode;
  accent: "amber" | "teal";
}

const AudienceCard: React.FC<AudienceCardProps> = ({
  step,
  icon: Icon,
  eyebrow,
  title,
  description,
  features,
  children,
  accent,
}) => {
  const accentClasses =
    accent === "amber"
      ? {
          chip: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
          ring: "group-hover:border-orange-500/30",
          node: "bg-orange-500",
          glow: "group-hover:shadow-orange-500/10",
          check: "text-orange-600 dark:text-orange-400",
        }
      : {
          chip: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400",
          ring: "group-hover:border-teal-500/30",
          node: "bg-teal-400",
          glow: "group-hover:shadow-teal-500/10",
          check: "text-teal-600 dark:text-teal-400",
        };

  return (
    <div className="relative flex flex-col">
      <div
        className={`absolute -top-[47px] left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-[#FDF6EC] dark:ring-[#1C1917] md:block ${accentClasses.node}`}
      />

      <div
        className={`group relative flex flex-1 flex-col rounded-2xl border border-black/10 bg-black/[0.03] p-6 shadow-xl shadow-transparent transition-all duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.03] ${accentClasses.ring} ${accentClasses.glow}`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${accentClasses.chip}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <span className="font-mono text-xs text-black/25 dark:text-white/25">{step}</span>
        </div>

        <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.15em] text-black/40 dark:text-white/40">
          {eyebrow}
        </p>
        <h3 className="mt-1.5 text-xl font-bold text-[#1C1917] tracking-tight dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-black/55 dark:text-white/55">
          {description}
        </p>

        <ul className="mt-4 space-y-2 border-t border-black/10 pt-4 dark:border-white/10">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-xs text-black/50 dark:text-white/50"
            >
              <CheckCircle2
                className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accentClasses.check}`}
              />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

/* =========================================================
   TRAFFIC SIGNAL
========================================================= */
type TrafficLevel = "low" | "medium" | "high";

const TRAFFIC_META: Record<
  TrafficLevel,
  { label: string; bars: number; color: string; text: string }
> = {
  low: { label: "Low traffic", bars: 1, color: "bg-teal-400", text: "text-teal-600 dark:text-teal-400" },
  medium: { label: "Moderate", bars: 2, color: "bg-orange-400", text: "text-orange-600 dark:text-orange-400" },
  high: { label: "Busy", bars: 3, color: "bg-red-400", text: "text-red-600 dark:text-red-400" },
};

const TrafficSignal: React.FC<{ level: TrafficLevel }> = ({ level }) => {
  const meta = TRAFFIC_META[level];

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={meta.label}>
      <div className="flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1 rounded-sm transition-colors ${
              i < meta.bars ? meta.color : "bg-black/10 dark:bg-white/10"
            }`}
            style={{ height: `${6 + i * 4}px` }}
          />
        ))}
      </div>
      <span className={`text-[11px] font-medium ${meta.text}`}>{meta.label}</span>
    </div>
  );
};

/* =========================================================
   STATION ROW
========================================================= */
interface StationRowProps {
  name: string;
  distance: string;
  wait: string;
  level: TrafficLevel;
  recommended?: boolean;
}

const StationRow: React.FC<StationRowProps> = ({
  name,
  distance,
  wait,
  level,
  recommended,
}) => (
  <div
    className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
      recommended
        ? "border-teal-500/30 bg-teal-500/[0.06]"
        : "border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02]"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          recommended ? "bg-teal-500/15" : "bg-black/[0.06] dark:bg-white/[0.06]"
        }`}
      >
        <Fuel className={`h-4 w-4 ${recommended ? "text-teal-600 dark:text-teal-400" : "text-black/40 dark:text-white/40"}`} />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-[#1C1917] dark:text-white">{name}</span>
          {recommended && (
            <span className="flex items-center gap-1 rounded-full bg-teal-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
              <Sparkles className="h-2.5 w-2.5" />
              Best pick
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-black/40 dark:text-white/40">
          <MapPin className="h-3 w-3" />
          {distance} away · {wait} wait
        </div>
      </div>
    </div>

    <TrafficSignal level={level} />
  </div>
);



/* =========================================================


/* =========================================================
   FAQ ITEM — accessible accordion
========================================================= */
const FaqItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}> = ({ question, answer, isOpen, onToggle, id }) => (
  <div className="border-b border-black/10 py-1 dark:border-white/10">
    <h3>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        id={`${id}-trigger`}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-[#1C1917] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-white md:text-base"
      >
        {question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-black/40 transition-transform duration-200 dark:text-white/40 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </h3>
    <div
      id={`${id}-panel`}
      role="region"
      aria-labelledby={`${id}-trigger`}
      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <p className="pr-8 text-sm leading-relaxed text-black/55 dark:text-white/55">{answer}</p>
      </div>
    </div>
  </div>
);

/* =========================================================
   LANDING PAGE
========================================================= */
export default function LandingPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("hero");
  const [refreshedSecondsAgo, setRefreshedSecondsAgo] = useState(0);
  const sectionIds = ["hero", "product", "how-it-works", "finder", "testimonials", "faq", "contact"];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // scrollspy: keeps header nav + focus in sync with what's on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ambient "live" timestamp for the AI finder mockup
  useEffect(() => {
    const interval = window.setInterval(() => {
      setRefreshedSecondsAgo((s) => (s >= 14 ? 0 : s + 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const faqs = [
    {
      q: "How does a fuel request actually get approved?",
      a: "A driver submits a request from the app with fuel type and volume. If they're on a managed fleet, it routes to their fleet manager for approval first; independent drivers go straight to the station queue. Once approved, the station verifies the vehicle and assigns a pump.",
    },
    {
      q: "Can I set spending limits for my fleet?",
      a: "Yes. Fleet managers can set per-vehicle volume caps, restrict fuel type, and require approval above a threshold. Every request is logged against the vehicle, so reconciliation at month-end takes minutes, not spreadsheets.",
    },
    {
      q: "Do stations need to install anything?",
      a: "No. Once your station is onboarded by our team, the dashboard runs entirely in the browser — no hardware or software installation required on your end.",
    },
    {
      q: "How does the AI station finder decide what to recommend?",
      a: "It combines live queue length, current dispensing rate, and your distance to each connected station, then ranks by total time-to-full-tank rather than distance alone. Rankings update continuously as conditions change.",
    },
    {
      q: "Is my payment and fuel data secure?",
      a: "All requests are encrypted in transit and at rest, and every dispensed litre is tied to a verified vehicle and timestamp. Stations and fleet managers only see the data relevant to their own requests.",
    },
  ];

 

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#1C1917] dark:bg-[#1C1917] dark:text-white overflow-x-hidden [scroll-behavior:smooth]">
      <Header activeSection={activeSection} onNavigate={handleNavigate}  siginIn={()=> router.push("/auth/login")}/>

      <main id="main">
        {/* =====================================================
            HERO
        ===================================================== */}
        <section id="hero" className="relative px-6 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-mono text-black/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Live across Adama fuel stations
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
              One route from
              <span className="text-orange-500"> request </span>
              to
              <span className="text-teal-500 dark:text-teal-400"> pump</span>.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-black/55 dark:text-white/55 md:text-lg">
              FuelFlow connects drivers, fleet managers, and fuel stations on a
              single platform — request, approve, and dispense fuel without
              paperwork.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button className="h-11 gap-2 bg-orange-600 px-6 text-sm font-semibold text-white hover:bg-orange-700">
                Get the driver app
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/auth/login")}
                className="h-11 gap-2 border-black/15 bg-transparent px-6 text-sm text-[#1C1917] hover:bg-black/5 hover:text-[#1C1917] dark:border-white/15 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                Access your dashboard
              </Button>
            </div>
          </div>

          <div className="relative mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-black/10 text-center dark:divide-white/10">
            <div>
              <div className="font-mono text-2xl font-bold text-[#1C1917] dark:text-white md:text-3xl">240+</div>
              <div className="mt-1 text-[11px] text-black/40 dark:text-white/40">Stations connected</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[#1C1917] dark:text-white md:text-3xl">18K</div>
              <div className="mt-1 text-[11px] text-black/40 dark:text-white/40">Drivers on the app</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-bold text-[#1C1917] dark:text-white md:text-3xl">&lt;2min</div>
              <div className="mt-1 text-[11px] text-black/40 dark:text-white/40">Avg. request to approval</div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT PREVIEW
        ===================================================== */}
        <section id="product" className="scroll-mt-20 border-t border-black/10 px-6 py-20 dark:border-white/10 md:px-12 md:py-28">
            <ProductPreview/>

        </section>

        {/* =====================================================
            THE ROUTE — audience cards
        ===================================================== */}
        <section id="how-it-works" className="relative scroll-mt-20 px-6 pb-24 md:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-black/40 dark:text-white/40">
                Built for the whole route
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                Whichever side of the pump you're on
              </h2>
            </div>

            <div className="relative pt-14">
              <div
                className="pointer-events-none absolute left-0 right-0 top-14 hidden h-px md:block"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(120,113,108,0.35) 0 10px, transparent 10px 20px)",
                }}
              />

              <div className="grid gap-5 md:grid-cols-3">
                <AudienceCard
                  step="01"
                  icon={Smartphone}
                  eyebrow="For drivers"
                  title="Request fuel from your phone"
                  description="Submit a request, track approval status, and see the exact pump assigned to you."
                  features={[
                    "Real-time approval status",
                    "Pump number the moment it's assigned",
                  ]}
                  accent="amber"
                >
                  <div className="space-y-2.5">
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/[0.04] px-4 py-2.5 transition-colors hover:bg-black/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                    >
                      <Apple className="h-5 w-5" />
                      <div className="leading-tight">
                        <div className="text-[10px] text-black/40 dark:text-white/40">Download on the</div>
                        <div className="text-sm font-semibold">App Store</div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/[0.04] px-4 py-2.5 transition-colors hover:bg-black/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                    >
                      <PlayCircle className="h-5 w-5" />
                      <div className="leading-tight">
                        <div className="text-[10px] text-black/40 dark:text-white/40">Get it on</div>
                        <div className="text-sm font-semibold">Google Play</div>
                      </div>
                    </a>
                  </div>
                </AudienceCard>

                <AudienceCard
                  step="02"
                  icon={Gauge}
                  eyebrow="For fleet managers"
                  title="Approve and track in real time"
                  description="See every request across your organization and set volume limits before fuel ever gets dispensed."
                  features={[
                    "One dashboard for every vehicle",
                    "Full request-to-dispense history",
                  ]}
                  accent="teal"
                >
                  <Button
                    onClick={() => handleNavigate("contact")}
                    className="w-full gap-2 bg-[#1C1917] text-white hover:bg-[#1C1917]/90 dark:bg-white dark:text-[#1C1917] dark:hover:bg-white/90"
                  >
                    Open the console
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </AudienceCard>

                <AudienceCard
                  step="03"
                  icon={Building2}
                  eyebrow="For fuel stations"
                  title="Managed access to run your pumps"
                  description="Once your station is onboarded by our team, verify requests, assign nozzles, and log dispensed volume from any browser."
                  features={[
                    "No install — works in any browser",
                    "Matches fuel type & volume automatically",
                  ]}
                  accent="amber"
                >
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate("contact")}
                    className="w-full gap-2 border-black/15 bg-transparent hover:bg-black/5 hover:text-[#1C1917] dark:border-white/15 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Talk to our team
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <p className="mt-2 text-[11px] text-black/35 dark:text-white/35">
                    Stations are onboarded by our team — no app install
                    needed once you're set up.
                  </p>
                </AudienceCard>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI STATION FINDER
        ===================================================== */}
        <section id="finder" className="scroll-mt-20 border-t border-black/10 px-6 py-20 dark:border-white/10 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/[0.08] px-3 py-1 text-[11px] font-mono text-teal-600 dark:bg-teal-500/[0.06] dark:text-teal-400">
                <Radar className="h-3 w-3" />
                AI-powered
              </div>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                Skip the line before
                <br />
                you even leave.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-black/55 dark:text-white/55 md:text-base">
                FuelFlow reads live queue and dispensing data across the
                network and points you to the station that'll actually get
                you back on the road fastest — not just the nearest one.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-black/70 dark:text-white/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  Live congestion at every connected station, updated in real time
                </li>
                <li className="flex items-start gap-2.5 text-sm text-black/70 dark:text-white/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  Ranked by wait time and distance together, not distance alone
                </li>
                <li className="flex items-start gap-2.5 text-sm text-black/70 dark:text-white/70">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  One-tap navigation to the recommended pump
                </li>
              </ul>

              <Button className="mt-7 gap-2 bg-teal-600 text-white hover:bg-teal-700">
                <Navigation className="h-4 w-4" />
                Find my nearest station
              </Button>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-teal-500/[0.06] blur-2xl" />

              <div className="relative rounded-2xl border border-black/10 bg-black/[0.03] p-4 shadow-2xl dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-1 pb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-black/40 dark:text-white/40">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400" />
                    </span>
                    Live near you
                  </div>
                  <span className="font-mono text-[10px] text-black/30 dark:text-white/30" aria-live="polite">
                    updated {refreshedSecondsAgo}s ago
                  </span>
                </div>

                <div className="space-y-2">
                  <StationRow
                    name="Adama Total Station"
                    distance="1.2 km"
                    wait="~3 min"
                    level="low"
                    recommended
                  />
                  <StationRow
                    name="Oromia Fuel Depot"
                    distance="0.8 km"
                    wait="~11 min"
                    level="medium"
                  />
                  <StationRow name="NOC Station 4" distance="2.1 km" wait="~19 min" level="high" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TESTIMONIALS
        ===================================================== */}
        {/* <section id="testimonials" className="scroll-mt-20 border-t border-white/10 px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40">
                Trusted on the road
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                What the network is saying
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section> */}

        {/* =====================================================
            TRUST STRIP
        ===================================================== */}
        <section className="border-t border-black/10 px-6 py-10 dark:border-white/10 md:px-12">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs text-black/40 dark:text-white/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Verified fuel type & volume matching
            </div>
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-orange-500" />
              Full request-to-dispense history
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              No paperwork, no manual logs
            </div>
          </div>
        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}
        <section id="faq" className="scroll-mt-20 border-t border-black/10 px-6 py-20 dark:border-white/10 md:px-12 md:py-28">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-black/40 dark:text-white/40">
                Questions
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                Frequently asked
              </h2>
            </div>

            <div>
              {faqs.map((faq, i) => (
                <FaqItem
                  key={faq.q}
                  id={`faq-${i}`}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT / WAITLIST
        ===================================================== */}
        {/* <ContactSection /> */}
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-black/10 px-6 py-14 dark:border-white/10 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
                  <Fuel className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold tracking-tight">FuelConnect</span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-black/40 dark:text-white/40">
                One route from request to pump — built for Oromia's fuel
                network.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
                Product
              </p>
              <ul className="mt-3 space-y-2.5 text-xs text-black/55 dark:text-white/55">
                <li>
                  <a href="#product" onClick={(e) => { e.preventDefault(); handleNavigate("product"); }} className="hover:text-[#1C1917] dark:hover:text-white">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#finder" onClick={(e) => { e.preventDefault(); handleNavigate("finder"); }} className="hover:text-[#1C1917] dark:hover:text-white">
                    AI station finder
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNavigate("how-it-works"); }} className="hover:text-[#1C1917] dark:hover:text-white">
                    How it works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
                Company
              </p>
              <ul className="mt-3 space-y-2.5 text-xs text-black/55 dark:text-white/55">
                <li>
                  <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleNavigate("testimonials"); }} className="hover:text-[#1C1917] dark:hover:text-white">
                    Customers
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => { e.preventDefault(); handleNavigate("faq"); }} className="hover:text-[#1C1917] dark:hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavigate("contact"); }} className="hover:text-[#1C1917] dark:hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
                Legal
              </p>
              <ul className="mt-3 space-y-2.5 text-xs text-black/55 dark:text-white/55">
                <li>
                  <a href="#" className="hover:text-[#1C1917] dark:hover:text-white">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1C1917] dark:hover:text-white">
                    Terms of service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 dark:border-white/10 sm:flex-row">
            <p className="text-xs text-black/30 dark:text-white/30">
              © {new Date().getFullYear()} FuelFlow. Built for Oromia's fuel network.
            </p>
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); handleNavigate("hero"); }}
              className="flex items-center gap-1 text-xs text-black/40 hover:text-[#1C1917] dark:text-white/40 dark:hover:text-white"
            >
              Back to top
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";


/**
 * =========================================================
 * SITE CONFIGURATION
 * =========================================================
 */

const SITE_URL = "https://fuelstation.adamacity.gov.et";

const SITE_NAME = "Adama Smart Fuel Management System";

const SITE_DESCRIPTION =
  "Adama City's unified smart fuel ecosystem connecting citizens, drivers, vehicles, and fuel stations through one secure digital platform. Manage fuel dispensing, quotas, transactions, AI-powered monitoring, and smart camera security while maintaining a single, traceable transaction record and preventing duplicate fuel claims.";


/**
 * =========================================================
 * FONTS
 * =========================================================
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


/**
 * =========================================================
 * SEO / METADATA
 * =========================================================
 */

export const metadata: Metadata = {
  /**
   * Base URL used by canonical URLs,
   * Open Graph images, icons, etc.
   */
  metadataBase: new URL(SITE_URL),

  /**
   * Browser title
   */
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  /**
   * Main SEO description
   */
  description: SITE_DESCRIPTION,

  /**
   * Application name
   */
  applicationName: SITE_NAME,

  /**
   * Publisher / organization
   */
  authors: [
    {
      name: "Adama City Administration",
    },
  ],

  creator: "Adama City Administration",

  publisher: "Adama City Administration",

  /**
   * Application category
   */
  category: "Government Technology",

  /**
   * Canonical URL
   */
  alternates: {
    canonical: SITE_URL,
  },

  /**
   * Search keywords.
   *
   * Note:
   * Modern search engines do not rely heavily on the
   * keywords meta tag. These are mainly descriptive.
   */
  keywords: [
    "Adama Smart Fuel Management System",
    "Adama City Fuel Management",
    "Adama City Smart Fuel",
    "Smart Fuel Management",
    "Digital Fuel Management",
    "Fuel Management System",
    "Fuel Station Management",
    "Fuel Dispensing Management",
    "Fuel Transaction Management",
    "Fuel Quota Management",
    "Citizen Fuel Management",
    "Driver Fuel Management",
    "Vehicle Fuel Management",
    "Fuel Mobile App",
    "Smart Fuel Station",
    "Intelligent Fuel Dispensing",
    "AI Fuel Monitoring",
    "AI Fuel Management",
    "Smart Camera Fuel Security",
    "Fuel Transaction Tracking",
    "Duplicate Fuel Prevention",
    "Centralized Fuel Management",
    "Digital Government Ethiopia",
    "Adama City Administration",
    "Fuel Management Ethiopia",
  ],

  /**
   * =======================================================
   * ROBOTS
   * =======================================================
   *
   * This allows the public-facing website to be indexed.
   *
   * Private dashboard pages should separately use
   * noindex metadata.
   */
  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /**
   * =======================================================
   * OPEN GRAPH
   * =======================================================
   *
   * Used when the website is shared on:
   * - Facebook
   * - LinkedIn
   * - WhatsApp
   * - other Open Graph compatible platforms
   */
  openGraph: {
    type: "website",

    locale: "en_US",

    url: SITE_URL,

    siteName: SITE_NAME,

    title: SITE_NAME,

    description:
      "One city. One fuel platform. A unified digital ecosystem connecting citizens, drivers, vehicles, fuel stations, intelligent dispensing, AI monitoring, smart cameras, and centralized fuel transactions.",

    images: [
      {
        url: "/images/mark.png",
        width: 1200,
        height: 630,
        alt: "Adama Smart Fuel Management System",
      },
    ],
  },

  /**
   * =======================================================
   * TWITTER / X
   * =======================================================
   */

  twitter: {
    card: "summary_large_image",

    title: SITE_NAME,

    description:
      "A unified smart fuel ecosystem for Adama City connecting citizens, drivers, vehicles, fuel stations, intelligent dispensing, AI monitoring, smart cameras, and centralized fuel transactions.",

    images: ["/images/mark.png"],
  },

  /**
   * =======================================================
   * ICONS
   * =======================================================
   */

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-icon.png",
      },
    ],
  },
};


/**
 * =========================================================
 * VIEWPORT
 * =========================================================
 */

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  colorScheme: "light dark",

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#09090b",
    },
  ],
};


/**
 * =========================================================
 * ROOT LAYOUT
 * =========================================================
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        antialiased
      `}
    >
      <body
        className="
          min-h-full
          flex
          flex-col
          bg-background
          text-foreground
        "
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <TooltipProvider>
              {children}

              <Toaster
                richColors
                position="top-right"
                closeButton
                expand={false}
                toastOptions={{
                  style: {
                    fontSize: "14px",
                    borderRadius: "10px",
                  },
                }}
              />
            </TooltipProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
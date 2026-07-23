"use client";

import { Construction, Sparkles, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-6">
      <div className="mx-auto max-w-2xl text-center">
        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 ring-1 ring-primary/20 shadow-lg">
          <Construction className="h-12 w-12 text-primary" />
        </div>

        {/* Status */}
        <div className="mt-6 flex justify-center">
          <Badge
            variant="secondary"
            className="gap-2 rounded-full px-4 py-1 text-sm"
          >
            <Clock3 className="h-4 w-4" />
            Under Development
          </Badge>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          Dashboard Coming Soon
        </h1>

        {/* Description */}
        <p className="mt-4 text-muted-foreground text-lg leading-8">
          We're building a smarter and more powerful dashboard to provide
          real-time analytics, AI insights, station monitoring, reports, and
          operational management.
        </p>

        {/* Feature Preview */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 text-left shadow-sm">
            <Sparkles className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">Smart Analytics</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Live KPIs, AI-powered insights, operational statistics, and
              performance monitoring.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 text-left shadow-sm">
            <Construction className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">More Features</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Queue monitoring, camera integration, reports, driver
              management, fuel station operations, and much more.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10">
          <Button disabled size="lg" className="rounded-xl px-8">
            Feature in Development
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            This module will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
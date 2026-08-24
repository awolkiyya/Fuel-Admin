"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  ArrowLeft,
  UserX,
  Lock,
} from "lucide-react";

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();

  const reason = searchParams.get("reason");

  /**
   * =====================================================
   * MESSAGE
   * =====================================================
   */

  const getMessage = () => {
    switch (reason) {
      case "not_authenticated":
        return "You must be logged in to access this system.";

      case "invalid_role":
        return "Your account role is not recognized by the system.";

      case "access_denied":
        return "You do not have permission to access this resource.";

      default:
        return "Access to this page is restricted.";
    }
  };

  /**
   * =====================================================
   * ICON
   * =====================================================
   */

  const getIcon = () => {
    switch (reason) {
      case "not_authenticated":
        return (
          <Lock className="h-10 w-10 text-red-500" />
        );

      case "invalid_role":
        return (
          <UserX className="h-10 w-10 text-red-500" />
        );

      case "access_denied":
      default:
        return (
          <ShieldAlert className="h-10 w-10 text-red-500" />
        );
    }
  };

  /**
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-6 text-center animate-fade-in">

        {/* =================================================
            ICON
        ================================================= */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border bg-red-500/10">
          {getIcon()}
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Access Restricted
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            {getMessage()}
          </p>
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">

          {/* GO BACK */}

          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          {/* DASHBOARD */}

          <Link href="/dashboard">
            <Button
              type="button"
              className="w-full gap-2 sm:w-auto"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="border-t pt-6 text-xs text-muted-foreground">
          Adama City Commercial Enforcement System
        </div>

      </div>
    </div>
  );
}
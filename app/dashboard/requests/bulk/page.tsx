"use client";

import React from "react";
import { Construction } from "lucide-react";

/* =========================================================
   PAGE
========================================================= */

export default function BulkRequestsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* subtle ambient glow behind the icon */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/[0.08] blur-3xl pointer-events-none" />

      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 mb-8 shadow-sm">
        <Construction className="h-11 w-11 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
      </div>

      <h1 className="relative text-3xl font-bold tracking-tight">
        Ajajawwan Boba'aa Baay'inaan
      </h1>
      <p className="relative text-lg font-medium text-indigo-600 dark:text-indigo-400 mt-2">
        Ammaan tana hojjetamaa jira
      </p>
      <p className="relative text-sm text-muted-foreground mt-3 max-w-md">
        Fuulli kun amma hin xumuramne. Dhiyeenya kana deebi'aa daawwadhaa — tajaajiloonni tokko tokko yeroo eegalan jijjiiramuu ykn guutuu dhabuu danda'u.
      </p>
    </div>
  );
}
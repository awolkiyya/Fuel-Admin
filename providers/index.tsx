"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ReduxProvider } from "./ReduxProvider"
import { ReactQueryProvider } from "./ReactQueryProvider"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  )
}
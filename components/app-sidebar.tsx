"use client"

import * as React from "react"
import { useSelector } from "react-redux"
import { Fuel } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NAV_BY_ROLE } from "@/configs/navConfig"
import { UserRole } from "@/types/user"
import { RootState } from "@/lib/store"

/* -----------------------------
   Skeleton Loader
------------------------------ */
function SidebarSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-muted" />
      <div className="h-4 w-32 bg-muted rounded" />
      <div className="h-3 w-24 bg-muted rounded" />

      <div className="space-y-2 mt-6">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
    </div>
  )
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useSelector(
    (state: RootState) => state.auth
  )

  /* -----------------------------
     1. LOADING STATE
  ------------------------------ */
  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarSkeleton />
        </SidebarHeader>
      </Sidebar>
    )
  }

  /* -----------------------------
     2. NO USER STATE
  ------------------------------ */
  if (!user) return null

  /* -----------------------------
     3. ROLE + NAVIGATION
  ------------------------------ */
  const userRole: UserRole = user.role || "station_manager"
  const navMain = NAV_BY_ROLE[userRole]

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* HEADER */}
      <SidebarHeader className="flex flex-row p-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Fuel className="size-4" />
        </div>

        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">
            Fuel Station System
          </span>
          <span className="truncate text-xs">{userRole}</span>
        </div>
      </SidebarHeader>

      {/* NAVIGATION */}
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      {/* USER */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
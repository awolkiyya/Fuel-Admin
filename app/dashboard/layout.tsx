"use client"

import { AuthProvider } from "@/providers/AuthProvider"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <div className="flex h-16 items-center px-4 border-b">
            <SidebarTrigger />
            <h1 className="ml-2 font-semibold">Camera System</h1>
          </div>

          <div className="p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}
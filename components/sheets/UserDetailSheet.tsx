"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AuthUser } from "@/types/user"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onClose: () => void
  user: AuthUser | null
}

/* -----------------------------
   STATUS STYLE MAP
------------------------------ */
const statusClass = {
  ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  SUSPENDED: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  BLOCKED: "bg-red-500/10 text-red-600 border-red-500/20",
} as const

const roleClass = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20"
    case "station_manager":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "station_staff":
      return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

/* -----------------------------
   MAIN COMPONENT
------------------------------ */
export const UserDetailSheet = ({ open, onClose, user }: Props) => {
  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[440px] sm:w-[520px] p-0">

        {/* ================= HEADER ================= */}
        <div className="px-6 pt-6 pb-4 space-y-1 border-b">
          <SheetHeader>
            <SheetTitle className="text-lg">
              User Details
            </SheetTitle>
          </SheetHeader>

          <p className="text-sm text-muted-foreground">
            Full account profile & system access overview
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="px-6 py-5 space-y-6">

          {/* PROFILE SECTION */}
          <div className="flex items-start gap-4">

            <Avatar className="h-14 w-14 ring-1 ring-border">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback className="text-base">
                {user.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 flex-1">

              <div>
                <p className="font-semibold text-base leading-tight">
                  {user.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.email || "No email provided"}
                </p>
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2">
                <Badge className={roleClass(user.role)}>
                  {user.role.replace("_", " ")}
                </Badge>

                <Badge
                  variant="outline"
                  className={cn(
                    "border",
                    statusClass[user.status]
                  )}
                >
                  {user.status}
                </Badge>
              </div>

            </div>
          </div>

          <Separator />

          {/* CORE INFO */}
          <Section title="Basic Information">
            <InfoRow label="Phone" value={user.phoneNumber} />
            <InfoRow label="Gender" value={user.gender} />
            <InfoRow
              label="Created"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </Section>

          <Separator />

          {/* ORGANIZATION */}
          <Section title="Organization">
            <InfoRow
              label="Station"
              value={user.station?.name || "—"}
            />
            <InfoRow
              label="Station ID"
              value={user.stationId || "—"}
            />
          </Section>

          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* -----------------------------
   SECTION WRAPPER
------------------------------ */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground/90">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

/* -----------------------------
   INFO ROW (CLEAN UX)
------------------------------ */
function InfoRow({
  label,
  value,
  truncate = false,
}: {
  label: string
  value: string
  truncate?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span
        className={cn(
          "font-medium text-right",
          truncate && "truncate max-w-[180px]"
        )}
      >
        {value}
      </span>
    </div>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Users,
  UserPlus,
  Mail,
  Phone,
  MoreVertical,
  Search,
  Edit,
  CheckCircle,
  Moon,
  Ban,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Info,
  CircleCheck,
} from "lucide-react"

import { StaffStatus, StationStaff } from "@/types/station"
import {
  useCreateStaff,
  useStationStaff,
  useUpdateStaff,
  useUpdateStaffStatus,
} from "@/hooks/station/useStaffs.hook"

// ─── helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-teal-100 text-teal-800",
  "bg-purple-100 text-purple-800",
  "bg-amber-100 text-amber-800",
  "bg-pink-100 text-pink-800",
]

function avatarColor(id: string) {
  const n = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function StatusBadge({ status }: { status: StaffStatus }) {
  const map: Record<StaffStatus, { className: string; dot: string; label: string }> = {
    ACTIVE: {
      className: "bg-teal-50 text-teal-800 border border-teal-200",
      dot: "bg-teal-500",
      label: "On duty",
    },
    BLOCKED: {
      className: "bg-gray-100 text-gray-600 border border-gray-200",
      dot: "bg-gray-400",
      label: "Blocked",
    },
    SUSPENDED: {
      className: "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-500",
      label: "Suspended",
    },
    INACTIVE:{
      className: "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-500",
      label: "Off shift",
    },
  }
  const { className, dot, label } = map[status] ?? map.BLOCKED
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

// ─── field hint ───────────────────────────────────────────────────────────────

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
      <Info className="w-3 h-3 shrink-0" />
      {children}
    </p>
  )
}

// ─── gender picker ────────────────────────────────────────────────────────────

function GenderPicker({
  value,
  onChange,
}: {
  value: "MALE" | "FEMALE"
  onChange: (v: "MALE" | "FEMALE") => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-1">
      {(["MALE", "FEMALE"] as const).map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-md border text-sm transition-all ${
            value === g
              ? "border-primary bg-primary/8 text-primary font-medium"
              : "border-border text-muted-foreground hover:bg-muted/40"
          }`}
        >
          {g === "MALE" ? "♂" : "♀"} {g === "MALE" ? "Male" : "Female"}
        </button>
      ))}
    </div>
  )
}

// ─── password input ───────────────────────────────────────────────────────────

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-9"
      />
      <button
        type="button"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}

// ─── toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-background shadow-lg text-sm transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <CircleCheck className="w-4 h-4 text-teal-600 shrink-0" />
      <span className="text-foreground">{message}</span>
    </div>
  )
}

function useToast() {
  const [state, setState] = useState({
    message: "",
    visible: false,
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = (message: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setState({
      message,
      visible: true,
    })

    timerRef.current = setTimeout(() => {
      setState((s) => ({
        ...s,
        visible: false,
      }))
    }, 2800)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return {
    ...state,
    show,
  }
}

// ─── stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  count,
  label,
  iconClass,
}: {
  icon: React.ElementType
  count: number
  label: string
  iconClass: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 flex-1">
      <Icon className={`w-5 h-5 shrink-0 ${iconClass}`} />
      <div>
        <div className="text-lg font-medium leading-none">{count}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  )
}

// ─── create dialog ────────────────────────────────────────────────────────────

function CreateStaffDialog({
  stationId,
  onCreate,
}: {
  stationId: string
  onCreate: () => void
}) {
  const createStaff = useCreateStaff(stationId)

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE")
  const [password, setPassword] = useState("")

  const canSubmit = name.trim() && email.trim() && password.trim()

  const handleCreate = () => {
    if (!canSubmit) return
    createStaff.mutate(
      { stationId, full_name: name, phone, email, gender, password },
      {
        onSuccess: () => {
          setOpen(false)
          setName(""); setPhone(""); setEmail(""); setPassword(""); setGender("MALE")
          onCreate()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="w-4 h-4" />
          Add staff member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add staff member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aman Kebede"
              />
              <FieldHint>As shown on their ID</FieldHint>
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 91 234 5678"
                type="tel"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Work email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aman@station.et"
              type="email"
            />
            <FieldHint>Used to log in to the attendant app</FieldHint>
          </div>

          <div className="space-y-1.5">
            <Label>Temporary password</Label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="Min. 8 characters"
            />
            <FieldHint>
              <ShieldCheck className="w-3 h-3 shrink-0" />
              They'll be prompted to change this on first login
            </FieldHint>
          </div>

          <div className="space-y-1.5">
            <Label>Gender</Label>
            <GenderPicker value={gender} onChange={setGender} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 gap-1.5"
              onClick={handleCreate}
              disabled={!canSubmit || createStaff.isPending}
            >
              <CheckCircle className="w-4 h-4" />
              {createStaff.isPending ? "Creating…" : "Create account"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── edit dialog ──────────────────────────────────────────────────────────────

function EditStaffDialog({
  staff,
  open,
  onOpenChange,
  onSave,
}: {
  staff: StationStaff | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (data: { id: string; full_name: string; phone: string; email: string; gender: "MALE" | "FEMALE" }) => void
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE")

  useEffect(() => {
    if (staff) {
      setName(staff.full_name)
      setPhone(staff.phone || "")
      setEmail(staff.email || "")
      setGender(staff.gender || "MALE")
    }
  }, [staff])

  const handleSave = () => {
    if (!staff || !name.trim()) return
    onSave({ id: staff.id, full_name: name, phone, email, gender })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit staff member
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Work email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            <FieldHint>Changing this updates their login email</FieldHint>
          </div>

          <div className="space-y-1.5">
            <Label>Gender</Label>
            <GenderPicker value={gender} onChange={setGender} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 gap-1.5" onClick={handleSave} disabled={!name.trim()}>
              <CheckCircle className="w-4 h-4" />
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

type FilterType = "ALL" | StaffStatus

export default function StationStaffPage() {
  const stationId = useSelector((state: RootState) => state.auth.user?.stationId)

  const { data: staff = [], isLoading, refetch } = useStationStaff(stationId || "")
  const updateStatus = useUpdateStaffStatus(stationId || "")

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("ALL")

  const [editOpen, setEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<StationStaff | null>(null)

  const updateStaff =
  useUpdateStaff(stationId ?? undefined)

  const toast = useToast()

  if (!stationId) {
    return (
      <div className="p-6 text-sm text-muted-foreground flex items-center gap-2">
        <Users className="w-4 h-4" />
        No station assigned to this user.
      </div>
    )
  }

  // ── derived ──────────────────────────────────────────────────────────────────

  const filtered = staff.filter((s: StationStaff) => {
    const matchFilter = filter === "ALL" || s.status === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      s.full_name.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.includes(q)
    return matchFilter && matchSearch
  })

  const countBy = (status: StaffStatus) =>
    staff.filter((s: StationStaff) => s.status === status).length

  // ── handlers ─────────────────────────────────────────────────────────────────

  const handleStatusChange = (id: string, status: StaffStatus) => {
    const labels: Record<StaffStatus, string> = {
      ACTIVE: "marked on duty",
      INACTIVE: "set to off shift",
      SUSPENDED: "suspended",
      BLOCKED:"blocked",
    }
    updateStatus.mutate(
      { stationId, userId: id, status },
      { onSuccess: () => toast.show(`Staff member ${labels[status]}`) }
    )
  }

  const openEdit = (s: StationStaff) => {
    setEditTarget(s)
    setEditOpen(true)
  }

  const handleEditSave = (data: {
    id: string
    full_name: string
    phone: string
    email: string
    gender: "MALE" | "FEMALE"
  }) => {
    // Wire this to your useUpdateStaffDetails hook when ready
    updateStaff.mutate({

      stationId,
      
      userId:data.id,
      
      full_name:data.full_name,
      
      phone:data.phone,
      
      email:data.email,
      
      gender:data.gender
      
      })
    console.log("UPDATE STAFF:", data)
    toast.show("Changes saved")
  }

  // ── render ───────────────────────────────────────────────────────────────────

  const FILTERS: { label: string; value: FilterType }[] = [
    { label: "All", value: "ALL" },
    { label: "On duty", value: "ACTIVE" },
    { label: "Off shift", value: "INACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
  ]

  return (
    <div className="space-y-5 max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-medium">Pump Attendant Staff</h1>
            <p className="text-xs text-muted-foreground">Manage attendants, roles, and shift status</p>
          </div>
        </div>
        <CreateStaffDialog stationId={stationId} onCreate={() => toast.show("Staff member created")} />
      </div>

      {/* STATS */}
      <div className="flex gap-3">
        <StatCard icon={Users} count={countBy("ACTIVE")} label="On duty" iconClass="text-teal-600" />
        <StatCard icon={Moon} count={countBy("INACTIVE")} label="Off shift" iconClass="text-gray-400" />
        <StatCard icon={Ban} count={countBy("SUSPENDED")} label="Suspended" iconClass="text-red-500" />
        <StatCard icon={Users} count={staff.length} label="Total staff" iconClass="text-blue-500" />
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9 h-9"
          placeholder="Search by name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER CHIPS */}
      <div className="flex gap-2">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1 rounded-full text-xs border transition-all ${
              filter === value
                ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                : "border-border text-muted-foreground hover:bg-muted/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Staff member
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  Loading staff…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Users className="w-8 h-8 text-border mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No staff members found</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s: StationStaff) => (
                <TableRow key={s.id} className="group">

                  {/* STAFF */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${avatarColor(s.id)}`}
                      >
                        {initials(s.full_name)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.full_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5" />
                          {s.phone || "—"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      {s.email || "—"}
                    </div>
                  </TableCell>

                  {/* ROLE */}
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {(s as any).role ?? "Pump Attendant"}
                    </span>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => openEdit(s)}
                        aria-label={`Edit ${s.full_name}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-44">
                          {s.status !== "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(s.id, "ACTIVE")}
                              className="gap-2"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                              Set on duty
                            </DropdownMenuItem>
                          )}
                          {s.status !== "INACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(s.id, "INACTIVE")}
                              className="gap-2"
                            >
                              <Moon className="w-3.5 h-3.5 text-gray-400" />
                              Set off shift
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {s.status !== "SUSPENDED" ? (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(s.id, "SUSPENDED")}
                              className="gap-2 text-red-600 focus:text-red-600"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(s.id, "ACTIVE")}
                              className="gap-2"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                              Reinstate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* EDIT DIALOG */}
      <EditStaffDialog
        staff={editTarget}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleEditSave}
      />

      {/* TOAST */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
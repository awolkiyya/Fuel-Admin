"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { AuthUser, UserStatus, Gender } from "@/types/user"

type User = {
  id?: string
  full_name: string
  email: string
  phone: string
  password?: string
  status: UserStatus
  role?: string
  gender: Gender
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: User) => void
  initialData?: AuthUser | null
  isLoading?: boolean

  roles?: { label: string; value: string }[]
  lockRole?: boolean
}

export const UserModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  roles = [{ label: "Station Manager", value: "station_manager" }],
  lockRole = false,
}: Props) => {
  const [form, setForm] = useState<User>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    status: "ACTIVE",
    role: roles[0]?.value,
    gender: "MALE",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  /* -----------------------------
     LOAD DATA
  ------------------------------ */
  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.fullName,
        email: initialData.email || "",
        phone: initialData.phoneNumber,
        status: initialData.status,
        role: initialData.role,
        gender: initialData.gender,
        password: "",
      })
    } else {
      setForm({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        status: "ACTIVE",
        role: roles[0]?.value,
        gender: "MALE",
      })
    }
  }, [initialData, roles])

  /* -----------------------------
     HANDLER
  ------------------------------ */
  const handleChange = (key: keyof User, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validate = () => {
    if (!form.full_name) return "Full name is required"
    if (!form.phone) return "Phone number is required"
    if (!form.email) return "Email is required"
    if (!initialData && !form.password)
      return "Password is required"
    if (!form.role) return "Role is required"
    if (!form.gender) return "Gender is required"
    return ""
  }

  const handleSubmit = () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }

    setError("")
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md space-y-4">

        <DialogHeader>
          <DialogTitle>
            {initialData ? "Update User" : "Create User"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* NAME */}
          <Field label="Full Name">
            <Input
              value={form.full_name}
              onChange={(e) =>
                handleChange("full_name", e.target.value)
              }
            />
          </Field>

          {/* PHONE */}
          <Field label="Phone Number">
            <Input
              type="tel"
              placeholder="+251..."
              value={form.phone}
              onChange={(e) =>
                handleChange("phone", e.target.value)
              }
            />
          </Field>

          {/* EMAIL */}
          <Field label="Email">
            <Input
              value={form.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
            />
          </Field>

          {/* PASSWORD */}
          {!initialData && (
            <Field label="Password">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-2.5"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </Field>
          )}

          {/* GENDER ✅ NEW */}
          <Field label="Gender">
            <select
              className="w-full h-10 border rounded-md px-3 text-sm"
              value={form.gender}
              onChange={(e) =>
                handleChange("gender", e.target.value)
              }
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>

          {/* ROLE */}
          <Field label="Role">
            <select
              className={`w-full h-10 border rounded-md px-3 text-sm ${
                lockRole ? "bg-muted cursor-not-allowed" : ""
              }`}
              value={form.role}
              disabled={lockRole}
              onChange={(e) =>
                handleChange("role", e.target.value)
              }
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          {/* STATUS */}
          <Field label="Status">
            <select
              className="w-full h-10 border rounded-md px-3 text-sm"
              value={form.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </Field>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : initialData
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* -----------------------------
   SMALL UI HELPER
------------------------------ */
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}
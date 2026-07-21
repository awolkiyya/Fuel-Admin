"use client"

import { useState } from "react"
import { UsersTable } from "@/components/tables/UsersTable"
import { DataTablePagination } from "@/components/tables/data-pagination"
import { useUsers, useUserActions } from "@/hooks/user/useUsers"
import { Button } from "@/components/ui/button"
import { UserModal } from "@/components/modals/UserModal"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthUser } from "@/types/user"
import { UserDetailSheet } from "@/components/sheets/UserDetailSheet"
import { ResetPasswordModal } from "@/components/modals/ResetPasswordModal"

export default function UsersPage() {

  const [openPasswordModal, setOpenPasswordModal] = useState(false)
  const [passwordUser, setPasswordUser] = useState<AuthUser | null>(null)

  const handleOpenPassword = (user: AuthUser) => {
    setPasswordUser(user)
    setOpenPasswordModal(true)
  }
  /* ================= STATE ================= */
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")

  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null)
  const [openDetail, setOpenDetail] = useState(false)

  /* ================= HOOKS ================= */
  const { data, isLoading,refetch } = useUsers({
    page,
    limit: pageSize,
    search,
    role,
    status,
  })

  const { createUser, updateUser, isLoading: isSubmitting } = useUserActions()

  /* ================= HANDLERS ================= */

  const handleAddUser = () => {
    setSelectedUser(null)
    setOpenModal(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setOpenModal(true)
  }

  const handleSubmitUser = async (payload: any) => {
    if (selectedUser) {
      updateUser.mutate(
        {
          id: selectedUser.id,
          data: payload,
        },
        {
          onSuccess: () =>{
            refetch()
            
            setOpenModal(false)
          }
        }
      )
    } else {
      createUser.mutate(payload, {
        onSuccess: () => {
          refetch()
          setOpenModal(false)
        },
      })
    }
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-4 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>

        <Button onClick={handleAddUser}>
          + Add Station Manager
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Manage system users. Only Station Managers can be created.
      </p>

      {/* FILTERS */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">

          {/* SEARCH */}
          <Input
            placeholder="Search by name or email..."
            className="w-full md:w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />

          {/* ROLE */}
          <Select
            value={role || "all"}
            onValueChange={(value) => {
              setRole(value === "all" ? "" : value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="station_manager">Station Manager</SelectItem>
              <SelectItem value="station_staff">Station Staff</SelectItem>
            </SelectContent>
          </Select>

          {/* STATUS */}
          <Select
            value={status || "all"}
            onValueChange={(value) => {
              setStatus(value === "all" ? "" : value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </Card>

      {/* TABLE */}
      <UsersTable
        data={data?.data || []}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onView={(user) => {
          setSelectedUser(user)
          setOpenDetail(true)
        }}
        onResetPassword={handleOpenPassword}   // 🔥 ADD THIS
      />

      {/* PAGINATION */}
      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={data?.meta?.total || 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* MODAL */}
      <UserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitUser}
        initialData={selectedUser}
        isLoading={isSubmitting}
        roles={[
          { label: "Station Manager", value: "station_manager" },
        ]}
        lockRole={true}
      />

      <UserDetailSheet
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        user={selectedUser}
      />

      <ResetPasswordModal
        open={openPasswordModal}
        user={passwordUser}
        onClose={() => {
          setOpenPasswordModal(false)
          setPasswordUser(null)
        } }
        onSubmit={function (userId: string, password: string): Promise<void> | void {
          throw new Error("Function not implemented.")
        } }      />
    </div>
  )
}
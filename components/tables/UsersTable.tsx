"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { AuthUser, UserStatus } from "@/types/user"
import { userService } from "@/services/user.service"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  MoreHorizontal,
  Pencil,
  Trash,
  Eye,
} from "lucide-react"

import { TableSkeleton } from "./TableSkeleton"
import { TableEmpty } from "./table-empty"
import { getInitials } from "@/utils/getInitials"

/* -----------------------------
   TYPES
------------------------------ */
type UsersTableProps = {
  data: AuthUser[]
  isLoading: boolean
  onEdit?: (user: AuthUser) => void
  onView?: (user: AuthUser) => void
  onResetPassword?: (user: AuthUser) => void   // 🔥 ADD THIS
}

/* -----------------------------
   HELPERS
------------------------------ */
const roleVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive"
    case "station_manager":
      return "default"
    case "station_staff":
      return "secondary"
    default:
      return "outline"
  }
}


const statusVariant = (status: UserStatus) => {
  return status === "ACTIVE" ? "default" : "destructive"
}

/* -----------------------------
   COMPONENT
------------------------------ */
export function UsersTable({
  data,
  isLoading,
  onEdit,
  onView,
  onResetPassword,
}: UsersTableProps) {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  /* -----------------------------
     DELETE MUTATION
  ------------------------------ */
  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setDeleteId(null)
    },
  })

  /* -----------------------------
     COLUMNS
  ------------------------------ */
  const columns: ColumnDef<AuthUser>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback>
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-medium">{user.fullName}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => row.original.phoneNumber || "—",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={roleVariant(row.original.role)}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "station",
      header: "Station",
      cell: ({ row }) =>
        row.original.station?.name || "—",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">

              {/* VIEW */}
              <DropdownMenuItem onClick={() => onView?.(user)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>

              {/* EDIT */}
              <DropdownMenuItem onClick={() => onEdit?.(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              {/* RESET PASSWORD 🔥 */}
              <DropdownMenuItem
                onClick={() => onResetPassword?.(user)}
              >
                🔐 Reset Password
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  /* -----------------------------
     LOADING
  ------------------------------ */
  if (isLoading) {
    return (
      <TableSkeleton
        rows={8}
        columnsConfig={[
          { width: "40px" },
          { width: "2fr", type: "avatar" },
          { width: "1fr" },
          { width: "120px", type: "badge" },
          { width: "120px", type: "badge" },
          { width: "1fr" },
          { width: "60px", type: "actions" },
        ]}
      />
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>

          {/* HEADER */}
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableEmpty
                colSpan={columns.length}
                title="No users found"
                description="Try adjusting your search or filters."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["users"],
                      })
                    }
                  >
                    Refresh
                  </Button>
                }
              />
            )}
          </TableBody>
        </Table>
      </div>

      {/* DELETE CONFIRMATION */}
      {/* <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() =>
                deleteId &&
                deleteMutation.mutate(deleteId)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  )
}
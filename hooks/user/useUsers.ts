import { userService, GetUsersParams } from "@/services/user.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/* =====================================================
   📋 GET USERS (LIST)
===================================================== */
export const useUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: [
      "users",
      params.page,
      params.limit,
      params.search,
      params.role,
      params.status,
    ],

    queryFn: () =>
      userService.getUsers({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        role: params.role || undefined,
        status: params.status || undefined,
      }),

    staleTime: 1000 * 30,
  })
}

/* =====================================================
   ➕ CREATE USER
===================================================== */
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.createUser,

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })

      toast.success(response.message)
    },
  })
}

/* =====================================================
   ✏️ UPDATE USER
===================================================== */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: any
    }) => userService.updateUser(id, data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user"] })

      toast.success(response.message)
    },
  })
}

/* =====================================================
   🔐 RESET USER PASSWORD
===================================================== */
export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: ({
      id,
      password,
    }: {
      id: string
      password: string
    }) => userService.resetUserPassword(id, password),

    onSuccess: (response) => {
      toast.success(response.message)
    },
  })
}

/* =====================================================
   🗑 DELETE USER
===================================================== */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.deleteUser,

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })

      toast.success(response.message)
    },
  })
}

/* =====================================================
   ⚡ COMBINED ACTIONS
===================================================== */
export const useUserActions = () => {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const resetUserPassword = useResetUserPassword()
  const deleteUser = useDeleteUser()

  return {
    createUser,
    updateUser,
    resetUserPassword,
    deleteUser,

    isLoading:
      createUser.isPending ||
      updateUser.isPending ||
      resetUserPassword.isPending ||
      deleteUser.isPending,
  }
}
import { userService, GetUsersParams } from "@/services/user.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

    // keepPreviousData: true,
    staleTime: 1000 * 30,
  })
}

/* =====================================================
   👤 GET SINGLE USER
===================================================== */
export const useUser = (id?: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUser(id!),
    enabled: !!id,
  })
}

/* =====================================================
   ➕ CREATE USER
===================================================== */
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

/* =====================================================
   ⚡ COMBINED ACTIONS (OPTIONAL BUT CLEAN UX)
===================================================== */
export const useUserActions = () => {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  return {
    createUser,
    updateUser,
    deleteUser,
    isLoading:
      createUser.isPending ||
      updateUser.isPending ||
      deleteUser.isPending,
  }
}
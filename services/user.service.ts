import { api } from "@/lib/api"
import { SingleResponse, PaginatedResponse } from "@/types/api"
import { AuthUser } from "@/types/user"

/* -----------------------------
   QUERY TYPES
------------------------------ */
export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

/* -----------------------------
   CREATE / UPDATE TYPES
------------------------------ */
export type CreateUserPayload = {
  fullName: string
  email: string
  password: string
  phoneNumber?: string
  role: "station_manager"
  status: "active" | "inactive"
  stationId?: string
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "password">>

/* -----------------------------
   RESET PASSWORD TYPE
------------------------------ */
export type ResetUserPasswordPayload = {
  password: string
}

/* -----------------------------
   USER SERVICE
------------------------------ */
export const userService = {
  /* -----------------------------
     GET USERS
  ------------------------------ */
  getUsers: async (
    params: GetUsersParams
  ): Promise<PaginatedResponse<AuthUser>> => {
    const res = await api.get<PaginatedResponse<AuthUser>>("/users", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        role: params.role || undefined,
        status: params.status || undefined,
      },
    })

    return res.data
  },

  /* -----------------------------
     GET SINGLE USER
  ------------------------------ */
  getUser: async (id: string): Promise<SingleResponse<AuthUser>> => {
    const res = await api.get<SingleResponse<AuthUser>>(`/users/${id}`)
    return res.data
  },

  /* -----------------------------
     CREATE USER
  ------------------------------ */
  createUser: async (
    data: CreateUserPayload
  ): Promise<SingleResponse<AuthUser>> => {
    const res = await api.post<SingleResponse<AuthUser>>("/users", data)
    return res.data
  },

  /* -----------------------------
     UPDATE USER
  ------------------------------ */
  updateUser: async (
    id: string,
    data: UpdateUserPayload
  ): Promise<SingleResponse<AuthUser>> => {
    const res = await api.put<SingleResponse<AuthUser>>(
      `/users/${id}`,
      data
    )

    return res.data
  },

  /* -----------------------------
     RESET USER PASSWORD
  ------------------------------ */
  resetUserPassword: async (
    id: string,
    password: string
  ): Promise<SingleResponse<null>> => {
    const res = await api.patch<SingleResponse<null>>(
      `/users/${id}/reset-password`,
      {
        password,
      }
    )

    return res.data
  },

  /* -----------------------------
     DELETE USER
  ------------------------------ */
  deleteUser: async (
    id: string
  ): Promise<SingleResponse<{ success: boolean }>> => {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },
}
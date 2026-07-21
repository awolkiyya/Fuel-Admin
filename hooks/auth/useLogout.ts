import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authService } from "@/services/auth.service"
import { useDispatch } from "react-redux"
import { logout } from "@/lib/slices/user.slice"
import { clearAuthToken } from "@/lib/api"
import { useRouter } from "next/navigation"

export const useLogout = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: () => {
      clearAuthToken()
      dispatch(logout())
      queryClient.clear()
      router.push("/")
    },
  })
}
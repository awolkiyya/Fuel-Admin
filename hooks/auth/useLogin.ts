import { useMutation } from "@tanstack/react-query"
import { authService } from "@/services/auth.service"
import { useDispatch } from "react-redux"
import { setAuth } from "@/lib/slices/user.slice"
import { setAuthToken } from "@/lib/api"
import type { LoginResponse } from "@/types/user"

export const useLogin = () => {
  const dispatch = useDispatch()

  return useMutation<LoginResponse, any, { email: string; password: string }>({
    mutationFn: authService.login,

    onSuccess: (res) => {
      // use accessToken (NOT generic token)
      setAuthToken(res.accessToken)

      dispatch(
        setAuth({
          user: res.user,
          token: res.accessToken,
        })
      )
    },
  })
}
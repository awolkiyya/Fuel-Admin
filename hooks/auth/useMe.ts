import { useQuery } from "@tanstack/react-query"
import { authService } from "@/services/auth.service"
import { useDispatch } from "react-redux"
import { setUser, logout } from "@/lib/slices/user.slice"
import { useEffect } from "react"

export const useMe = () => {
  const dispatch = useDispatch()

  const query = useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  useEffect(() => {
    if (query.data?.user) {
      dispatch(setUser(query.data.user))
    }
  }, [query.data, dispatch])

  useEffect(() => {
    if (query.isError) {
      dispatch(logout())
    }
  }, [query.isError, dispatch])

  return query
}
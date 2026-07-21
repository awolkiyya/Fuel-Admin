import { ApiError, ApiErrorResponse } from "@/types/api"
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios"


export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -----------------------------
   TOKEN HELPERS
------------------------------ */
const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem("token", token)
}

export const clearAuthToken = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
}

/* -----------------------------
   REQUEST INTERCEPTOR
------------------------------ */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* -----------------------------
   REFRESH STATE
------------------------------ */
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

/* -----------------------------
   RESPONSE INTERCEPTOR (AUTO REFRESH)
------------------------------ */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    const status = error.response?.status

    const formattedError: ApiError = {
      message:
        (error as AxiosError<ApiErrorResponse>)?.response?.data?.message ||
        error.message ||
        "Unexpected error",
      status: error.response?.status,
      data: error.response?.data,
    }

    /* -----------------------------
       AUTO REFRESH LOGIC
    ------------------------------ */
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // CALL REFRESH ENDPOINT
        const res = await api.post("/auth/refresh")

        const newAccessToken = res.data.accessToken

        setAuthToken(newAccessToken)

        api.defaults.headers.common.Authorization =
          `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        clearAuthToken()
        window.location.href = "/"

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(formattedError)
  }
)
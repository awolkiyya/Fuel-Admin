import { api, setAuthToken, clearAuthToken } from "@/lib/api"
import { SingleResponse } from "@/types/api";
import { LoginResponse } from "@/types/user"

export const authService = {
  /* -----------------------------
     LOGIN
  ------------------------------ */
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<SingleResponse<LoginResponse>>(
      "/auth/login",
      data
    );
  
    const responseData = res.data?.data;
  
    if (!responseData?.accessToken) {
      throw new Error("Access token missing in response");
    }
  
    const { accessToken } = responseData;
  
    // store token (interceptor will use it automatically)
    setAuthToken(accessToken);
  
    return responseData;
  },
  /* -----------------------------
     CURRENT USER
  ------------------------------ */
  me: async () => {
    const res = await api.get<SingleResponse<LoginResponse>>("/auth/me");
  
    return res.data.data;
  },

  /* -----------------------------
     LOGOUT
  ------------------------------ */
  logout: async () => {
    try {
      await api.post("/auth/logout")
    } catch (e) {
      // ignore API failure (network/server)
    }

    clearAuthToken()

    return {
      success: true,
      message: "Logged out successfully",
    }
  },
}
import { api } from "@/lib/api"

/* ---------------------------------------
   TYPES
----------------------------------------*/
export type FuelType = "petrol" | "diesel" | "kerosene"

/* ---------------------------------------
   SYSTEM SETTINGS (FINAL MODEL)
----------------------------------------*/
export type SystemSettings = {
  // ==============================
  // 🚦 TRAFFIC GLOBAL MAX LIMITS
  // ==============================
  maxTrafficLow: number
  maxTrafficMedium: number
  maxTrafficHigh: number
  maxTrafficCritical: number

  // ==============================
  // 🤖 AI CONTROL
  // ==============================
  aiEnabled: boolean
  aiMinConfidence: number
  aiRefreshSeconds: number

  // ==============================
  // 🚨 OPERATIONAL SAFETY
  // ==============================
  autoRiskDetection: boolean
  maxQueueCapacityGlobal: number
  maxRequestDistanceKm: number

  // ==============================
  // 📹 INFRASTRUCTURE CONTROL
  // ==============================
  maxActiveCamerasPerStation: number

  // ==============================
  // ⚙️ SYSTEM CONTROL
  // ==============================
  systemActive: boolean

  priceControlMode: "FIXED" | "OVERRIDE";
}

/* ---------------------------------------
   SERVICE
----------------------------------------*/
export const settingsService = {
  async getSettings(): Promise<SystemSettings> {
    const res = await api.get("/system/system-settings")
    return res.data
  },

  async updateSettings(
    data: Partial<SystemSettings>
  ): Promise<SystemSettings> {
    const res = await api.patch("/system/system-settings", data)
    return res.data
  },

  async resetSettings(): Promise<SystemSettings> {
    const res = await api.post("/system/system-settings/reset")
    return res.data
  },
}
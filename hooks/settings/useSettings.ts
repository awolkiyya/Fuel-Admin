"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "sonner"

import {
  settingsService,
  SystemSettings,
} from "@/services/settings.service"

/* ---------------------------------------
   GET SETTINGS
----------------------------------------*/
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ["system-settings"],
    queryFn: settingsService.getSettings,
    staleTime: 1000 * 60 * 5,
  })
}

/* ---------------------------------------
   UPDATE SETTINGS
----------------------------------------*/
export const useUpdateSystemSettings = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<SystemSettings>) =>
      settingsService.updateSettings(data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["system-settings"] })

      toast.success("System settings updated successfully")
    }
  })
}

/* ---------------------------------------
   RESET SETTINGS
----------------------------------------*/
export const useResetSystemSettings = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: settingsService.resetSettings,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["system-settings"] })

      toast.success("System settings reset successfully")
    }
  })
}
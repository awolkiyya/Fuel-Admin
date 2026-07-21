import {
    createStaff,
    getStationStaff,
    updateStaffStatus,
  } from "@/services/staff.service"
  
  import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query"
  
  // -----------------------------
  export const staffKeys = {
    all: ["staff"] as const,
    byStation: (stationId: string) =>
      [...staffKeys.all, "station", stationId] as const,
  }
  
  // -----------------------------
  export const useStationStaff = (stationId?: string) => {
    return useQuery({
      queryKey: staffKeys.byStation(stationId ?? ""),
      queryFn: () => getStationStaff(stationId!),
      enabled: !!stationId,
      staleTime: 1000 * 60 * 2,
    })
  }
  
  // -----------------------------
  export const useCreateStaff = (stationId?: string) => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: createStaff,
  
      onSuccess: () => {
        if (!stationId) return
  
        queryClient.invalidateQueries({
          queryKey: staffKeys.byStation(stationId),
        })
      },
    })
  }
  
  // -----------------------------
  export const useUpdateStaffStatus = (stationId?: string) => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: updateStaffStatus,
  
      onMutate: async (variables) => {
        if (!stationId) return
  
        await queryClient.cancelQueries({
          queryKey: staffKeys.byStation(stationId),
        })
  
        const previous = queryClient.getQueryData(
          staffKeys.byStation(stationId)
        ) as any[] | undefined
  
        queryClient.setQueryData(
          staffKeys.byStation(stationId),
          (old: any[] = []) =>
            old.map((u) =>
              u.id === variables.userId
                ? { ...u, status: variables.status }
                : u
            )
        )
  
        return { previous }
      },
  
      onError: (_err, _vars, context) => {
        if (!stationId) return
  
        if (context?.previous) {
          queryClient.setQueryData(
            staffKeys.byStation(stationId),
            context.previous
          )
        }
      },
  
      onSettled: () => {
        if (!stationId) return
  
        queryClient.invalidateQueries({
          queryKey: staffKeys.byStation(stationId),
        })
      },
    })
  }
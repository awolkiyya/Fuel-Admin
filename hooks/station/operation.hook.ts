import { stationOperatorService } from "@/services/operation.service"
import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query"
  
  import { toast } from "sonner"
  
  
  /* ---------------------------------
     GET FUEL REQUESTS (QUEUE LIST)
  ---------------------------------- */
  export const useFuelRequests = (params: {
    page?: number
    limit?: number
    search?: string
    vehicleType?: string
    fuelType?: string
    status?: string
  }) => {
    return useQuery({
      queryKey: ["fuel-requests", params],
      queryFn: () => stationOperatorService.getFuelRequests(params),
    })
  }
  
  /* ---------------------------------
     GET SINGLE FUEL REQUEST
  ---------------------------------- */
  export const useFuelRequest = (id: string) => {
    return useQuery({
      queryKey: ["fuel-request", id],
      queryFn: () => stationOperatorService.getFuelRequest(id),
      enabled: !!id,
    })
  }

  /* ---------------------------------
   GET CURRENT ACTIVE FUEL REQUEST
  ---------------------------------- */
  export const useCurrentFuelRequest = () => {
    return useQuery({
      queryKey: ["current-fuel-request"],
      queryFn: () => stationOperatorService.getCurrentFuelRequest(),

      // Optional: keep the current request fresh
      refetchOnWindowFocus: true,
      staleTime: 1000 * 30, // 30 seconds
    });
  };
  
  export const useVerifyFuelRequest = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: string) =>
        stationOperatorService.verifyFuelRequest(id),
  
      onSuccess: () => {
        toast.success("Fuel request verified successfully");
  
        // refresh list
        queryClient.invalidateQueries({
          queryKey: ["fuel-requests"],
        });
      },
    });
  };
  


  export const useRejectFuelRequest = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        id,
        rejectionReasonId,
        rejectionNote,
      }: {
        id: string;
        rejectionReasonId: string;
        rejectionNote?: string;
      }) =>
        stationOperatorService.rejectFuelRequest(id, {
          rejectionReasonId,
          rejectionNote,
        }),
  
      onSuccess: () => {
        toast.success("Fuel request rejected");
  
        queryClient.invalidateQueries({
          queryKey: ["fuel-requests"],
        });
      },
  
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to reject request"
        );
      },
    });
  };


  /* ---------------------------------
   APPROVE REQUEST
---------------------------------- */
export const useApproveFuelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      approvedLiters,
      nozzleId,
    }: {
      id: string;
      approvedLiters: number;
      nozzleId: string;
    }) =>
      stationOperatorService.approveFuelRequest(id, {
        approvedLiters,
        nozzleId,
      }),

    onSuccess: () => {
      toast.success("Fuel request approved successfully");

      queryClient.invalidateQueries({
        queryKey: ["fuel-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fuel-request"],
      });

      queryClient.invalidateQueries({
        queryKey: ["current-fuel-request"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to approve fuel request"
      );
    },
  });
};



/* ---------------------------------
   CANCEL REQUEST
---------------------------------- */
export const useCancelFuelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      stationOperatorService.cancelFuelRequest(id),

    onSuccess: () => {
      toast.success("Fuel request cancelled successfully");

      queryClient.invalidateQueries({
        queryKey: ["fuel-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fuel-request"],
      });

      queryClient.invalidateQueries({
        queryKey: ["current-fuel-request"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel fuel request"
      );
    },
  });
};


/* ---------------------------------
   START DISPENSING FUEL REQUEST
---------------------------------- */
export const useStartDispensingFuelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      stationOperatorService.startDispensingFuelRequest(id),

    onSuccess: () => {
      toast.success("Fuel dispensing started");

      queryClient.invalidateQueries({
        queryKey: ["fuel-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fuel-request"],
      });

      queryClient.invalidateQueries({
        queryKey: ["current-fuel-request"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to start dispensing fuel"
      );
    },
  });
};

/* ---------------------------------
   COMPLETE DISPENSING FUEL REQUEST
---------------------------------- */
export const useCompleteDispensingFuelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dispensedLiters,
    }: {
      id: string;
      dispensedLiters: number;
    }) =>
      stationOperatorService.completeDispensingFuelRequest(id, {
        dispensedLiters,
      }),

    onSuccess: () => {
      toast.success("Fuel dispensing completed successfully");

      queryClient.invalidateQueries({
        queryKey: ["fuel-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fuel-request"],
      });

      queryClient.invalidateQueries({
        queryKey: ["current-fuel-request"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to complete fuel dispensing"
      );
    },
  });
};
import {
    useQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import { toast } from "sonner";
  
  import { cameraService } from "@/services/camera.service";
  import { AiCameraResponse, CameraForm, CameraStatus } from "@/types/camera";
import { PaginatedResponse, SingleResponse } from "@/types/api";
  
 /* =========================================================
   GET CAMERAS (AI + Station aware)
========================================================= */

export const useCameras = (params?: {
  page?: number;
  search?: string;
  status?: CameraStatus;
  stationId?: string;
  aiEnabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["cameras", params],
    queryFn: () => cameraService.getCameras(params),
  });
};

  /* =========================================================
     GET AI CAMERAS ONLY (STATION + FILTERED)
  ========================================================= */
  export const useAiCameras = (params?: {
    page?: number;
    search?: string;
    status?: CameraStatus;
    stationId?: string;
  }) => {
    return useQuery<SingleResponse<AiCameraResponse>>({
      queryKey: ["ai-cameras", params],
      queryFn: () => cameraService.getAiCameras(params),
      staleTime: 1000 * 30, // 30s cache for smoother UI
    });
  };
  
  /* =========================================================
     CREATE CAMERA
  ========================================================= */
  export const useCreateCamera = () => {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: (data: CameraForm) =>
        cameraService.createCamera(data),
  
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["cameras"] });
  
        toast.success("Camera created successfully 🎥");
      },
  
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to create camera"
        );
      },
    });
  };
  
  /* =========================================================
     UPDATE CAMERA
  ========================================================= */
  export const useUpdateCamera = () => {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: Partial<CameraForm>;
      }) => cameraService.updateCamera(id, data),
  
      onSuccess: (_, variables) => {
        qc.invalidateQueries({ queryKey: ["cameras"] });
        qc.invalidateQueries({
          queryKey: ["camera", variables.id],
        });
  
        toast.success("Camera updated successfully ✨");
      },
  
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to update camera"
        );
      },
    });
  };
  
  /* =========================================================
     TOGGLE STATUS (ONLINE / OFFLINE / MAINTENANCE)
  ========================================================= */
  export const useToggleCameraStatus = () => {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        id,
        status,
      }: {
        id: string;
        status: CameraStatus;
      }) => cameraService.toggleStatus(id, status),
  
      onSuccess: (_, variables) => {
        qc.invalidateQueries({ queryKey: ["cameras"] });
        qc.invalidateQueries({
          queryKey: ["camera", variables.id],
        });
  
        toast.success("Camera status updated 🔄");
      },
  
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to update status"
        );
      },
    });
  };
  
  /* =========================================================
     TOGGLE AI
  ========================================================= */
  export const useToggleCameraAI = () => {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        id,
        aiEnabled,
      }: {
        id: string;
        aiEnabled: boolean;
      }) => cameraService.toggleAI(id, aiEnabled),
  
      onSuccess: (_, variables) => {
        qc.invalidateQueries({ queryKey: ["cameras"] });
        qc.invalidateQueries({
          queryKey: ["camera", variables.id],
        });
  
        toast.success(
          variables.aiEnabled
            ? "AI enabled successfully 🤖"
            : "AI disabled successfully"
        );
      },
  
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to update AI setting"
        );
      },
    });
  };
  
  /* =========================================================
     TEST CAMERA STREAM
  ========================================================= */
  export const useTestCamera = () => {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: (id: string) =>
        cameraService.testCamera(id),
  
      onSuccess: (_, id) => {
        qc.invalidateQueries({ queryKey: ["cameras"] });
  
        toast.success("Camera test completed 🎯");
      },
  
      onError: (error: any) => {
        toast.error(
          error?.message || "Camera test failed"
        );
      },
    });
  };

  export const useUpdateQueueZone = () => {
    const qc = useQueryClient()
  
    return useMutation({
      mutationFn: ({
        stationId,
        queueZone,
      }: {
        stationId: string
        queueZone: {
          x: number
          y: number
          width: number
          height: number
        }
      }) => cameraService.updateQueueZone(stationId, queueZone),
  
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["station-ai-cameras"] })
        toast.success("Queue zone saved successfully")
      },
  
      onError: (err: any) => {
        toast.error(err?.message || "Failed to save queue zone")
      },
    })
  }
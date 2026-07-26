import { api } from "@/lib/api";
import { PaginatedResponse, SingleResponse } from "@/types/api";
import { formatApiError } from "@/utils/apiError";
import { AiCameraResponse, Camera, CameraForm, CameraStatus } from "@/types/camera";
import { QueueZone } from "@/types/station";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* ---------------------------------------
   CAMERA SERVICE
----------------------------------------*/
export const cameraService = {
 /* GET ALL CAMERAS */
async getCameras(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: CameraStatus;
  stationId?: string;
  aiEnabled?: boolean;
}) {
  try {
    const res = await api.get<PaginatedResponse<Camera>>(
      "/cameras",
      { params }
    );

    return res.data;
  } catch (error) {
    throw formatApiError(error);
  }
},

  /* CREATE */
  async createCamera(data: CameraForm) {
    try {
      const res = await api.post<ApiResponse<Camera>>(
        "/cameras",
        data
      );

      return res.data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  /* UPDATE */
  async updateCamera(id: string, data: Partial<CameraForm>) {
    try {
      const res = await api.post<ApiResponse<Camera>>(
        `/cameras/${id}`,
        data
      );

      return res.data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  /* TOGGLE STATUS */
  async toggleStatus(id: string, status: CameraStatus) {
    try {
      const res = await api.patch<ApiResponse<Camera>>(
        `/cameras/${id}/status`,
        { status }
      );

      return res.data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  /* TOGGLE AI */
  async toggleAI(id: string, aiEnabled: boolean) {
    try {
      const res = await api.patch<ApiResponse<Camera>>(
        `/cameras/${id}/ai`,
        { aiEnabled }
      );

      return res.data.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

  /* TEST STREAM */
  async testCamera(id: string) {
    try {
      const res = await api.post(
        `/cameras/${id}/test`
      );

      return res.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

    /* ---------------------------------------
     GET AI CAMERAS ONLY
  ----------------------------------------*/
  async getAiCameras(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: CameraStatus;
    stationId?: string;
  }):Promise<SingleResponse<AiCameraResponse>> {
    try {
      const res = await api.get<SingleResponse<AiCameraResponse>>(
        `/cameras/${params?.stationId}/ai`
      );

      return res.data;
    } catch (error) {
      throw formatApiError(error);
    }
  },

   /* UPDATE QUEUE ZONE */
   async updateQueueZone(stationId: string, queueZone: QueueZone) {
    try {
      const res = await api.patch<ApiResponse<any>>(
        `/cameras/${stationId}/queue-zone`,
        {
          queueZone,
        }
      )

      return res.data.data
    } catch (error) {
      throw formatApiError(error)
    }
  },
};
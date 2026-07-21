import { QueueZone } from "./station";

/* ================= ENUMS ================= */
export type CameraStatus = "online" | "offline" | "testing";

export type CameraType = "rtsp" | "http" | "webrtc";

/* ================= BASE MODEL (API RESPONSE) ================= */
export interface Camera {
  id: string;

  stationId: string;
  stationName?: string;

  name: string;

  streamUrl: string;
  type: CameraType;

  username?: string;
  password?: string;

  ipAddress?: string;
  port?: number;

  location?: string;
  latitude?: number;
  longitude?: number;

  status: CameraStatus;
  lastSeenAt?: string;
  lastCheckedAt?: string;

  resolution?: string;
  fps?: number;
  codec?: string;

  aiEnabled: boolean;
  isActive: boolean;

  metadata?: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;
}

/* ================= FORM DTO (UI USE) ================= */
export interface CameraForm {
  id?: string;

  name: string;
  stationId: string;

  streamUrl: string;

  type?: CameraType;

  username?: string;
  password?: string;

  ipAddress?: string;
  port?: number;

  location?: string;

  latitude?: number;
  longitude?: number;

  resolution?: string;
  fps?: number;
  codec?: string;

  aiEnabled?: boolean;
  isActive?: boolean;
}

export type AiCameraResponse = {
  queueZone: QueueZone | null
  cameras: Camera[]
}
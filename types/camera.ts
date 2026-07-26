/* ================= ENUMS ================= */

export type CameraStatus =
  | "ONLINE"
  | "OFFLINE"
  | "ERROR"
  | "DISCONNECTED";


export type CameraProtocol =
  | "RTSP"
  | "HTTP"
  | "HTTPS"
  | "WEBRTC";


export type CameraAuthType =
  | "NONE"
  | "BASIC"
  | "DIGEST"
  | "TOKEN";



/* ================= AI TYPES ================= */

export interface QueueZone {

  x: number;

  y: number;

  width: number;

  height: number;

}


export interface CameraThresholds {

  personConfidence?:number;

  faceConfidence?:number;

  vehicleConfidence?:number;

}



/* ================= BASE MODEL (API RESPONSE) ================= */

export interface Camera {

  id:string;


  // ================= RELATION =================

  stationId:string;

  stationName?:string;



  // ================= BASIC =================

  name:string;



  // ================= CONNECTION =================

  protocol:CameraProtocol;

  host:string;

  port:number;

  // Prisma field
  path:string;



  // ================= AUTH =================

  authType:CameraAuthType;

  username?:string;


  /**
   * Usually not returned.
   * Only for admin debugging if needed.
   */
  passwordEncrypted?:string;



  // ================= LOCATION =================

  location?:string;

  latitude?:number;

  longitude?:number;



  // ================= STATUS =================

  status:CameraStatus;

  lastSeenAt?:string;

  lastCheckedAt?:string;



  // ================= STREAM INFO =================

  resolution?:string;

  fps?:number;

  codec?:string;



  // ================= AI =================

  aiEnabled:boolean;


  queueZone?:QueueZone | null;


  thresholds?:CameraThresholds | null;



  // ================= CONTROL =================

  isActive:boolean;



  // ================= EXTRA =================

  metadata?:Record<string,unknown>;



  createdAt:string;

  updatedAt:string;

}



/* ================= FORM DTO (UI USE) ================= */

export interface CameraForm {


  id?:string;



  // ================= BASIC =================

  name:string;

  stationId:string;



  // ================= CONNECTION =================

  protocol:CameraProtocol;

  host:string;

  port?:number;


  /**
   * UI field mapped to backend path
   */
  streamPath:string;



  // ================= AUTH =================

  authType?:CameraAuthType;

  username?:string;

  password?:string;



  // ================= LOCATION =================

  location?:string;

  latitude?:number;

  longitude?:number;



  // ================= STREAM INFO =================

  resolution?:string;

  fps?:number;

  codec?:string;



  // ================= AI =================

  aiEnabled?:boolean;


  queueZone?:QueueZone;


  thresholds?:CameraThresholds;



  // ================= CONTROL =================

  isActive?:boolean;


}



/* ================= AI CAMERA RESPONSE ================= */

export interface AiCameraResponse {

  queueZone:QueueZone | null;

  cameras:Camera[];

}
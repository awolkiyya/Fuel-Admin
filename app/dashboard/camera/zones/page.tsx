"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Move,
  Save,
  AlertTriangle,
  PlayCircle,
  RefreshCcw,
  Wifi,
  WifiOff,
} from "lucide-react";

import { Rnd } from "react-rnd";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAiCameras, useUpdateQueueZone } from "@/hooks/station/useCameras";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import { Camera as CameraType } from "@/types/camera";

/* =============================================================
   TYPES
   ============================================================= */

type Zone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const DEFAULT_ZONE: Zone = { x: 120, y: 100, width: 260, height: 180 };

/* =============================================================
   PAGE
   Color language matches CameraCard: theme tokens for neutrals,
   emerald for "live/online", destructive for errors. The ROI
   selection box uses a separate sky accent so it never reads as
   an alert — it's a tool, not a status.
   ============================================================= */

export default function QueueZonePage() {
  const stationId = useSelector(
    (state: RootState) => state.auth.user?.stationId
  ) ?? undefined;

  const [cameraId, setCameraId] = useState("");
  const [drawMode, setDrawMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(true);
  const [zone, setZone] = useState<Zone>(DEFAULT_ZONE);

  /* ---------- load AI cameras ---------- */

  const { data, isLoading, isError, refetch } = useAiCameras({ stationId });

  const cameras: CameraType[] = data?.data?.cameras ?? [];
  const queueZone = data?.data?.queueZone ?? null;

  /* ---------- load saved ROI ---------- */

  useEffect(() => {
    if (!queueZone) return;

    setZone({
      x: Math.round(queueZone.x ?? DEFAULT_ZONE.x),
      y: Math.round(queueZone.y ?? DEFAULT_ZONE.y),
      width: Math.round(queueZone.width ?? DEFAULT_ZONE.width),
      height: Math.round(queueZone.height ?? DEFAULT_ZONE.height),
    });
  }, [queueZone]);

  /* ---------- default camera selection ---------- */

  useEffect(() => {
    if (cameras.length && !cameraId) {
      setCameraId(cameras[0].id);
    }
  }, [cameras, cameraId]);

  const selectedCamera = useMemo(
    () => cameras.find((camera) => camera.id === cameraId),
    [cameras, cameraId]
  );

  /* ---------- stream url ----------
     Routed through the backend proxy rather than built from
     protocol/host/port/path directly. The proxy holds the
     camera's username/password and opens the authenticated
     connection server-side, so no credentials ever reach the
     browser (DOM, network tab, history). Update the path below
     to match your actual proxy route if it differs. */

  const streamUrl = useMemo(() => {
    if (!selectedCamera) return null;

    return `/api/cameras/${selectedCamera.id}/stream`;
  }, [selectedCamera]);

  // Normalize case since the API is inconsistent about it (e.g. "offline" vs "OFFLINE"),
  // and check equality to OFFLINE directly rather than negating ONLINE.
  const cameraOffline = selectedCamera?.status?.toUpperCase() === "OFFLINE";

  useEffect(() => {
    setStreamLoading(true);
    setError(null);
  }, [streamUrl]);

  /* ---------- save ROI ---------- */

  const updateQueueZone = useUpdateQueueZone();

  const handleSave = async () => {
    if (!selectedCamera?.stationId) return;

    try {
      await updateQueueZone.mutateAsync({
        stationId: selectedCamera.stationId,
        queueZone: {
          x: Math.round(zone.x),
          y: Math.round(zone.y),
          width: Math.round(zone.width),
          height: Math.round(zone.height),
        },
      });
    } catch {
      // handled by mutation hook
    }
  };

  /* =============================================================
     LOADING / ERROR / EMPTY STATES
     ============================================================= */

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-6 w-64 animate-pulse rounded bg-muted" />
        <div className="h-[500px] animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="flex items-center gap-3 border-border p-6 text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>Failed to load AI cameras</span>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="mr-1 h-4 w-4" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!cameras.length) {
    return (
      <div className="p-6">
        <Card className="space-y-2 border-border p-10 text-center">
          <Camera className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">No AI Cameras Found</h2>
          <p className="text-sm text-muted-foreground">
            Enable AI on cameras first.
          </p>
        </Card>
      </div>
    );
  }

  /* =============================================================
     MAIN VIEW
     ============================================================= */

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-6">
      {/* ============= HEADER ============= */}
      <div className="flex items-center gap-3">
        <Camera className="h-6 w-6 text-foreground" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            AI Queue Zone Setup
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure queue detection area
          </p>
        </div>
      </div>

      <Separator />

      {/* ============= CAMERA SELECT ============= */}
      <div className="max-w-sm space-y-2">
        <Label>AI Camera</Label>
        <Select value={cameraId} onValueChange={setCameraId}>
          <SelectTrigger>
            <SelectValue placeholder="Select camera" />
          </SelectTrigger>
          <SelectContent>
            {cameras.map((cam) => (
              <SelectItem key={cam.id} value={cam.id}>
                {cam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ============= STATUS ROW ============= */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={drawMode ? "default" : "secondary"}
          onClick={() => setDrawMode((v) => !v)}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          {drawMode ? "Drawing ON" : "Drawing OFF"}
        </Button>

        <Badge variant="secondary">AI Enabled</Badge>

        <Badge
          className={
            cameraOffline
              ? "bg-destructive/10 text-destructive hover:bg-destructive/10"
              : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
          }
          variant="outline"
        >
          {cameraOffline ? (
            <>
              <WifiOff className="mr-1 h-3 w-3" />
              Offline
            </>
          ) : (
            <>
              <Wifi className="mr-1 h-3 w-3" />
              Online
            </>
          )}
        </Badge>
      </div>

      {/* ============= CAMERA VIEW ============= */}
      <Card className="relative h-[520px] w-full overflow-hidden border-border">
        {streamUrl && !cameraOffline && (
          <img
            src={streamUrl}
            alt={selectedCamera?.name ?? "camera"}
            className="absolute inset-0 h-full w-full bg-black object-cover"
            onLoad={() => setStreamLoading(false)}
            onError={() => {
              setStreamLoading(false);
              setError("Cannot load stream");
            }}
          />
        )}

        {cameraOffline && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black text-white">
            <WifiOff className="h-8 w-8 text-destructive" />
            Camera Offline
          </div>
        )}

        {streamLoading && !cameraOffline && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
            Loading stream...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {error}
          </div>
        )}

        {drawMode && !cameraOffline && (
          <Rnd
            size={{ width: zone.width, height: zone.height }}
            position={{ x: zone.x, y: zone.y }}
            bounds="parent"
            onDragStop={(e, d) =>
              setZone((prev) => ({ ...prev, x: d.x, y: d.y }))
            }
            onResizeStop={(e, direction, ref, delta, position) => {
              setZone({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y,
              });
            }}
            className="border-2 border-sky-500 bg-sky-500/10"
          >
            <div className="flex items-center gap-1 bg-background/90 px-1 text-xs text-sky-600 dark:text-sky-400">
              <Move className="h-3 w-3" />
              Queue ROI
            </div>
          </Rnd>
        )}
      </Card>

      {/* ============= SAVE ============= */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="secondary">Station AI</Badge>
          <Badge variant="secondary">Queue Detection</Badge>
        </div>

        <Button
          onClick={handleSave}
          disabled={updateQueueZone.isPending || cameraOffline}
          title={cameraOffline ? "Camera is offline — reconnect before saving a zone" : undefined}
        >
          <Save className="mr-2 h-4 w-4" />
          {updateQueueZone.isPending ? "Saving…" : "Save Zone"}
        </Button>
      </div>
    </div>
  );
}
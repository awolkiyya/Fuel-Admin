"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Camera,
  Move,
  Save,
  AlertTriangle,
  PlayCircle,
  RefreshCcw,
} from "lucide-react"
import { Rnd } from "react-rnd"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useAiCameras, useUpdateQueueZone } from "@/hooks/station/useCameras"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

/* =========================
   TYPES
========================= */
type Zone = {
  x: number
  y: number
  width: number
  height: number
}

export default function QueueZonePage() {
  const stationId =
    useSelector((state: RootState) => state.auth.user?.stationId) ?? undefined

  const [cameraId, setCameraId] = useState("")
  const [drawMode, setDrawMode] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [streamLoading, setStreamLoading] = useState(true)

  const [zone, setZone] = useState<Zone>({
    x: 120,
    y: 100,
    width: 260,
    height: 180,
  })

  /* =========================================================
     LOAD AI CAMERAS + STATION SETTINGS
  ========================================================= */
  const { data, isLoading, isError, refetch } = useAiCameras({
    stationId,
  })

  const cameras = data?.data?.cameras ?? []
  const queueZone = data?.data?.queueZone ?? null

  /* =========================================================
     HYDRATE SAVED ZONE (ONCE PER CHANGE)
  ========================================================= */
  useEffect(() => {
    if (!queueZone) return

    setZone({
      x: Math.round(queueZone.x ?? 120),
      y: Math.round(queueZone.y ?? 100),
      width: Math.round(queueZone.width ?? 260),
      height: Math.round(queueZone.height ?? 180),
    })
  }, [queueZone])

  /* =========================================================
     SELECT CAMERA
  ========================================================= */
  const selectedCamera = useMemo(
    () => cameras.find((c: any) => c.id === cameraId),
    [cameraId, cameras]
  )

  const streamUrl = selectedCamera?.streamUrl

  useEffect(() => {
    if (cameras.length && !cameraId) {
      setCameraId(cameras[0].id)
    }
  }, [cameras, cameraId])

  useEffect(() => {
    setStreamLoading(true)
    setError(null)
  }, [streamUrl])

  /* =========================================================
     SAVE MUTATION
  ========================================================= */
  const updateQueueZone = useUpdateQueueZone()

  const handleSave = async () => {
    if (!selectedCamera?.stationId) return

    try {
      await updateQueueZone.mutateAsync({
        stationId: selectedCamera.stationId,
        queueZone: {
          x: Math.round(zone.x),
          y: Math.round(zone.y),
          width: Math.round(zone.width),
          height: Math.round(zone.height),
        },
      })
    } catch {
      // toast handled in hook
    }
  }

  /* =========================================================
     STATES
  ========================================================= */
  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="h-6 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        <div className="h-[500px] bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card className="p-6 flex items-center gap-3 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          Failed to load AI cameras
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 mr-1" />
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  if (!cameras.length) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card className="p-10 text-center space-y-2 border-dashed">
          <Camera className="mx-auto w-10 h-10 text-muted-foreground" />
          <h2 className="font-semibold">No AI Cameras Found</h2>
          <p className="text-sm text-muted-foreground">
            Enable AI on cameras to configure queue zones.
          </p>
        </Card>
      </div>
    )
  }

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5" />
        <div>
          <h1 className="text-xl font-semibold">AI Queue Zone Setup</h1>
          <p className="text-sm text-muted-foreground">
            Configure detection area for AI-enabled station cameras
          </p>
        </div>
      </div>

      <Separator />

      {/* CAMERA SELECT */}
      <div className="max-w-sm space-y-1">
        <Label>AI Cameras</Label>

        <Select value={cameraId} onValueChange={setCameraId}>
          <SelectTrigger>
            <SelectValue placeholder="Select AI camera" />
          </SelectTrigger>

          <SelectContent>
            {cameras.map((cam: any) => (
              <SelectItem key={cam.id} value={cam.id}>
                {cam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* MODE */}
      <div className="flex items-center gap-2">
        <Button
          variant={drawMode ? "default" : "secondary"}
          onClick={() => setDrawMode((p) => !p)}
          className="gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          {drawMode ? "Drawing ON" : "Enable Draw"}
        </Button>

        <Badge variant="outline">AI Camera</Badge>
        <Badge variant="secondary">ROI Active</Badge>
      </div>

      {/* CAMERA VIEW */}
      <Card className="relative w-full h-[520px] overflow-hidden border">

        {streamUrl && (
          <img
            src={streamUrl}
            alt="camera stream"
            className="absolute inset-0 w-full h-full object-cover bg-black"
            onLoad={() => setStreamLoading(false)}
            onError={() => {
              setStreamLoading(false)
              setError("Unable to load camera stream")
            }}
          />
        )}

        {streamLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm">
            Loading camera stream...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-sm gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            {error}
          </div>
        )}

        {!error && drawMode && (
          <Rnd
            size={{ width: zone.width, height: zone.height }}
            position={{ x: zone.x, y: zone.y }}
            bounds="parent"
            onDragStop={(e, d) =>
              setZone((p) => ({ ...p, x: d.x, y: d.y }))
            }
            onResizeStop={(e, dir, ref, delta, pos) => {
              setZone({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: pos.x,
                y: pos.y,
              })
            }}
            className="border-2 border-red-500 bg-red-500/10"
          >
            <div className="text-[11px] bg-white/80 px-1 py-0.5 flex items-center gap-1 text-red-600">
              <Move className="w-3 h-3" />
              Queue ROI
            </div>
          </Rnd>
        )}
      </Card>

      {/* ACTIONS */}
      <div className="flex items-center justify-between">

        <div className="flex gap-2">
          <Badge>Station AI</Badge>
          <Badge variant="secondary">Queue Detection</Badge>
        </div>

        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Zone
        </Button>
      </div>
    </div>
  )
}
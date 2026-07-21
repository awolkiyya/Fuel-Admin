"use client";

import { useState, useCallback } from "react";
import {
  Camera, Plus, Power, RefreshCcw, Video,
  Pencil, Loader2, Brain, WifiOff, Wifi,
} from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useCameras,
  useCreateCamera,
  useTestCamera,
  useToggleCameraAI,
  useToggleCameraStatus,
  useUpdateCamera,
} from "@/hooks/station/useCameras";

import { RootState } from "@/lib/store";
import { CameraForm } from "@/types/camera";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type ActionKey = "test" | "ai" | "status";
type ActionMap = Partial<Record<ActionKey, boolean>>;
type TestResult = { success: boolean; message: string; latency?: number };

const CAMERA_TYPES = [
  { value: "IP_CAMERA", label: "IP Camera" },
  { value: "RTSP",      label: "RTSP Stream" },
  { value: "WEBRTC",    label: "WebRTC" },
  { value: "ANALOG",    label: "Analog" },
] as const;

const DEFAULT_FORM: CameraForm = {
  name:       "",
  stationId:  "",
  streamUrl:  "",
  type:       "http",
  ipAddress:  "",
  port:       undefined,
  location:   "",
  fps:        undefined,
  codec:      "",
  resolution: "",
  aiEnabled:  false,
  isActive:   true,
};

/* ─────────────────────────────────────────────
   HOOKS — isolated state management
───────────────────────────────────────────── */

function useCameraActions() {
  const [loadingMap, setLoadingMap] = useState<Record<string, ActionMap>>({});
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const setLoading = useCallback(
    (id: string, action: ActionKey, value: boolean) =>
      setLoadingMap((prev) => ({
        ...prev,
        [id]: { ...prev[id], [action]: value },
      })),
    []
  );

  const isLoading = (id: string, action: ActionKey) =>
    !!loadingMap[id]?.[action];

  const setResult = useCallback((id: string, result: TestResult) =>
    setTestResults((prev) => ({ ...prev, [id]: result })), []);

  return { isLoading, setLoading, testResults, setResult };
}

function useCameraForm(stationId: string) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<CameraForm>({ ...DEFAULT_FORM, stationId });

  const patchForm = (patch: Partial<CameraForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const openAdd = () => {
    setMode("add");
    setForm({ ...DEFAULT_FORM, stationId });
    setOpen(true);
  };

  const openEdit = (cam: any) => {
    setMode("edit");
    setForm(cam);
    setOpen(true);
  };

  return { open, setOpen, mode, form, patchForm, openAdd, openEdit, isSaving, setIsSaving };
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function CameraCardSkeleton() {
  return <Card className="h-40 animate-pulse bg-muted" />;
}

function EmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
      <Camera className="w-10 h-10 opacity-30" />
      <p className="text-sm">No cameras found. Add one to get started.</p>
    </div>
  );
}

interface TestBadgeProps {
  result: TestResult;
}

function TestBadge({ result }: TestBadgeProps) {
  return (
    <div
      className={`text-xs px-3 py-1.5 rounded border flex items-center gap-1.5 ${
        result.success
          ? "border-green-500/40 bg-green-500/5 text-green-600"
          : "border-red-500/40 bg-red-500/5 text-red-600"
      }`}
    >
      {result.success ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {result.message}
      {result.latency && <span className="opacity-70">• {result.latency}ms</span>}
    </div>
  );
}

interface CameraCardProps {
  cam: any;
  testResult?: TestResult;
  isTestLoading: boolean;
  isStatusLoading: boolean;
  isAILoading: boolean;
  onTest: () => void;
  onToggleStatus: () => void;
  onToggleAI: () => void;
  onEdit: () => void;
}

function CameraCard({
  cam,
  testResult,
  isTestLoading,
  isStatusLoading,
  isAILoading,
  onTest,
  onToggleStatus,
  onToggleAI,
  onEdit,
}: CameraCardProps) {
  const isOnline = cam.status === "online";

  return (
    <Card className="p-4 space-y-3 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="min-w-0 mr-2">
          <h2 className="font-semibold truncate">{cam.name}</h2>
          <p className="text-xs text-muted-foreground truncate">
            {cam.location || cam.stationId}
          </p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <Badge
            variant="outline"
            className={
              isOnline
                ? "border-green-500/40 bg-green-500/10 text-green-600"
                : "border-red-500/40 bg-red-500/10 text-red-600"
            }
          >
            {cam.status}
          </Badge>
          <Badge variant={cam.aiEnabled ? "default" : "outline"}>
            AI {cam.aiEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </div>

      {/* Stream URL */}
      <p className="text-xs text-muted-foreground break-all line-clamp-1" title={cam.streamUrl}>
        {cam.streamUrl}
      </p>

      {/* Test result */}
      {testResult && <TestBadge result={testResult} />}

      {/* Actions */}
      <div className="flex justify-between items-center pt-1">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isTestLoading}
            onClick={onTest}
          >
            {isTestLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Video className="w-4 h-4 mr-1" />
            )}
            Test
          </Button>

          <Button
            size="sm"
            variant={isOnline ? "default" : "outline"}
            disabled={isStatusLoading}
            onClick={onToggleStatus}
          >
            {isStatusLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4 mr-1" />
            )}
            {isOnline ? "Disable" : "Enable"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={cam.aiEnabled ? "default" : "outline"}
            disabled={isAILoading}
            onClick={onToggleAI}
            title={`${cam.aiEnabled ? "Disable" : "Enable"} AI`}
          >
            {isAILoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
          </Button>

          <Button size="sm" variant="ghost" onClick={onEdit} title="Edit">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface CameraFormModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "add" | "edit";
  form: CameraForm;
  isSaving: boolean;
  onPatch: (patch: Partial<CameraForm>) => void;
  onSave: () => void;
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

function CameraFormModal({
  open,
  onOpenChange,
  mode,
  form,
  isSaving,
  onPatch,
  onSave,
}: CameraFormModalProps) {
  const isValid = !!(form.name.trim() && form.streamUrl.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Camera" : "Edit Camera"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">

          {/* ── Basic info ── */}
          <div className="space-y-1.5">
            <Label htmlFor="cam-name">Name *</Label>
            <Input
              id="cam-name"
              placeholder="e.g. Main Gate Camera"
              value={form.name}
              onChange={(e) => onPatch({ name: e.target.value })}
            />
            <FieldHint>Human-readable label shown on the dashboard.</FieldHint>
          </div>

          {/* ── Camera type ── */}
          <div className="space-y-1.5">
            <Label htmlFor="cam-type">Camera Type *</Label>
            <select
              id="cam-type"
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              value={form.type ?? "IP_CAMERA"}
              onChange={(e) => onPatch({ type: e.target.value as any })}
            >
              {CAMERA_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* ── Stream URL ── */}
          <div className="space-y-1.5">
            <Label htmlFor="cam-url">Stream URL *</Label>
            <Input
              id="cam-url"
              placeholder="rtsp:// or http://"
              value={form.streamUrl}
              onChange={(e) => onPatch({ streamUrl: e.target.value })}
            />
            <FieldHint>RTSP / HTTP / WebRTC stream endpoint.</FieldHint>
          </div>

          {/* ── Network ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cam-ip">IP Address</Label>
              <Input
                id="cam-ip"
                placeholder="192.168.1.10"
                value={form.ipAddress ?? ""}
                onChange={(e) => onPatch({ ipAddress: e.target.value })}
              />
              <FieldHint>Optional — used for diagnostics.</FieldHint>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cam-port">Port</Label>
              <Input
                id="cam-port"
                type="number"
                placeholder="554"
                value={form.port ?? ""}
                onChange={(e) =>
                  onPatch({ port: e.target.value ? Number(e.target.value) : undefined })
                }
              />
              <FieldHint>Default RTSP port is 554.</FieldHint>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="space-y-1.5">
            <Label htmlFor="cam-location">Location</Label>
            <Input
              id="cam-location"
              placeholder="e.g. Main Gate / Fuel Area"
              value={form.location ?? ""}
              onChange={(e) => onPatch({ location: e.target.value })}
            />
            <FieldHint>Logical placement label for dashboard grouping.</FieldHint>
          </div>

          {/* ── Stream config ── */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cam-fps">FPS</Label>
              <Input
                id="cam-fps"
                type="number"
                placeholder="25"
                value={form.fps ?? ""}
                onChange={(e) =>
                  onPatch({ fps: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cam-codec">Codec</Label>
              <Input
                id="cam-codec"
                placeholder="h264 / h265"
                value={form.codec ?? ""}
                onChange={(e) => onPatch({ codec: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cam-res">Resolution</Label>
              <Input
                id="cam-res"
                placeholder="1920x1080"
                value={form.resolution ?? ""}
                onChange={(e) => onPatch({ resolution: e.target.value })}
              />
            </div>
          </div>

          {/* ── AI toggle ── */}
          <div className="flex items-center justify-between border rounded-md px-4 py-3">
            <div>
              <p className="text-sm font-medium">AI Processing</p>
              <p className="text-xs text-muted-foreground">
                Enable real-time AI analysis for this camera.
              </p>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 cursor-pointer"
              checked={form.aiEnabled ?? false}
              onChange={(e) => onPatch({ aiEnabled: e.target.checked })}
            />
          </div>

          {/* ── Save ── */}
          <Button
            className="w-full"
            disabled={isSaving || !isValid}
            onClick={onSave}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : mode === "add" ? (
              "Create Camera"
            ) : (
              "Update Camera"
            )}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

export default function CameraPage() {
  const stationId = useSelector(
    (state: RootState) => state.auth.user?.stationId ?? ""
  );

  // Data hooks
  const { data, isLoading, refetch } = useCameras();
  const createCamera = useCreateCamera();
  const updateCamera = useUpdateCamera();
  const toggleAI = useToggleCameraAI();
  const toggleStatus = useToggleCameraStatus();
  const testCamera = useTestCamera();

  const cameras: any[] = data?.data ?? [];

  // Local state managers
  const { isLoading: isActionLoading, setLoading, testResults, setResult } =
    useCameraActions();
  const { open, setOpen, mode, form, patchForm, openAdd, openEdit, isSaving, setIsSaving } =
    useCameraForm(stationId);

  /* ── Action handlers ── */

  const handleTest = useCallback(async (id: string) => {
    setLoading(id, "test", true);
    try {
      const res = await testCamera.mutateAsync(id);
      const isOnline = res?.data?.status === "online";
      setResult(id, {
        success: isOnline,
        message: res?.data?.status
          ? `Stream ${res.data.status}`
          : res?.message ?? "Unknown result",
        latency: res?.data?.latencyMs,
      });
    } catch {
      setResult(id, { success: false, message: "Stream unavailable" });
    } finally {
      setLoading(id, "test", false);
    }
  }, [testCamera, setLoading, setResult]);

  const handleToggleAI = useCallback(async (cam: any) => {
    setLoading(cam.id, "ai", true);
    try {
      await toggleAI.mutateAsync({ id: cam.id, aiEnabled: !cam.aiEnabled });
    } finally {
      setLoading(cam.id, "ai", false);
    }
  }, [toggleAI, setLoading]);

  const handleToggleStatus = useCallback(async (cam: any) => {
    setLoading(cam.id, "status", true);
    try {
      await toggleStatus.mutateAsync({
        id: cam.id,
        status: cam.status === "online" ? "offline" : "online",
      });
    } finally {
      setLoading(cam.id, "status", false);
    }
  }, [toggleStatus, setLoading]);

  const handleSave = useCallback(async () => {
    if (!form.name.trim() || !form.streamUrl.trim() || !stationId) return;
    setIsSaving(true);
    try {
      if (mode === "add") {
        await createCamera.mutateAsync({ ...form, stationId });
      } else {
        await updateCamera.mutateAsync({ id: form.id!, data: form });
      }
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  }, [form, stationId, mode, createCamera, updateCamera, setOpen, setIsSaving]);

  /* ── Render ── */

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Camera className="w-6 h-6" /> Camera Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor &amp; manage all cameras
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <Separator />

      {/* Camera grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CameraCardSkeleton key={i} />)
        ) : cameras.length === 0 ? (
          <EmptyState />
        ) : (
          cameras.map((cam) => (
            <CameraCard
              key={cam.id}
              cam={cam}
              testResult={testResults[cam.id]}
              isTestLoading={isActionLoading(cam.id, "test")}
              isStatusLoading={isActionLoading(cam.id, "status")}
              isAILoading={isActionLoading(cam.id, "ai")}
              onTest={() => handleTest(cam.id)}
              onToggleStatus={() => handleToggleStatus(cam)}
              onToggleAI={() => handleToggleAI(cam)}
              onEdit={() => openEdit(cam)}
            />
          ))
        )}
      </div>

      {/* Add / Edit modal */}
      <CameraFormModal
        open={open}
        onOpenChange={setOpen}
        mode={mode}
        form={form}
        isSaving={isSaving}
        onPatch={patchForm}
        onSave={handleSave}
      />

    </div>
  );
}
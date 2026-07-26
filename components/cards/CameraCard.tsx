"use client";

import {
  Brain,
  Edit,
  Loader2,
  Power,
  Video,
  Radio,
  Gauge,
  Cpu,
  Maximize2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* =============================================================
   TYPES
   ============================================================= */

type TestResult = {
  success: boolean;
  message: string;
  latency?: number;
};

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

/* =============================================================
   COMPONENT
   All colors below use theme tokens (bg-card, text-foreground,
   border-border, etc.) so the card follows the app's light/dark
   theme automatically. The only non-token colors are the emerald
   "live" accent and red "error" accent, since success/error
   aren't part of the default shadcn token set — each carries an
   explicit dark: pair so contrast holds in both themes.
   ============================================================= */

export function CameraCard({
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
  const online = cam.status?.toUpperCase() === "ONLINE";

  return (
    <Card className="group relative overflow-hidden rounded-xl border-border bg-card text-card-foreground shadow-none transition-colors hover:border-foreground/20">
      {/* status rail — the one signature element: a live signal edge */}
      <div
        className={`absolute inset-y-0 left-0 w-[3px] ${
          online ? "bg-emerald-500" : "bg-border"
        }`}
      />

      <div className="space-y-4 p-5 pl-6">
        {/* ============= HEADER ============= */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div className="relative shrink-0 rounded-lg bg-muted p-2 ring-1 ring-inset ring-border">
              <Video className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                {online && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ring-2 ring-card ${
                    online ? "bg-emerald-500" : "bg-muted-foreground/40"
                  }`}
                />
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
                {cam.name}
              </h3>
              <p className="truncate text-xs text-muted-foreground">
                {cam.location ?? "Unknown location"}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
              online
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cam.status}
          </span>
        </div>

        {/* ============= STREAM READOUT ============= */}
        <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 font-mono text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 text-foreground/80">
            <Radio className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="text-emerald-600 dark:text-emerald-400">
              {cam.protocol}
            </span>
            <span className="truncate text-muted-foreground">
              {cam.host}:{cam.port}
            </span>
          </div>
          <div className="mt-1 truncate pl-5 text-muted-foreground/80">
            {cam.path}
          </div>
        </div>

        {/* ============= METRICS ============= */}
        <div className="flex divide-x divide-border rounded-lg border border-border">
          <Metric icon={<Gauge className="h-3 w-3" />} label="FPS" value={cam.fps ?? "—"} />
          <Metric icon={<Cpu className="h-3 w-3" />} label="Codec" value={cam.codec ?? "—"} />
          <Metric
            icon={<Maximize2 className="h-3 w-3" />}
            label="Res"
            value={cam.resolution ?? "—"}
          />
        </div>

        {/* ============= AI DETECTION ============= */}
        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <Brain
              className={`h-4 w-4 ${
                cam.aiEnabled
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-xs text-foreground/80">AI Detection</span>
          </div>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider ${
              cam.aiEnabled
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {cam.aiEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* ============= TEST RESULT ============= */}
        {testResult && (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[11px] ${
              testResult.success
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                testResult.success ? "bg-emerald-500" : "bg-destructive"
              }`}
            />
            <span className="truncate">{testResult.message}</span>
            {testResult.latency && (
              <span className="text-muted-foreground">
                · {testResult.latency}ms
              </span>
            )}
          </div>
        )}

        {/* ============= ACTIONS ============= */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <Button
            size="sm"
            variant="ghost"
            disabled={isTestLoading}
            onClick={onTest}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {isTestLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Video className="h-3.5 w-3.5" />
            )}
            Test
          </Button>

          <div className="flex gap-1">
            <IconButton
              active={online}
              loading={isStatusLoading}
              onClick={onToggleStatus}
              icon={<Power className="h-3.5 w-3.5" />}
              label="Toggle power"
            />
            <IconButton
              active={!!cam.aiEnabled}
              loading={isAILoading}
              onClick={onToggleAI}
              icon={<Brain className="h-3.5 w-3.5" />}
              label="Toggle AI detection"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Edit camera"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* =============================================================
   SUBCOMPONENTS
   ============================================================= */

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 px-2 py-2.5">
      <div className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-[9px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="truncate font-mono text-xs font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function IconButton({
  active,
  loading,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  loading: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      disabled={loading}
      onClick={onClick}
      aria-label={label}
      className={`h-8 w-8 ${
        active
          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
    </Button>
  );
}
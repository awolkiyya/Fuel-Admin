"use client";

import React from "react";

import { useParams, useRouter } from "next/navigation";

import {
  FileText,
  User,
  Calendar,
  ShieldCheck,
  Clock,
  Copy,
  CheckCircle2,
  Activity,
  Paperclip,
  ArrowLeft,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { StatusBadge } from "@/components/badges/StatusBadge";
import { DocumentPreview } from "@/components/cards/DocumentPreview";

import {
  BusinessLicenseRequestType,
  BusinessLicenseStatus,
} from "@/types/business-license";

import {
  useBusinessLicense,
  useApproveBusinessLicense,
  useRejectBusinessLicense,
} from "@/hooks/business-license/useBusinessLicenses";

import { Panel } from "@/components/Panel";
import { InfoCell } from "@/components/InfoCell";
import { TimelineItem } from "@/components/TimelineItem";
import { getFileUrl } from "@/utils/fileUrl";
import { formatEthiopianDate } from "@/lib/utils";

function fmt(raw?: string) {
  if (!raw) return "N/A";
  const d = new Date(raw);
  return isNaN(d.getTime())
    ? raw
    : d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function fmtDateTime(raw?: string) {
  if (!raw) return "N/A";
  const d = new Date(raw);
  return isNaN(d.getTime())
    ? raw
    : d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function formatRequestType(type?: BusinessLicenseRequestType) {
  if (!type) return "N/A";
  return type === "NEW" ? "New License" : "Renewal";
}

const STATUS_COLOR: Record<BusinessLicenseStatus, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  ACTIVE: "bg-green-50 text-green-800 border-green-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
  EXPIRED: "bg-gray-100 text-gray-600 border-gray-200",
};

// Common reasons so reviewers rarely have to type from scratch.
const QUICK_REASONS = [
  "Document is blurry or unreadable",
  "License number does not match records",
  "Document has expired",
  "Uploaded file does not match business type",
];

const MIN_REASON_LENGTH = 10;

// ================= REJECT DIALOG =================

function RejectLicenseDialog({
  open,
  onOpenChange,
  licenseNumber,
  isSubmitting,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  licenseNumber: string;
  isSubmitting: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  // Reset the form each time the dialog is opened fresh.
  React.useEffect(() => {
    if (open) {
      setReason("");
      setTouched(false);
    }
  }, [open]);

  const trimmed = reason.trim();
  const isTooShort = trimmed.length < MIN_REASON_LENGTH;
  const showError = touched && isTooShort;

  const handleConfirm = () => {
    setTouched(true);
    if (isTooShort || isSubmitting) return;
    onConfirm(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isSubmitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Reject business license</DialogTitle>
              <DialogDescription className="mt-0.5">
                #{licenseNumber}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0 translate-y-0.5" />
            <p>
              The applicant will be notified with the reason below and will
              need to resubmit their request. This can&apos;t be undone.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reject-reason">Reason for rejection</Label>
              <span
                className={`text-xs ${
                  showError ? "text-red-600" : "text-muted-foreground"
                }`}
              >
                {trimmed.length}/{MIN_REASON_LENGTH} min
              </span>
            </div>

            <Textarea
              id="reject-reason"
              placeholder="Explain what's wrong so the applicant can fix it, e.g. 'The uploaded document is expired.'"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => setTouched(true)}
              rows={4}
              className={showError ? "border-red-400 focus-visible:ring-red-300" : ""}
              autoFocus
            />

            {showError && (
              <p className="text-xs text-red-600">
                Please provide at least {MIN_REASON_LENGTH} characters so the
                applicant understands what to fix.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Quick reasons
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REASONS.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setReason(q)}
                  className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting || (touched && isTooShort)}
          >
            {isSubmitting ? "Rejecting..." : "Confirm rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ================= PAGE =================

export default function BusinessLicenseDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: license, isLoading, isError } = useBusinessLicense(id);

  const approveMutation = useApproveBusinessLicense();
  const rejectMutation = useRejectBusinessLicense();

  const [copied, setCopied] = React.useState(false);
  const [copiedUserId, setCopiedUserId] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);

  if (isLoading) {
    return <div className="p-6">Loading license details...</div>;
  }

  if (isError || !license) {
    return <div className="p-6">Business license not found.</div>;
  }

  const isPending = license.status === "PENDING";
  const isProcessing = approveMutation.isPending || rejectMutation.isPending;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(license.licenseNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyUserId = async () => {
    await navigator.clipboard.writeText(license.userId);
    setCopiedUserId(true);
    setTimeout(() => setCopiedUserId(false), 1500);
  };

  const handleApprove = () => {
    approveMutation.mutate({ id: license.id });
  };

  const handleConfirmReject = (reason: string) => {
    rejectMutation.mutate(
      { id: license.id, reason },
      {
        onSuccess: () => setRejectOpen(false),
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="sticky top-0 z-20 bg-background border-b px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-md hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <FileText className="h-4 w-4" />

            <span className="text-sm font-semibold">Business License</span>

            <span className="font-mono text-sm">
              /{license.licenseNumber}
            </span>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLOR[license.status]}`}
          >
            {license.status}
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="bg-background border rounded-xl px-6 py-5">
            <p className="text-xs text-muted-foreground">License number</p>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono">
                {license.licenseNumber}
              </h1>

              <button onClick={handleCopy}>
                {copied ? (
                  <CheckCircle2 className="text-green-500" />
                ) : (
                  <Copy />
                )}
              </button>
            </div>

            <StatusBadge status={license.status} />
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <Panel icon={ShieldCheck} title="License Information">
                <div className="grid sm:grid-cols-2 gap-3">
                  <InfoCell
                    icon={FileText}
                    label="License Number"
                    value={license.licenseNumber}
                  />

                  <InfoCell
                    icon={Activity}
                    label="Request Type"
                    value={formatRequestType(license.requestType)}
                  />

                  <InfoCell
                    icon={Calendar}
                    label="Expiry"
                    value={license.expiryDate ? formatEthiopianDate(license.expiryDate):"_"}
                  />

                  <InfoCell
                    icon={Activity}
                    label="Status"
                    value={license.status}
                  />

                  <InfoCell
                    icon={Paperclip}
                    label="Document"
                    value={license.documentUrl ? "Uploaded" : "Missing"}
                  />
                </div>
              </Panel>

              {/* Rejection reason is only relevant once a decision has been made */}
              {license.status === "REJECTED" && license.rejectionReason && (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  <XCircle className="h-4 w-4 shrink-0 translate-y-0.5" />
                  <div>
                    <p className="font-medium">Rejection reason</p>
                    <p className="mt-0.5 text-red-700">
                      {license.rejectionReason}
                    </p>
                  </div>
                </div>
              )}

              <Panel icon={FileText} title="Document Preview">
                <DocumentPreview
                  url={getFileUrl(license.documentUrl)}
                  title="Business License Document"
                  emptyIcon={
                    <Paperclip className="h-6 w-6 text-muted-foreground opacity-40" />
                  }
                  emptyText="No document uploaded"
                />
              </Panel>
            </div>

            <div className="space-y-5">
              <Panel icon={User} title="Owner">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {license.user?.full_name?.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold">{license.user?.full_name}</p>
                    <p className="text-xs">{license.user?.phone}</p>
                  </div>
                </div>
              </Panel>

              <Panel icon={Clock} title="Audit Trail">
                <TimelineItem
                  label="Created"
                  value={fmtDateTime(license.createdAt)}
                />
                <TimelineItem
                  label="Updated"
                  value={fmtDateTime(license.updatedAt)}
                />
              </Panel>
            </div>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-background border-t px-6 py-3">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Close
          </Button>

          {isPending && (
            <>
              <Button
                variant="destructive"
                disabled={isProcessing}
                onClick={() => setRejectOpen(true)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>

              <Button disabled={isProcessing} onClick={handleApprove}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </Button>
            </>
          )}
        </div>
      </footer>

      <RejectLicenseDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        licenseNumber={license.licenseNumber}
        isSubmitting={rejectMutation.isPending}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
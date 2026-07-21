"use client";

import React from "react";
import {
  FileText,
  User,
  Calendar,
  ShieldCheck,
  Clock,
  ExternalLink,
  Copy,
  CheckCircle2,
  XCircle,
  Activity,
  Building2,
  Paperclip,
  LucideIcon,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { DocumentPreview } from "@/components/cards/DocumentPreview";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type BusinessLicenseStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

type BusinessLicense = {
  id: string;
  userId: string;
  licenseNumber: string;
  documentUrl?: string;
  expiryDate?: string;
  status: BusinessLicenseStatus;
  issuedBy?: string;
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

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

const STATUS_COLOR: Record<BusinessLicenseStatus, string> = {
  PENDING:  "bg-amber-50 text-amber-800 border-amber-200",
  APPROVED: "bg-green-50 text-green-800 border-green-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
  EXPIRED:  "bg-gray-100 text-gray-600 border-gray-200",
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function BusinessLicenseDetailPage() {
  const [copied, setCopied] = React.useState(false);
  const [copiedUserId, setCopiedUserId] = React.useState(false);

  // Replace with real API fetch
  const license: BusinessLicense =  {
    id: "1",
    userId: "user_101",
    licenseNumber: "LIC-2026-0001",
    documentUrl: "https://imgv2-1-f.scribdassets.com/img/document/769977446/original/f92a91b5f4/1?v=1",
    expiryDate: "2027-01-10",
    status: "PENDING",
    issuedBy: "Ministry of Trade",
    issuedAt: "2026-01-10",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
  };

  const isPending = license.status === "PENDING";

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

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">

      {/* ── Sticky header ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-background border-b px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <button
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Business license</span>
              <span className="text-muted-foreground text-sm">/</span>
              <span className="text-sm text-muted-foreground font-mono">
                {license.licenseNumber}
              </span>
            </div>
          </div>

          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              STATUS_COLOR[license.status]
            }`}
          >
            {license.status}
          </span>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* Hero strip */}
          <div className="bg-background border rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div className="space-y-2 min-w-0">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                License number
              </p>

              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-wide font-mono break-all">
                  {license.licenseNumber}
                </h1>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors shrink-0"
                  aria-label="Copy license number"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>

              <StatusBadge status={license.status} />
            </div>


          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

            {/* ── Left (main) ─────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* License info grid */}
              <Panel icon={ShieldCheck} title="License information">
                <div className="grid sm:grid-cols-2 gap-3">
                  <InfoCell icon={FileText}   label="License no."  value={license.licenseNumber} />
                  <InfoCell icon={Calendar}   label="Expiry date"  value={fmt(license.expiryDate)} />
                  <InfoCell icon={Activity}   label="Status"       value={license.status} />
                  <InfoCell
                    icon={Paperclip}
                    label="Document"
                    value={license.documentUrl ? "Uploaded" : "Missing"}
                    valueClassName={
                      license.documentUrl ? "text-green-600" : "text-destructive"
                    }
                  />
                </div>
              </Panel>

              {/* Document preview */}
              <Panel icon={FileText} title="Document preview">
                <DocumentPreview
                  url={license.documentUrl}
                  title="Business License Document"
                  emptyIcon={<Paperclip className="h-6 w-6 text-muted-foreground opacity-40" />}
                  emptyText="No document uploaded"
                />
              </Panel>

            </div>

            {/* ── Right (sidebar) ──────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Owner */}
              <Panel icon={User} title="Owner">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0 select-none">
                    {license.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      User ID
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold break-all leading-snug flex-1">
                        {license.userId}
                      </p>
                      <button
                        onClick={handleCopyUserId}
                        className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                        aria-label="Copy user ID"
                      >
                        {copiedUserId ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Panel>

              {/* Audit trail */}
              <Panel icon={Clock} title="Audit trail">
                <ol className="space-y-0">
                  <TimelineItem
                    label="Created"
                    value={fmtDateTime(license.createdAt)}
                  />
                  <TimelineItem
                    label="Last updated"
                    value={fmtDateTime(license.updatedAt)}
                    isLast
                  />
                </ol>
              </Panel>

              {/* Status context */}
              <div
                className={`rounded-xl border px-4 py-3.5 ${STATUS_COLOR[license.status]}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1 opacity-70">
                  Current status
                </p>
                <p className="text-sm font-semibold">{license.status}</p>
                <p className="text-xs mt-1 opacity-75">
                  {license.status === "PENDING" &&
                    "Awaiting admin review. Approve or reject below."}
                  {license.status === "APPROVED" &&
                    "This license has been verified and approved."}
                  {license.status === "REJECTED" &&
                    "This license was rejected. Contact support for details."}
                  {license.status === "EXPIRED" &&
                    "This license has passed its expiry date."}
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky action footer ─────────────────────────────────────────── */}
      <footer className="sticky bottom-0 z-20 bg-background border-t px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground hidden sm:block">
            {isPending
              ? "This license is pending — review the document above before approving."
              : `License status: ${license.status}`}
          </p>

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm">
              Close
            </Button>

            {isPending && (
              <>
                <Button variant="destructive" size="sm">
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Reject
                </Button>
                <Button size="sm">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─── Panel ──────────────────────────────────────────────────────────────── */

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background rounded-xl border overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b bg-muted/30">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ─── InfoCell ───────────────────────────────────────────────────────────── */

function InfoCell({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg border px-3.5 py-3 bg-muted/20">
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
        <Icon className="h-3 w-3 shrink-0" />
        {label}
      </div>
      <p
        className={`text-sm font-semibold break-words leading-snug ${
          valueClassName ?? ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ─── TimelineItem ───────────────────────────────────────────────────────── */

function TimelineItem({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <li className={`flex gap-3 ${!isLast ? "pb-4" : ""}`}>
      <div className="flex flex-col items-center pt-1">
        <div className="h-2 w-2 rounded-full bg-border ring-2 ring-background shrink-0" />
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>
      <div className="pb-1 min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-xs font-semibold">{value}</p>
      </div>
    </li>
  );
}
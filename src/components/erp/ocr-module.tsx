"use client";

import { useCallback, useRef, useState } from "react";
import { useApi, fmtZAR2 } from "@/hooks/use-api";
import { ErpHeader } from "./erp-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, CloudUpload, FileWarning, ScanLine, Stamp, XCircle, Loader2,
} from "lucide-react";

interface Receipt {
  id: string; fileName: string; merchant: string | null; vatNumber: string | null;
  category: string; amount: number; documentDate: string; tier: string; status: string;
  ocrConfidence: number; approvedBy: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  FACILITIES: "bg-navy/10 text-navy",
  IT: "bg-blue-500/10 text-blue-700",
  ACADEMIC: "bg-gold/15 text-yellow-700",
  TRANSPORT: "bg-emerald-brand/10 text-emerald-brand",
  CANTEEN: "bg-orange-500/10 text-orange-600",
  MISC: "bg-muted text-muted-foreground",
};

export function OcrModule() {
  const { data: receipts, refresh } = useApi<Receipt[]>("/api/receipts");
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      setProcessing(true);
      try {
        for (const file of Array.from(files)) {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/receipts", { method: "POST", body: fd });
          const json = await res.json();
          if (!res.ok) {
            toast.error(`${file.name}: ${json.error || "processing failed"}`);
            continue;
          }
          const r = json.receipt as Receipt;
          if (r.tier === "EXECUTIVE") {
            toast.warning(`${file.name} → R5,000+ threshold`, {
              description: `${r.merchant ?? "Unknown merchant"} · ${fmtZAR2(r.amount)} — flagged for Bursar & Executive sign-off`,
            });
          } else {
            toast.success(`${file.name} auto-logged`, {
              description: `${r.merchant ?? "Unknown merchant"} · ${fmtZAR2(r.amount)} · confidence ${(r.ocrConfidence * 100).toFixed(0)}%`,
            });
          }
        }
        refresh();
      } finally {
        setProcessing(false);
      }
    },
    [refresh]
  );

  const review = async (id: string, status: "APPROVED" | "REJECTED") => {
    const res = await fetch("/api/receipts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, approvedBy: "Mehmet Kaya (Executive Director)" }),
    });
    if (res.ok) {
      toast.success(status === "APPROVED" ? "Receipt approved & logged to cost center" : "Receipt rejected");
      refresh();
    }
  };

  const pending = (receipts ?? []).filter((r) => r.status === "PENDING_APPROVAL");

  return (
    <div>
      <ErpHeader
        title="AI OCR Receipt & Purchase Order Processing"
        blurb="Drag in invoices and receipts — fields are auto-extracted and routed by value. Purchases under R5,000 log automatically; anything above requires dual sign-off."
      />

      {/* Uploader */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) upload(e.dataTransfer.files); }}
        className={cn(
          "grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-10 text-center transition-all",
          dragging ? "border-gold bg-gold/5 scale-[1.01]" : "border-border bg-card hover:border-gold/50"
        )}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload receipts or invoices"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
        {processing ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
            <p className="mt-3 text-sm font-bold text-navy">Running OCR extraction…</p>
            <p className="text-xs text-muted-foreground">Tesseract engine · SA VAT &amp; ZAR patterns</p>
          </>
        ) : (
          <>
            <CloudUpload className={cn("h-10 w-10 transition-colors", dragging ? "text-gold" : "text-muted-foreground")} />
            <p className="mt-3 text-sm font-bold text-navy">Drop invoices &amp; receipts here</p>
            <p className="text-xs text-muted-foreground">JPG, PNG or PDF · multi-file supported · auto VAT/total/date extraction</p>
          </>
        )}
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <Card className="mt-6 border-gold/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-navy">
              <Stamp className="h-4 w-4 text-gold" /> Awaiting executive sign-off
              <Badge className="border-0 bg-gold text-navy-deep">{pending.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/5 p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-navy">{r.merchant ?? "Unknown merchant"}</span>
                    <Badge variant="outline" className="text-[10px] border-destructive/40 bg-destructive/5 text-destructive">
                      {fmtZAR2(r.amount)} · ≥ R5,000
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px]", CATEGORY_COLORS[r.category])}>{r.category}</Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {r.fileName} · VAT {r.vatNumber ?? "—"} · {r.documentDate} · OCR confidence {(r.ocrConfidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-brand hover:bg-emerald-brand/90" onClick={() => review(r.id, "APPROVED")}>
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => review(r.id, "REJECTED")}>
                    <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Ledger */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-navy">
            <ScanLine className="h-4 w-4" /> Processing ledger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[380px] space-y-2 overflow-y-auto scrollbar-thin">
            {(receipts ?? []).map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileWarning className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm font-semibold text-navy">{r.merchant ?? r.fileName}</span>
                    <Badge variant="outline" className={cn("text-[10px]", CATEGORY_COLORS[r.category])}>{r.category}</Badge>
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {r.documentDate} · {r.fileName} · {(r.ocrConfidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-navy">{fmtZAR2(r.amount)}</span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
            {(receipts ?? []).length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No documents processed yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    AUTO_LOGGED: { cls: "bg-emerald-brand/15 text-emerald-brand border-emerald-brand/30", label: "Auto-logged" },
    PENDING_APPROVAL: { cls: "bg-gold/15 text-yellow-700 border-gold/40", label: "Pending sign-off" },
    APPROVED: { cls: "bg-emerald-brand/15 text-emerald-brand border-emerald-brand/30", label: "Approved" },
    REJECTED: { cls: "bg-destructive/10 text-destructive border-destructive/30", label: "Rejected" },
  };
  const s = map[status] ?? map.MISC;
  return <Badge variant="outline" className={cn("text-[10px] font-bold whitespace-nowrap", s.cls)}>{s.label}</Badge>;
}

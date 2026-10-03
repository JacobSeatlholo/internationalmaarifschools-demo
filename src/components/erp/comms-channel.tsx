"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useApi } from "@/hooks/use-api";
import { ErpHeader } from "./erp-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PenLine, Radio, Send, ShieldCheck, Users } from "lucide-react";

type Role = "EXECUTIVE" | "BURSAR" | "PRINCIPAL" | "DEPT_HEAD" | "TEACHER" | "SYSTEM";

interface ChatMessage {
  id: string; channel: string; name: string; role: Role;
  content: string; timestamp: string; type: "user" | "system";
}
interface Directive {
  id: string; title: string; body: string; authorRole: string; requiresSignOff: boolean;
  signOffs: { staffName: string; role: string; signedAt: string }[];
}

const CHANNELS = [
  { key: "all-staff", label: "#all-staff" },
  { key: "executive", label: "#executive" },
  { key: "bursar", label: "#bursar" },
  { key: "department-heads", label: "#department-heads" },
  { key: "teachers", label: "#teachers" },
];

export function CommsChannel({ currentUser }: { currentUser: { name: string; role: string } }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [channel, setChannel] = useState("all-staff");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [directiveOpen, setDirectiveOpen] = useState(false);
  const [directiveForm, setDirectiveForm] = useState({ title: "", body: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, refresh: refreshDirectives } = useApi<{ directives: Directive[]; staff: { name: string; role: string }[] }>(
    "/api/directives",
    20000
  );

  const roleForSocket = (["EXECUTIVE", "BURSAR", "PRINCIPAL", "DEPT_HEAD", "TEACHER"].includes(currentUser.role)
    ? currentUser.role
    : "TEACHER") as Role;

  useEffect(() => {
    const s = io("/?XTransformPort=3003", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 1200,
      timeout: 10000,
    });
    socketRef.current = s;
    s.on("connect", () => {
      setConnected(true);
      s.emit("join", { name: currentUser.name, role: roleForSocket, channel: "all-staff" });
    });
    s.on("disconnect", () => setConnected(false));
    s.on("history", ({ channel: ch, messages: hist }: { channel: string; messages: ChatMessage[] }) => {
      setMessages((prev) => [...prev.filter((m) => m.channel !== ch), ...hist]);
    });
    s.on("message", (msg: ChatMessage) => setMessages((prev) => [...prev.slice(-200), msg]));
    s.on("system", (msg: ChatMessage) => setMessages((prev) => [...prev.slice(-200), msg]));
    s.on("join-error", ({ channel: ch, message }: { channel: string; message: string }) => {
      toast.error(`#${ch}: ${message}`);
    });
    return () => { s.disconnect(); };
     
  }, []);

  useEffect(() => {
    if (socketRef.current && connected && channel !== "all-staff") {
      socketRef.current.emit("join", { name: currentUser.name, role: roleForSocket, channel });
    }
  }, [channel, connected, currentUser.name, roleForSocket]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, channel]);

  const send = useCallback(() => {
    if (!socketRef.current || !draft.trim()) return;
    socketRef.current.emit("message", { channel, content: draft.trim() });
    setDraft("");
  }, [draft, channel]);

  const publishDirective = async () => {
    if (!directiveForm.title.trim() || !directiveForm.body.trim()) {
      return toast.error("Title and body are required");
    }
    const res = await fetch("/api/directives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...directiveForm, authorRole: currentUser.role }),
    });
    if (res.ok) {
      socketRef.current?.emit("directive-broadcast", { channel: "all-staff", title: directiveForm.title });
      toast.success("Executive directive published — sign-off tracking active");
      setDirectiveOpen(false);
      setDirectiveForm({ title: "", body: "" });
      refreshDirectives();
    }
  };

  const signOff = async (d: Directive) => {
    const res = await fetch("/api/directives", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ directiveId: d.id, staffName: currentUser.name, role: currentUser.role }),
    });
    if (res.ok) {
      toast.success(`Marked as read & understood — logged for compliance`);
      refreshDirectives();
    }
  };

  const directives = data?.directives ?? [];
  const totalStaff = data?.staff.length ?? 0;
  const channelMessages = messages.filter((m) => m.channel === channel);

  return (
    <div>
      <ErpHeader
        title="Internal Communication & Executive Directives"
        blurb="Role-gated real-time channels plus official directives requiring digital sign-off with a live compliance log."
      />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Chat */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base font-bold text-navy">
              <span className="flex items-center gap-2">
                <Radio className="h-4 w-4" /> Live channels
                <span className={cn("ml-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-black",
                  connected ? "bg-emerald-brand/15 text-emerald-brand" : "bg-destructive/10 text-destructive")}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "animate-livepulse bg-emerald-brand" : "bg-destructive")} />
                  {connected ? "LIVE" : "OFFLINE"}
                </span>
              </span>
              {["EXECUTIVE", "PRINCIPAL"].includes(currentUser.role) && (
                <Dialog open={directiveOpen} onOpenChange={setDirectiveOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gold text-navy-deep hover:bg-gold-soft">
                      <PenLine className="mr-1 h-3.5 w-3.5" /> Directive
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Publish executive directive</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                        <Input value={directiveForm.title} onChange={(e) => setDirectiveForm({ ...directiveForm, title: e.target.value })} className="mt-2" placeholder="e.g. Term 4 Exam Invigilation Protocol" />
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Body</Label>
                        <textarea
                          value={directiveForm.body}
                          onChange={(e) => setDirectiveForm({ ...directiveForm, body: e.target.value })}
                          className="mt-2 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Official notice content…"
                        />
                      </div>
                      <Button onClick={publishDirective} className="w-full bg-navy hover:bg-navy-soft">
                        Broadcast with mandatory sign-off
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>

          <div className="flex flex-wrap gap-1.5 px-6">
            {CHANNELS.map((c) => (
              <button
                key={c.key}
                onClick={() => { setChannel(c.key); setMessages([]); }}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-bold transition-all",
                  channel === c.key ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-navy/10"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <CardContent className="flex min-h-0 flex-1 flex-col pt-4">
            <div ref={scrollRef} className="h-[340px] flex-1 space-y-2 overflow-y-auto rounded-xl bg-muted/40 p-3 scrollbar-thin">
              {channelMessages.map((m) =>
                m.type === "system" ? (
                  <div key={m.id} className="text-center text-[10px] italic text-muted-foreground">{m.content}</div>
                ) : (
                  <div key={m.id} className={cn("flex", m.name === currentUser.name ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[78%] rounded-2xl px-3.5 py-2 text-[12px] leading-snug shadow-sm",
                      m.name === currentUser.name ? "bg-navy text-white" : "border bg-card"
                    )}>
                      {m.name !== currentUser.name && (
                        <div className="mb-0.5 text-[10px] font-black text-gold">{m.name} <span className="font-medium text-muted-foreground">· {m.role.replace("_", " ")}</span></div>
                      )}
                      {m.content}
                      <div className={cn("mt-1 text-[9px]", m.name === currentUser.name ? "text-white/50" : "text-muted-foreground")}>
                        {new Date(m.timestamp).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                )
              )}
              {channelMessages.length === 0 && (
                <p className="grid h-full place-items-center text-xs text-muted-foreground">
                  No messages in #{channel} yet — say hello.
                </p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={connected ? `Message #${channel}…` : "Connecting…"}
                disabled={!connected}
                aria-label="Chat message"
              />
              <Button onClick={send} disabled={!connected || !draft.trim()} className="bg-navy hover:bg-navy-soft">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Directives */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-navy">
              <ShieldCheck className="h-4 w-4" /> Executive directives
              <Badge variant="outline" className="text-[9px]"><Users className="mr-1 h-2.5 w-2.5" /> {totalStaff} staff</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[460px] space-y-3 overflow-y-auto scrollbar-thin">
            {directives.map((d) => {
              const signed = d.signOffs.some((s) => s.staffName === currentUser.name);
              const compliance = totalStaff ? Math.round((d.signOffs.length / totalStaff) * 100) : 0;
              return (
                <div key={d.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold leading-snug text-navy">{d.title}</h4>
                    <Badge variant="outline" className="shrink-0 border-navy/25 text-[9px] font-black">{d.authorRole}</Badge>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{d.body}</p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-muted-foreground">Compliance log</span>
                      <span className={cn(compliance === 100 ? "text-emerald-brand" : compliance >= 50 ? "text-yellow-700" : "text-destructive")}>
                        {d.signOffs.length}/{totalStaff} signed · {compliance}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full transition-all", compliance === 100 ? "bg-emerald-brand" : "bg-gold")} style={{ width: `${Math.max(3, compliance)}%` }} />
                    </div>
                    {d.signOffs.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {d.signOffs.map((s) => (
                          <Badge key={s.staffName} variant="outline" className="text-[9px] border-emerald-brand/30 bg-emerald-brand/5 text-emerald-brand">
                            {s.staffName}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {d.requiresSignOff && !signed && (
                    <Button size="sm" onClick={() => signOff(d)} className="mt-3 w-full bg-navy hover:bg-navy-soft">
                      <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Mark as read &amp; understood
                    </Button>
                  )}
                  {signed && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-brand/10 px-3 py-2 text-[11px] font-bold text-emerald-brand">
                      <ShieldCheck className="h-3.5 w-3.5" /> Signed off — recorded in compliance log
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

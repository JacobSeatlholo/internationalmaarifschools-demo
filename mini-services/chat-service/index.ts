/**
 * Maarif Internal Comms — real-time channel service (socket.io, port 3003)
 *
 * Features:
 *  - Role-gated channels: executive, bursar, department-heads, teachers, all-staff
 *  - Presence tracking per role
 *  - Message history replay (in-memory ring buffer per channel)
 *  - Directive broadcast events (sign-off compliance pings)
 */
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  path: "/",
  cors: { origin: "*", methods: ["GET", "POST"] },
  pingTimeout: 60000,
  pingInterval: 25000,
});

type Role = "EXECUTIVE" | "BURSAR" | "PRINCIPAL" | "DEPT_HEAD" | "TEACHER" | "SYSTEM";

interface ChatUser {
  id: string;
  name: string;
  role: Role;
}

interface ChatMessage {
  id: string;
  channel: string;
  name: string;
  role: Role;
  content: string;
  timestamp: string;
  type: "user" | "system";
}

const HISTORY_LIMIT = 100;
const history = new Map<string, ChatMessage[]>();
const users = new Map<string, ChatUser>();

const CHANNELS = ["all-staff", "executive", "bursar", "department-heads", "teachers"] as const;

// Channel access rules: which roles may read/write which channel
const ACCESS: Record<string, Role[]> = {
  "all-staff": ["EXECUTIVE", "BURSAR", "PRINCIPAL", "DEPT_HEAD", "TEACHER"],
  "executive": ["EXECUTIVE", "PRINCIPAL"],
  "bursar": ["EXECUTIVE", "BURSAR", "PRINCIPAL"],
  "department-heads": ["EXECUTIVE", "PRINCIPAL", "DEPT_HEAD"],
  "teachers": ["EXECUTIVE", "PRINCIPAL", "DEPT_HEAD", "TEACHER"],
};

const canAccess = (channel: string, role: Role) => (ACCESS[channel] ?? []).includes(role);

const mid = () => Math.random().toString(36).slice(2, 11);

const pushHistory = (channel: string, msg: ChatMessage) => {
  const arr = history.get(channel) ?? [];
  arr.push(msg);
  if (arr.length > HISTORY_LIMIT) arr.shift();
  history.set(channel, arr);
};

const systemMsg = (channel: string, content: string): ChatMessage => ({
  id: mid(), channel, name: "System", role: "SYSTEM",
  content, timestamp: new Date().toISOString(), type: "system",
});

io.on("connection", (socket) => {
  let currentUser: ChatUser | null = null;
  const joined = new Set<string>();

  console.log(`[comms] connected: ${socket.id}`);

  socket.on("join", ({ name, role, channel }: { name: string; role: Role; channel: string }) => {
    if (!canAccess(channel, role)) {
      socket.emit("join-error", { channel, message: "Your role does not have access to this channel." });
      return;
    }
    currentUser = { id: socket.id, name, role };
    users.set(socket.id, currentUser);
    joined.add(channel);
    socket.join(channel);

    if (!history.has(channel)) history.set(channel, []);
    socket.emit("history", { channel, messages: history.get(channel) });
    io.to(channel).emit("system", systemMsg(channel, `${name} joined #${channel}`));
    io.emit("presence", { online: Array.from(users.values()) });
    console.log(`[comms] ${name} (${role}) joined #${channel}`);
  });

  socket.on("message", ({ channel, content }: { channel: string; content: string }) => {
    if (!currentUser) return;
    if (!joined.has(channel) || !canAccess(channel, currentUser.role)) {
      socket.emit("join-error", { channel, message: "Access denied." });
      return;
    }
    const msg: ChatMessage = {
      id: mid(), channel, name: currentUser.name, role: currentUser.role,
      content: String(content).slice(0, 2000),
      timestamp: new Date().toISOString(), type: "user",
    };
    pushHistory(channel, msg);
    io.to(channel).emit("message", msg);
  });

  socket.on("leave-channel", ({ channel }: { channel: string }) => {
    if (joined.has(channel)) {
      socket.leave(channel);
      joined.delete(channel);
      if (currentUser) io.to(channel).emit("system", systemMsg(channel, `${currentUser.name} left #${channel}`));
    }
  });

  socket.on("directive-broadcast", ({ channel, title }: { channel: string; title: string }) => {
    if (!currentUser) return;
    if (!canAccess(channel, currentUser.role)) return;
    io.to(channel).emit("system", systemMsg(channel, `📌 Executive Directive broadcast: "${title}" — sign-off required.`));
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    if (currentUser) {
      for (const ch of joined) io.to(ch).emit("system", systemMsg(ch, `${currentUser.name} left`));
    }
    io.emit("presence", { online: Array.from(users.values()) });
  });

  socket.on("error", (e) => console.error(`[comms] socket error ${socket.id}`, e));
});

const PORT = 3003;
httpServer.listen(PORT, () => console.log(`[comms] real-time service running on port ${PORT}`));

process.on("SIGTERM", () => { httpServer.close(() => process.exit(0)); });
process.on("SIGINT", () => { httpServer.close(() => process.exit(0)); });

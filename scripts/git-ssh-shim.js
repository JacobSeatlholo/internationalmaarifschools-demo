#!/usr/bin/env node
/**
 * Minimal `ssh` CLI shim backed by the pure-JS ssh2 library.
 * Used as GIT_SSH so `git push` works on hosts without an OpenSSH binary.
 *
 * Usage (what git does):  ssh [-p port] [-o opt=val ...] host "command"
 */
const { readFileSync } = require("node:fs");
const { homedir } = require("node:os");
const { join } = require("node:path");
const { Client } = require("ssh2");

const args = process.argv.slice(2);
let host = null;
const cmdArgs = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "-p" || a === "-P") { i++; continue; }          // port → default 22
  if (a === "-o" || a === "-O") { i++; continue; }          // options ignored
  if (a === "-i") { i++; continue; }                        // identity handled below
  if (a.startsWith("-")) continue;
  if (host === null) host = a;
  else cmdArgs.push(a);
}

if (!host || cmdArgs.length === 0) {
  console.error("git-ssh-shim: missing host/command");
  process.exit(1);
}
const command = cmdArgs.join(" ");
// git passes "user@host" — strip the user part (we always authenticate as git)
const at = host.lastIndexOf("@");
if (at !== -1) host = host.slice(at + 1);

const keyPath = join(homedir(), ".ssh", "id_ed25519_github");
let key;
try {
  key = readFileSync(keyPath, "utf8");
} catch {
  console.error(`git-ssh-shim: key not found at ${keyPath}`);
  process.exit(1);
}

const conn = new Client();
conn
  .on("ready", () => {
    conn.exec(command, (err, stream) => {
      if (err) { console.error("git-ssh-shim exec:", err.message); process.exit(1); }
      let codeToExit = 0;
      process.stdin.pipe(stream.stdin);
      stream.stdout.pipe(process.stdout);
      stream.stderr.pipe(process.stderr);
      process.stdin.on("end", () => { try { stream.stdin.end(); } catch {} });
      process.stdin.on("error", () => {});
      stream.on("exit", (code) => { codeToExit = code ?? 1; });
      stream.on("close", () => { conn.end(); process.exit(codeToExit); });
    });
  })
  .on("error", (e) => {
    console.error("git-ssh-shim connect:", e.message);
    process.exit(255);
  })
  .connect({ host, port: 22, username: "git", privateKey: key, readyTimeout: 30000 });

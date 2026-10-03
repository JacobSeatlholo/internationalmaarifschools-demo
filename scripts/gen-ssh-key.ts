#!/usr/bin/env bun
/**
 * Generate an OpenSSH-format Ed25519 keypair without ssh-keygen.
 * Output: ~/.ssh/id_ed25519_github (.pub + private key in openssh-key-v1 format)
 */
import { generateKeyPairSync } from "node:crypto";
import { existsSync, mkdirSync, appendFileSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const COMMENT = `jacob-seatlholo-maarif-demo-${new Date().toISOString().slice(0, 10)}`;

// ── minimal ssh wire-string helpers ──
function u32(n: number) { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; }
function str(buf: Buffer | string) { const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf); return Buffer.concat([u32(b.length), b]); }

// ── key generation: raw seed + raw pubkey from Node crypto ──
const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const pubRaw = publicKey.export({ type: "spki", format: "der" }) as Buffer;
const privRaw = privateKey.export({ type: "pkcs8", format: "der" }) as Buffer;

// SPKI Ed25519 DER: ...12 06 03 2b6570 03 42 00 <32-byte key> → last 32 bytes
const pub32 = pubRaw.subarray(pubRaw.length - 32);
// PKCS#8 Ed25519 DER: ... 04 20 <32-byte seed> → last 32 bytes
const seed32 = privRaw.subarray(privRaw.length - 32);

// ── ssh-ed25519 public key blob ──
const pubBlob = Buffer.concat([str("ssh-ed25519"), str(pub32)]);
const pubLine = `ssh-ed25519 ${pubBlob.toString("base64")} ${COMMENT}`;

// ── openssh-key-v1 private key container (no passphrase) ──
const check = Buffer.alloc(4);
// random-ish checkints
check.writeUInt32BE((Math.random() * 0xffffffff) >>> 0);
const inner = Buffer.concat([
  check, check,
  str("ssh-ed25519"),
  str(pub32),                          // RAW 32-byte public key (not the blob!)
  str(Buffer.concat([seed32, pub32])), // private: seed || pub
  str(COMMENT),
]);
// padding 1..n to 8-byte block
const padLen = (8 - (inner.length % 8)) % 8;
const padded = Buffer.concat([inner, Buffer.from(Array.from({ length: padLen }, (_, i) => i + 1))]);

const privFile = Buffer.concat([
  Buffer.from("openssh-key-v1\0"),
  str("none"), str("none"), str(Buffer.alloc(0)),
  u32(1), str(pubBlob), str(padded),
]);
const privPem = `-----BEGIN OPENSSH PRIVATE KEY-----\n${privFile.toString("base64", 0, privFile.length).replace(/(.{70})/g, "$1\n").replace(/\n$/, "")}\n-----END OPENSSH PRIVATE KEY-----\n`;

// ── write files ──
const sshDir = join(homedir(), ".ssh");
mkdirSync(sshDir, { recursive: true });
const keyPath = join(sshDir, "id_ed25519_github");
writeFileSync(keyPath, privPem, { mode: 0o600 });
writeFileSync(keyPath + ".pub", pubLine + "\n", { mode: 0o644 });

// ssh config for github
const cfgPath = join(sshDir, "config");
let cfg = "";
if (existsSync(cfgPath)) cfg = readFileSync(cfgPath, "utf8");
if (!cfg.includes("Host github.com")) {
  appendFileSync(cfgPath, `Host github.com\n  HostName github.com\n  User git\n  IdentityFile ${keyPath}\n  IdentitiesOnly yes\n  StrictHostKeyChecking accept-new\n`);
}
chmodSync(keyPath, 0o600);
chmodSync(cfgPath, 0o600);

console.log("PRIVATE KEY:", keyPath);
console.log("PUBLIC KEY :", keyPath + ".pub");
console.log("");
console.log("=== PUBLIC KEY (paste as Deploy Key at github.com/JacobSeatlholo/internationalmaarifschools-demo/settings/keys) ===");
console.log(pubLine);

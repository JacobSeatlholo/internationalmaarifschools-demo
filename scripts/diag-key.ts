#!/usr/bin/env bun
/** Diagnose the generated OpenSSH private key structure. */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const pem = readFileSync(join(homedir(), ".ssh", "id_ed25519_github"), "utf8");
const b64 = pem.replace(/-----(BEGIN|END) OPENSSH PRIVATE KEY-----/g, "").replace(/\s+/g, "");
const buf = Buffer.from(b64, "base64");

let o = 0;
function u32() { const v = buf.readUInt32BE(o); o += 4; return v; }
function str() { const len = u32(); const s = buf.subarray(o, o + len); o += len; return s; }

console.log("magic:", buf.subarray(0, 15).toString(), "len:", buf.length);
o = 15;
console.log("cipher:", str().toString());
console.log("kdf:", str().toString());
const kdfOpts = str(); console.log("kdfopts len:", kdfOpts.length);
console.log("nkeys:", u32());
const pub = str(); console.log("pub blob len:", pub.length);
const priv = str(); console.log("priv section len:", priv.length);

// parse priv section
let p = 0;
const c1 = priv.readUInt32BE(0), c2 = priv.readUInt32BE(4); p = 8;
console.log("checkints equal:", c1 === c2, c1.toString(16));
function pstr(at) { const len = priv.readUInt32BE(at); return { len, data: priv.subarray(at + 4, at + 4 + len), next: at + 4 + len }; }
const kt = pstr(p); console.log("keytype:", kt.data.toString()); p = kt.next;
const pk = pstr(p); console.log("pub in priv len:", pk.len); p = pk.next;
const sk = pstr(p); console.log("priv in priv len:", sk.len); p = sk.next;
const cm = pstr(p); console.log("comment:", cm.data.toString()); p = cm.next;
console.log("padding bytes:", priv.subarray(p).toString("hex"), "count:", priv.length - p);
console.log("priv section mod 8:", priv.length % 8);

// try ssh2 parse for detailed error
try {
  const ssh2 = await import("ssh2");
  const k = ssh2.utils.parseKey(pem);
  console.log("ssh2 parse OK:", k ? "yes" : "null");
} catch (e) {
  console.log("ssh2 parse error:", e.message);
}

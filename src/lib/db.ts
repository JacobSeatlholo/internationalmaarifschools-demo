import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

/**
 * Vercel serverless compatibility shim
 * ─────────────────────────────────────
 * Lambda filesystems are read-only except /tmp, so the bundled seeded
 * SQLite database (db/custom.db, shipped via outputFileTracingIncludes)
 * is copied to /tmp on first use. DATABASE_URL is then pointed at the
 * absolute /tmp path — immune to schema-relative path resolution
 * differences between the build container and the runtime lambda.
 *
 * Warm invocations keep their /tmp copy, so demo writes persist while
 * the instance lives; cold starts re-seed from the bundled database.
 */
if (process.env.VERCEL) {
  try {
    const bundled = path.join(process.cwd(), 'db', 'custom.db')
    const target = '/tmp/custom.db'
    if (fs.existsSync(bundled) && !fs.existsSync(target)) {
      fs.copyFileSync(bundled, target)
    }
    if (fs.existsSync(target)) {
      process.env.DATABASE_URL = `file:${target}`
    }
  } catch {
    // fall through — Prisma will use whatever DATABASE_URL is set
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

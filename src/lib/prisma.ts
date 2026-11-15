import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  // If in cloud production but URL still points to local 127.0.0.1 / localhost, skip DB connect
  if ((process.env.VERCEL || process.env.NODE_ENV === "production") &&
      (url.includes("127.0.0.1") || url.includes("localhost"))) {
    return false;
  }
  return true;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/health
 * Comprueba que la app y la conexión a PostgreSQL funcionan.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      database: "connected",
    });
  } catch (e) {
    console.error("Health check failed:", e);
    return NextResponse.json(
      { ok: false, database: "disconnected", error: String(e) },
      { status: 503 }
    );
  }
}

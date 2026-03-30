import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

function contentTypeFromExt(ext: string): string {
  const e = ext.toLowerCase();
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  return "application/octet-stream";
}

type Params = { params: { file: string } };

export async function GET(_req: Request, { params }: Params) {
  const filename = String(params.file ?? "");
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return NextResponse.json({ ok: false, message: "Archivo no válido." }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", "services", filename);
  try {
    const buf = await fs.readFile(filePath);
    const ext = path.extname(filename);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentTypeFromExt(ext),
        // Evita caches agresivas durante la beta (especialmente tras subir).
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, message: "No encontrado." }, { status: 404 });
  }
}


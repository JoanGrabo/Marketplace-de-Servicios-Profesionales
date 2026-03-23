import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const MAX_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getExtension(mimeType: string): string {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "bin";
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "No autenticado." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("avatar");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Archivo no válido." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { ok: false, message: "Formato no permitido. Usa JPG, PNG o WEBP." },
      { status: 400 },
    );
  }
  if (file.size <= 0 || file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { ok: false, message: "La imagen debe pesar menos de 3MB." },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = getExtension(file.type);
  const filename = `${user.id}-${Date.now().toString(36)}.${ext}`;

  const relativeDir = "/uploads/avatars";
  const publicDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await fs.mkdir(publicDir, { recursive: true });
  const fullPath = path.join(publicDir, filename);
  await fs.writeFile(fullPath, buffer);

  const avatarUrl = `${relativeDir}/${filename}`;
  await prisma.profile.update({
    where: { id: user.id },
    data: { avatarUrl },
  });

  return NextResponse.json({ ok: true, avatarUrl });
}

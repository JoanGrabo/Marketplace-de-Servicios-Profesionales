import { NextResponse } from "next/server";

export async function POST(req: Request) {
  void req;
  return NextResponse.json(
    {
      ok: false,
      message:
        "Pagos por servicio desactivados temporalmente. Contacta con el profesional para acordar el encargo.",
    },
    { status: 410 },
  );
}


import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MiPerfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  redirect(`/profesionales/${encodeURIComponent(user.id)}`);
}


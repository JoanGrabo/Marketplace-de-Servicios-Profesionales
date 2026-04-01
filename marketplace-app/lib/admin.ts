import type { Profile } from "@prisma/client";

const ADMIN_EMAIL = "joangrabo@gmail.com";

export function isAdmin(user: Pick<Profile, "email"> | null | undefined): boolean {
  if (!user?.email) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL;
}


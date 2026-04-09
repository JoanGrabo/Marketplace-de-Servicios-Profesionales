-- Add social links + colegiado number to profiles
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "linkedin_url" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "instagram_url" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "x_url" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "colegiado_number" TEXT;


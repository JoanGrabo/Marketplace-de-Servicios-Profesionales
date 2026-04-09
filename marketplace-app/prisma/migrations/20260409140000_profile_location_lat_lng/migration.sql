-- Add location fields to profiles for radius search
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "location_label" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "location_lat" DOUBLE PRECISION;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "location_lng" DOUBLE PRECISION;


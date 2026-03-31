-- This migration expands the initial schema to match prisma/schema.prisma.

-- Expand profiles table
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "password_hash" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "display_name" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "headline" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatar_url" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "website_url" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "languages" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "years_experience" INTEGER;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "email_verified_at" TIMESTAMP(3);
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "auth_provider" TEXT;

UPDATE "profiles" SET "auth_provider" = 'credentials' WHERE "auth_provider" IS NULL;
ALTER TABLE "profiles" ALTER COLUMN "auth_provider" SET DEFAULT 'credentials';

-- Expand services table
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "subcategory" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "short_description" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "includes_text" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "requirements_text" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "thumbnail_url" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "gallery_urls" JSONB;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "fast_delivery_enabled" BOOLEAN;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "fast_delivery_extra_cents" INTEGER;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "is_promoted" BOOLEAN;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "promo_expires_at" TIMESTAMP(3);

UPDATE "services" SET "fast_delivery_enabled" = false WHERE "fast_delivery_enabled" IS NULL;
ALTER TABLE "services" ALTER COLUMN "fast_delivery_enabled" SET DEFAULT false;
ALTER TABLE "services" ALTER COLUMN "fast_delivery_enabled" SET NOT NULL;
UPDATE "services" SET "is_promoted" = false WHERE "is_promoted" IS NULL;
ALTER TABLE "services" ALTER COLUMN "is_promoted" SET DEFAULT false;
ALTER TABLE "services" ALTER COLUMN "is_promoted" SET NOT NULL;

-- Create email_verification_tokens
CREATE TABLE IF NOT EXISTS "email_verification_tokens" (
  "id" TEXT NOT NULL,
  "profile_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "consumed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- Create password_reset_tokens
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id" TEXT NOT NULL,
  "profile_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "consumed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- Create conversations
CREATE TABLE IF NOT EXISTS "conversations" (
  "id" TEXT NOT NULL,
  "service_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "professional_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- Create messages
CREATE TABLE IF NOT EXISTS "messages" (
  "id" TEXT NOT NULL,
  "conversation_id" TEXT NOT NULL,
  "sender_id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Create orders
CREATE TABLE IF NOT EXISTS "orders" (
  "id" TEXT NOT NULL,
  "service_id" TEXT NOT NULL,
  "buyer_id" TEXT NOT NULL,
  "seller_id" TEXT NOT NULL,
  "amount_cents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "stripe_checkout_session_id" TEXT,
  "stripe_payment_intent_id" TEXT,
  "paid_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "email_verification_tokens_token_hash_key" ON "email_verification_tokens"("token_hash");
CREATE INDEX IF NOT EXISTS "email_verification_tokens_profile_id_idx" ON "email_verification_tokens"("profile_id");

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_profile_id_idx" ON "password_reset_tokens"("profile_id");

CREATE INDEX IF NOT EXISTS "services_category_idx" ON "services"("category");
CREATE INDEX IF NOT EXISTS "services_is_promoted_promo_expires_at_idx" ON "services"("is_promoted", "promo_expires_at");

CREATE INDEX IF NOT EXISTS "conversations_client_id_idx" ON "conversations"("client_id");
CREATE INDEX IF NOT EXISTS "conversations_professional_id_idx" ON "conversations"("professional_id");
CREATE UNIQUE INDEX IF NOT EXISTS "conversations_service_id_client_id_professional_id_key" ON "conversations"("service_id", "client_id", "professional_id");

CREATE INDEX IF NOT EXISTS "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");
CREATE INDEX IF NOT EXISTS "messages_sender_id_idx" ON "messages"("sender_id");

CREATE UNIQUE INDEX IF NOT EXISTS "orders_stripe_checkout_session_id_key" ON "orders"("stripe_checkout_session_id");
CREATE UNIQUE INDEX IF NOT EXISTS "orders_stripe_payment_intent_id_key" ON "orders"("stripe_payment_intent_id");
CREATE INDEX IF NOT EXISTS "orders_service_id_idx" ON "orders"("service_id");
CREATE INDEX IF NOT EXISTS "orders_buyer_id_idx" ON "orders"("buyer_id");
CREATE INDEX IF NOT EXISTS "orders_seller_id_idx" ON "orders"("seller_id");
CREATE INDEX IF NOT EXISTS "orders_status_created_at_idx" ON "orders"("status", "created_at");

-- Foreign keys
DO $$
BEGIN
  ALTER TABLE "email_verification_tokens"
    ADD CONSTRAINT "email_verification_tokens_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "password_reset_tokens"
    ADD CONSTRAINT "password_reset_tokens_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "conversations"
    ADD CONSTRAINT "conversations_service_id_fkey"
    FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "conversations"
    ADD CONSTRAINT "conversations_client_id_fkey"
    FOREIGN KEY ("client_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "conversations"
    ADD CONSTRAINT "conversations_professional_id_fkey"
    FOREIGN KEY ("professional_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "messages"
    ADD CONSTRAINT "messages_conversation_id_fkey"
    FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "messages"
    ADD CONSTRAINT "messages_sender_id_fkey"
    FOREIGN KEY ("sender_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "orders"
    ADD CONSTRAINT "orders_service_id_fkey"
    FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "orders"
    ADD CONSTRAINT "orders_buyer_id_fkey"
    FOREIGN KEY ("buyer_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "orders"
    ADD CONSTRAINT "orders_seller_id_fkey"
    FOREIGN KEY ("seller_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

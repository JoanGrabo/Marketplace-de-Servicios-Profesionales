-- This migration expands the initial schema to match prisma/schema.prisma.

-- Expand profiles table
ALTER TABLE "profiles"
  ADD COLUMN "password_hash" TEXT,
  ADD COLUMN "display_name" TEXT,
  ADD COLUMN "headline" TEXT,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "avatar_url" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "website_url" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "languages" TEXT,
  ADD COLUMN "years_experience" INTEGER,
  ADD COLUMN "email_verified_at" TIMESTAMP(3),
  ADD COLUMN "auth_provider" TEXT NOT NULL DEFAULT 'credentials';

-- Expand services table
ALTER TABLE "services"
  ADD COLUMN "category" TEXT,
  ADD COLUMN "subcategory" TEXT,
  ADD COLUMN "short_description" TEXT,
  ADD COLUMN "includes_text" TEXT,
  ADD COLUMN "requirements_text" TEXT,
  ADD COLUMN "thumbnail_url" TEXT,
  ADD COLUMN "gallery_urls" JSONB,
  ADD COLUMN "fast_delivery_enabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "fast_delivery_extra_cents" INTEGER,
  ADD COLUMN "is_promoted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "promo_expires_at" TIMESTAMP(3);

-- Create email_verification_tokens
CREATE TABLE "email_verification_tokens" (
  "id" TEXT NOT NULL,
  "profile_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "consumed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- Create password_reset_tokens
CREATE TABLE "password_reset_tokens" (
  "id" TEXT NOT NULL,
  "profile_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "consumed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- Create conversations
CREATE TABLE "conversations" (
  "id" TEXT NOT NULL,
  "service_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "professional_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- Create messages
CREATE TABLE "messages" (
  "id" TEXT NOT NULL,
  "conversation_id" TEXT NOT NULL,
  "sender_id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "read_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Create orders
CREATE TABLE "orders" (
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
CREATE UNIQUE INDEX "email_verification_tokens_token_hash_key" ON "email_verification_tokens"("token_hash");
CREATE INDEX "email_verification_tokens_profile_id_idx" ON "email_verification_tokens"("profile_id");

CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");
CREATE INDEX "password_reset_tokens_profile_id_idx" ON "password_reset_tokens"("profile_id");

CREATE INDEX "services_category_idx" ON "services"("category");
CREATE INDEX "services_is_promoted_promo_expires_at_idx" ON "services"("is_promoted", "promo_expires_at");

CREATE INDEX "conversations_client_id_idx" ON "conversations"("client_id");
CREATE INDEX "conversations_professional_id_idx" ON "conversations"("professional_id");
CREATE UNIQUE INDEX "conversations_service_id_client_id_professional_id_key" ON "conversations"("service_id", "client_id", "professional_id");

CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

CREATE UNIQUE INDEX "orders_stripe_checkout_session_id_key" ON "orders"("stripe_checkout_session_id");
CREATE UNIQUE INDEX "orders_stripe_payment_intent_id_key" ON "orders"("stripe_payment_intent_id");
CREATE INDEX "orders_service_id_idx" ON "orders"("service_id");
CREATE INDEX "orders_buyer_id_idx" ON "orders"("buyer_id");
CREATE INDEX "orders_seller_id_idx" ON "orders"("seller_id");
CREATE INDEX "orders_status_created_at_idx" ON "orders"("status", "created_at");

-- Foreign keys
ALTER TABLE "email_verification_tokens"
  ADD CONSTRAINT "email_verification_tokens_profile_id_fkey"
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "password_reset_tokens"
  ADD CONSTRAINT "password_reset_tokens_profile_id_fkey"
  FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conversations"
  ADD CONSTRAINT "conversations_service_id_fkey"
  FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conversations"
  ADD CONSTRAINT "conversations_client_id_fkey"
  FOREIGN KEY ("client_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conversations"
  ADD CONSTRAINT "conversations_professional_id_fkey"
  FOREIGN KEY ("professional_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "messages"
  ADD CONSTRAINT "messages_conversation_id_fkey"
  FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "messages"
  ADD CONSTRAINT "messages_sender_id_fkey"
  FOREIGN KEY ("sender_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "orders"
  ADD CONSTRAINT "orders_service_id_fkey"
  FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "orders"
  ADD CONSTRAINT "orders_buyer_id_fkey"
  FOREIGN KEY ("buyer_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "orders"
  ADD CONSTRAINT "orders_seller_id_fkey"
  FOREIGN KEY ("seller_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Reviews table (ratings for conversations)
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" TEXT NOT NULL,
  "conversation_id" TEXT NOT NULL,
  "service_id" TEXT NOT NULL,
  "buyer_id" TEXT NOT NULL,
  "seller_id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "reviews_conversation_id_key" ON "reviews"("conversation_id");
CREATE INDEX IF NOT EXISTS "reviews_seller_id_created_at_idx" ON "reviews"("seller_id", "created_at");
CREATE INDEX IF NOT EXISTS "reviews_service_id_created_at_idx" ON "reviews"("service_id", "created_at");

DO $$
BEGIN
  ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_conversation_id_fkey"
    FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_service_id_fkey"
    FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_buyer_id_fkey"
    FOREIGN KEY ("buyer_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "reviews"
    ADD CONSTRAINT "reviews_seller_id_fkey"
    FOREIGN KEY ("seller_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;


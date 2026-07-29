ALTER TABLE "Photo" ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL DEFAULT 'New Memory';
ALTER TABLE "Photo" ADD COLUMN IF NOT EXISTS "archiveNote" TEXT;

UPDATE "Photo"
SET "title" = COALESCE(NULLIF("caption", ''), "title")
WHERE "caption" IS NOT NULL;

ALTER TABLE "Photo" DROP COLUMN IF EXISTS "caption";

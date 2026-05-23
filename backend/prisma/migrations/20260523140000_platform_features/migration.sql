-- AlterTable College
ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "logo" TEXT;
ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "banner" TEXT;
ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "campusImages" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "acceptedExams" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "College" ADD COLUMN IF NOT EXISTS "cutoffRank" INTEGER;

UPDATE "College" SET "slug" = 'college-' || "id"::text WHERE "slug" IS NULL;
ALTER TABLE "College" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "College_slug_key" ON "College"("slug");

-- AlterTable User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;

-- CreateTable Review
CREATE TABLE IF NOT EXISTS "Review" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable Question
CREATE TABLE IF NOT EXISTS "Question" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable Answer
CREATE TABLE IF NOT EXISTS "Answer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" INTEGER,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable SavedCollege
CREATE TABLE IF NOT EXISTS "SavedCollege" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "collegeId" INTEGER NOT NULL,
    CONSTRAINT "SavedCollege_pkey" PRIMARY KEY ("id")
);

-- CreateTable SavedComparison
CREATE TABLE IF NOT EXISTS "SavedComparison" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT,
    "collegeIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedComparison_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SavedCollege_userId_collegeId_key" ON "SavedCollege"("userId", "collegeId");

ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_collegeId_fkey";
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Question" DROP CONSTRAINT IF EXISTS "Question_userId_fkey";
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Answer" DROP CONSTRAINT IF EXISTS "Answer_questionId_fkey";
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Answer" DROP CONSTRAINT IF EXISTS "Answer_userId_fkey";
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SavedCollege" DROP CONSTRAINT IF EXISTS "SavedCollege_userId_fkey";
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SavedCollege" DROP CONSTRAINT IF EXISTS "SavedCollege_collegeId_fkey";
ALTER TABLE "SavedCollege" ADD CONSTRAINT "SavedCollege_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SavedComparison" DROP CONSTRAINT IF EXISTS "SavedComparison_userId_fkey";
ALTER TABLE "SavedComparison" ADD CONSTRAINT "SavedComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

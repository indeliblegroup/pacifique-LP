/*
  Warnings:

  - You are about to drop the column `completedAt` on the `MediationSession` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `MediationSession` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `MediationSession` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `MediationSession` table. All the data in the column will be lost.
  - Added the required column `sessionDate` to the `MediationSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MediationSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "sessionDate" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT,
    "type" TEXT NOT NULL DEFAULT 'JOINT',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "outcome" TEXT,
    "conductedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MediationSession_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MediationSession_conductedById_fkey" FOREIGN KEY ("conductedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MediationSession" ("caseId", "createdAt", "duration", "id", "location", "notes", "updatedAt") SELECT "caseId", "createdAt", "duration", "id", "location", "notes", "updatedAt" FROM "MediationSession";
DROP TABLE "MediationSession";
ALTER TABLE "new_MediationSession" RENAME TO "MediationSession";
CREATE INDEX "MediationSession_caseId_idx" ON "MediationSession"("caseId");
CREATE INDEX "MediationSession_sessionDate_idx" ON "MediationSession"("sessionDate");
CREATE INDEX "MediationSession_conductedById_idx" ON "MediationSession"("conductedById");
CREATE INDEX "MediationSession_status_idx" ON "MediationSession"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

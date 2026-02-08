-- CreateTable
CREATE TABLE "Manifest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manifestRef" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "closedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "awb" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "consigneeName" TEXT NOT NULL,
    "consigneePhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "weight" REAL,
    "serviceType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cancellationReason" TEXT,
    "isDelayed" BOOLEAN NOT NULL DEFAULT false,
    "isRTO" BOOLEAN NOT NULL DEFAULT false,
    "podUrl" TEXT,
    "podSignature" TEXT,
    "manifestId" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_manifestId_fkey" FOREIGN KEY ("manifestId") REFERENCES "Manifest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Shipment" ("address", "awb", "cancellationReason", "consigneeName", "consigneePhone", "createdAt", "id", "isDelayed", "isLocked", "isRTO", "manifestId", "orderId", "podSignature", "podUrl", "serviceType", "status", "updatedAt", "weight") SELECT "address", "awb", "cancellationReason", "consigneeName", "consigneePhone", "createdAt", "id", "isDelayed", "isLocked", "isRTO", "manifestId", "orderId", "podSignature", "podUrl", "serviceType", "status", "updatedAt", "weight" FROM "Shipment";
DROP TABLE "Shipment";
ALTER TABLE "new_Shipment" RENAME TO "Shipment";
CREATE UNIQUE INDEX "Shipment_awb_key" ON "Shipment"("awb");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Manifest_manifestRef_key" ON "Manifest"("manifestRef");

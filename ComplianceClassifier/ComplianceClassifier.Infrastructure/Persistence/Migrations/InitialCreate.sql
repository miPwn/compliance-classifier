-- Create database if it doesn't exist
-- Note: This needs to be run as a separate command in PostgreSQL
-- CREATE DATABASE "comp-filer";

-- Connect to the database
-- \c "comp-filer"

-- Create tables
CREATE TABLE IF NOT EXISTS "Batches" (
    "BatchId" UUID NOT NULL,
    "UploadDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UserId" TEXT NOT NULL,
    "Status" INTEGER NOT NULL,
    "TotalDocuments" INTEGER NOT NULL,
    "ProcessedDocuments" INTEGER NOT NULL,
    "CompletionDate" TIMESTAMP WITH TIME ZONE NULL,
    CONSTRAINT "PK_Batches" PRIMARY KEY ("BatchId")
);

CREATE TABLE IF NOT EXISTS "Documents" (
    "DocumentId" UUID NOT NULL,
    "FileName" TEXT NOT NULL,
    "FileType" INTEGER NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "UploadDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Content" TEXT NOT NULL,
    "Status" INTEGER NOT NULL,
    "BatchId" UUID NOT NULL,
    "Metadata_PageCount" INTEGER NULL,
    "Metadata_Author" TEXT NULL,
    "Metadata_CreationDate" TIMESTAMP WITH TIME ZONE NULL,
    "Metadata_ModificationDate" TIMESTAMP WITH TIME ZONE NULL,
    "Metadata_Keywords" TEXT[] NULL,
    CONSTRAINT "PK_Documents" PRIMARY KEY ("DocumentId"),
    CONSTRAINT "FK_Documents_Batches_BatchId" FOREIGN KEY ("BatchId") REFERENCES "Batches" ("BatchId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Classifications" (
    "ClassificationId" UUID NOT NULL,
    "DocumentId" UUID NOT NULL,
    "Category" INTEGER NOT NULL,
    "RiskLevel" INTEGER NOT NULL,
    "Summary" TEXT NOT NULL,
    "ClassificationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "ClassifiedBy" TEXT NOT NULL,
    "ConfidenceScore" NUMERIC NOT NULL,
    "IsOverridden" BOOLEAN NOT NULL,
    CONSTRAINT "PK_Classifications" PRIMARY KEY ("ClassificationId"),
    CONSTRAINT "FK_Classifications_Documents_DocumentId" FOREIGN KEY ("DocumentId") REFERENCES "Documents" ("DocumentId") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Reports" (
    "ReportId" UUID NOT NULL,
    "BatchId" UUID NULL,
    "DocumentId" UUID NULL,
    "GenerationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "ReportType" INTEGER NOT NULL,
    "FilePath" TEXT NOT NULL,
    CONSTRAINT "PK_Reports" PRIMARY KEY ("ReportId"),
    CONSTRAINT "FK_Reports_Batches_BatchId" FOREIGN KEY ("BatchId") REFERENCES "Batches" ("BatchId"),
    CONSTRAINT "FK_Reports_Documents_DocumentId" FOREIGN KEY ("DocumentId") REFERENCES "Documents" ("DocumentId")
);

-- Create indexes
CREATE INDEX "IX_Documents_BatchId" ON "Documents" ("BatchId");
CREATE UNIQUE INDEX "IX_Classifications_DocumentId" ON "Classifications" ("DocumentId");
CREATE INDEX "IX_Reports_BatchId" ON "Reports" ("BatchId");
CREATE INDEX "IX_Reports_DocumentId" ON "Reports" ("DocumentId");

-- Enum values reference (for documentation purposes)
-- BatchStatus: 0 = Pending, 1 = Processing, 2 = Completed, 3 = Error
-- DocumentStatus: 0 = Pending, 1 = Processing, 2 = Classified, 3 = Error
-- CategoryType: 0 = DataPrivacy, 1 = FinancialReporting, 2 = WorkplaceConduct, 3 = HealthCompliance, 4 = Other
-- RiskLevel: 0 = Low, 1 = Medium, 2 = High
-- FileType: 0 = PDF, 1 = DOCX, 2 = TXT
-- ReportType: 0 = SingleDocument, 1 = BatchSummary

-- Script to create all necessary tables for the Compliance Classifier application
-- Database: comp-filer
-- Connection details:
-- Host: 192.168.1.106
-- Port: 5432
-- Username: vault66admin
-- Password: sQ63370

-- Create enum types
CREATE TYPE  "FileType" AS ENUM ('PDF', 'DOCX', 'TXT');
CREATE TYPE  "DocumentStatus" AS ENUM ('Pending', 'Processing', 'Classified', 'Error');
CREATE TYPE  "BatchStatus" AS ENUM ('Pending', 'Processing', 'Completed', 'Error');
CREATE TYPE  "CategoryType" AS ENUM ('DataPrivacy', 'FinancialReporting', 'WorkplaceConduct', 'HealthCompliance', 'Other');
CREATE TYPE  "RiskLevel" AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE  "ReportType" AS ENUM ('SingleDocument', 'BatchSummary');

-- Create Users table
CREATE TABLE "Users" (
    "Id" UUID PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(100) NOT NULL,
    "Roles" TEXT[], -- Array of roles
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP NULL,
    CONSTRAINT "UQ_Users_Username" UNIQUE ("Username"),
    CONSTRAINT "UQ_Users_Email" UNIQUE ("Email")
);

-- Create UserPasswords table
CREATE TABLE "UserPasswords" (
    "UserId" UUID PRIMARY KEY,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP NULL,
    CONSTRAINT "FK_UserPasswords_Users" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Create RefreshTokens table
CREATE TABLE "RefreshTokens" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" UUID NOT NULL,
    "Token" VARCHAR(255) NOT NULL,
    "Expires" TIMESTAMP NOT NULL,
    "Created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Revoked" TIMESTAMP NULL,
    CONSTRAINT "FK_RefreshTokens_Users" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- *Create Batches table
CREATE TABLE "Batches" (
    "BatchId" UUID PRIMARY KEY,
    "UploadDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" VARCHAR(255) NOT NULL,
    "Status" "BatchStatus" NOT NULL DEFAULT 'Pending',
    "TotalDocuments" INT NOT NULL DEFAULT 0,
    "ProcessedDocuments" INT NOT NULL DEFAULT 0,
    "CompletionDate" TIMESTAMP NULL
);

-- *Create Documents table
CREATE TABLE "Documents" (
    "DocumentId" UUID PRIMARY KEY,
    "FileName" VARCHAR(255) NOT NULL,
    "FileType" "FileType" NOT NULL,
    "FileSize" BIGINT NOT NULL,
    "UploadDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Content" TEXT NULL,
    "Status" "DocumentStatus" NOT NULL DEFAULT 'Pending',
    "BatchId" UUID NOT NULL,
    CONSTRAINT "FK_Documents_Batches" FOREIGN KEY ("BatchId") REFERENCES "Batches" ("BatchId") ON DELETE CASCADE
);

-- Create DocumentMetadata table
CREATE TABLE "DocumentMetadata" (
    "DocumentMetadataId" UUID PRIMARY KEY,
    "DocumentId" UUID NOT NULL,
    "PageCount" INT NULL,
    "Author" VARCHAR(255) NULL,
    "CreationDate" TIMESTAMP NULL,
    "ModificationDate" TIMESTAMP NULL,
    "Keywords" VARCHAR(1000) NULL,
    CONSTRAINT "FK_DocumentMetadata_Documents" FOREIGN KEY ("DocumentId") REFERENCES "Documents" ("DocumentId") ON DELETE CASCADE
);

-- *Create Classifications table
CREATE TABLE "Classifications" (
    "ClassificationId" UUID PRIMARY KEY,
    "DocumentId" UUID NOT NULL,
    "Category" "CategoryType" NOT NULL,
    "RiskLevel" "RiskLevel" NOT NULL,
    "Summary" VARCHAR(2000) NOT NULL,
    "ClassificationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ClassifiedBy" VARCHAR(255) NOT NULL,
    "ConfidenceScore" DECIMAL(5,4) NOT NULL,
    "IsOverridden" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "FK_Classifications_Documents" FOREIGN KEY ("DocumentId") REFERENCES "Documents" ("DocumentId") ON DELETE CASCADE
);

-- *Create Reports table
CREATE TABLE "Reports" (
    "ReportId" UUID PRIMARY KEY,
    "BatchId" UUID NULL,
    "DocumentId" UUID NULL,
    "GenerationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ReportType" "ReportType" NOT NULL,
    "FilePath" VARCHAR(1000) NOT NULL,
    CONSTRAINT "FK_Reports_Batches" FOREIGN KEY ("BatchId") REFERENCES "Batches" ("BatchId"),
    CONSTRAINT "FK_Reports_Documents" FOREIGN KEY ("DocumentId") REFERENCES "Documents" ("DocumentId"),
    CONSTRAINT "CK_Reports_BatchOrDocument" CHECK (("BatchId" IS NOT NULL AND "DocumentId" IS NULL) OR ("BatchId" IS NULL AND "DocumentId" IS NOT NULL))
);

-- Create indexes for better performance
CREATE INDEX "IX_Documents_BatchId" ON "Documents" ("BatchId");
CREATE INDEX "IX_Documents_Status" ON "Documents" ("Status");
CREATE INDEX "IX_Documents_UploadDate" ON "Documents" ("UploadDate");

CREATE INDEX "IX_Classifications_DocumentId" ON "Classifications" ("DocumentId");
CREATE INDEX "IX_Classifications_Category" ON "Classifications" ("Category");
CREATE INDEX "IX_Classifications_RiskLevel" ON "Classifications" ("RiskLevel");

CREATE INDEX "IX_Batches_Status" ON "Batches" ("Status");
CREATE INDEX "IX_Batches_UploadDate" ON "Batches" ("UploadDate");
CREATE INDEX "IX_Batches_UserId" ON "Batches" ("UserId");

CREATE INDEX "IX_Reports_BatchId" ON "Reports" ("BatchId");
CREATE INDEX "IX_Reports_DocumentId" ON "Reports" ("DocumentId");
CREATE INDEX "IX_Reports_GenerationDate" ON "Reports" ("GenerationDate");

-- Create a default admin user (optional)
-- INSERT INTO "Users" ("Id", "Username", "Email", "FirstName", "LastName", "Roles")
-- VALUES (
--     gen_random_uuid(),
--     'admin',
--     'admin@example.com',
--     'Admin',
--     'User',
--     ARRAY['admin']
-- );









# Compliance Document Classifier - System Specification

## 1. System Overview

The Compliance Document Classifier is a proof-of-concept application designed to automate the classification, risk assessment, and summarization of compliance-related documents. The system ingests various document formats, leverages AI to analyze content, and produces structured reports to aid compliance officers in managing regulatory documentation.

### 1.1 Core Capabilities

- Document ingestion (.txt, .pdf, .docx)
- AI-powered document classification
- Risk level assessment
- Summary generation
- PDF report creation
- Batch processing
- Manual review and override

### 1.2 Technical Stack

- **Frontend**: Angular 17 with PrimeNG 16
- **Backend**: .NET Core 8 Web API
- **PDF Generation**: QuestPDF
- **AI Classification**: OpenAI GPT-4 Turbo or Anthropic Claude v2
- **Database**: SQL Server (document metadata and classification results)
- **Storage**: File system or blob storage for document files

## 2. Domain Model (DDD Approach)

### 2.1 Core Domain

#### 2.1.1 Aggregates

**Document Aggregate**
```
Document (Aggregate Root)
  - DocumentId: Guid (Identity)
  - FileName: string
  - FileType: enum (PDF, DOCX, TXT)
  - FileSize: long
  - UploadDate: DateTime
  - Content: string (extracted text)
  - Status: enum (Pending, Processing, Classified, Error)
  - BatchId: Guid (reference to Batch)
```

**Classification Aggregate**
```
Classification (Aggregate Root)
  - ClassificationId: Guid (Identity)
  - DocumentId: Guid (reference to Document)
  - Category: enum (DataPrivacy, FinancialReporting, WorkplaceConduct, HealthCompliance, Other)
  - RiskLevel: enum (Low, Medium, High)
  - Summary: string (200-word AI-generated summary)
  - ClassificationDate: DateTime
  - ClassifiedBy: string (AI model or user for overrides)
  - ConfidenceScore: decimal (AI confidence in classification)
  - IsOverridden: bool (indicates manual override)
```

**Batch Aggregate**
```
Batch (Aggregate Root)
  - BatchId: Guid (Identity)
  - UploadDate: DateTime
  - UserId: string
  - Status: enum (Pending, Processing, Completed, Error)
  - TotalDocuments: int
  - ProcessedDocuments: int
  - CompletionDate: DateTime?
```

**Report Aggregate**
```
Report (Aggregate Root)
  - ReportId: Guid (Identity)
  - BatchId: Guid? (optional, for batch reports)
  - DocumentId: Guid? (optional, for single document reports)
  - GenerationDate: DateTime
  - ReportType: enum (SingleDocument, BatchSummary)
  - FilePath: string (location of generated PDF)
```

#### 2.1.2 Value Objects

```
DocumentMetadata
  - PageCount: int
  - Author: string
  - CreationDate: DateTime
  - ModificationDate: DateTime
  - Keywords: List<string>

AIModelConfig
  - ModelName: string (e.g., "gpt-4-turbo", "claude-v2")
  - Temperature: decimal
  - MaxTokens: int
  - PromptTemplate: string
```

#### 2.1.3 Domain Services

```
DocumentClassificationService
  - ClassifyDocument(Document): Classification
  - AssignRiskLevel(Document, Classification): RiskLevel
  - GenerateSummary(Document): string

DocumentProcessingService
  - ExtractText(Document): string
  - ValidateDocument(Document): bool
  - EnrichMetadata(Document): DocumentMetadata

ReportGenerationService
  - GenerateSingleReport(Document, Classification): Report
  - GenerateBatchReport(Batch, List<Classification>): Report
```

### 2.2 Domain Events

```
DocumentUploadedEvent
DocumentClassifiedEvent
BatchCompletedEvent
ClassificationOverriddenEvent
ReportGeneratedEvent
```

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Angular 17     │────▶│  .NET Core 8    │────▶│  AI Service     │
│  Frontend       │     │  Web API        │     │  (GPT-4/Claude) │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                      │
        │                        │                      │
        ▼                        ▼                      ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Document       │     │  SQL Server     │     │  QuestPDF       │
│  Storage        │     │  Database       │     │  Report Engine  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 3.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (Angular 17 + PrimeNG 16)                              │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ Upload        │  │ Results       │  │ Report        │        │
│  │ Component     │  │ Component     │  │ Component     │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Backend (.NET Core 8 Web API)                                   │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ Document      │  │ Classification │  │ Report        │        │
│  │ Controller    │  │ Controller     │  │ Controller    │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ Document      │  │ Classification │  │ Report        │        │
│  │ Service       │  │ Service        │  │ Service       │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ Document      │  │ Classification │  │ Report        │        │
│  │ Repository    │  │ Repository     │  │ Repository    │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ External Services                                               │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │ AI Service    │  │ Document      │  │ PDF           │        │
│  │ Adapter       │  │ Parser        │  │ Generator     │        │
│  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

## 4. Frontend Components

### 4.1 Upload Component

Responsible for document batch uploading via drag-and-drop interface.

#### Pseudocode with TDD Anchors

```typescript
// upload.component.ts

/**
 * @class UploadComponent
 * @description Handles document batch uploading via drag-and-drop
 * 
 * @TDD_TC01 - Should allow single file upload
 * @TDD_TC02 - Should allow multiple file upload
 * @TDD_TC03 - Should validate file types (.txt, .pdf, .docx)
 * @TDD_TC04 - Should validate file size (max 10MB)
 * @TDD_TC05 - Should display upload progress
 * @TDD_TC06 - Should handle upload errors gracefully
 */
class UploadComponent {
  // Properties
  acceptedFileTypes: string[] = ['.txt', '.pdf', '.docx'];
  maxFileSize: number = 10 * 1024 * 1024; // 10MB
  files: File[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;
  batchId: string | null = null;
  
  // Methods
  
  /**
   * Handles files dropped in the drop zone
   * @param files Files dropped by user
   */
  onFileDrop(files: FileList): void {
    // Validate file types and sizes
    // Add valid files to the files array
    // Display error for invalid files
  }
  
  /**
   * Validates a single file
   * @param file File to validate
   * @returns Boolean indicating if file is valid
   */
  validateFile(file: File): boolean {
    // Check file type
    // Check file size
    // Return validation result
  }
  
  /**
   * Initiates the upload process for all files
   */
  uploadFiles(): void {
    // Set isUploading to true
    // Create a new FormData object
    // Add all files to FormData
    // Call the DocumentService to upload files
    // Handle progress updates
    // Handle completion
    // Handle errors
  }
  
  /**
   * Removes a file from the upload list
   * @param index Index of file to remove
   */
  removeFile(index: number): void {
    // Remove file at specified index
  }
  
  /**
   * Clears all files from the upload list
   */
  clearFiles(): void {
    // Clear files array
  }
}
```

### 4.2 Results Component

Displays classification results in a table with filtering, sorting, and override capabilities.

#### Pseudocode with TDD Anchors

```typescript
// results.component.ts

/**
 * @class ResultsComponent
 * @description Displays classification results with filtering and override capabilities
 * 
 * @TDD_TC01 - Should load and display classification results
 * @TDD_TC02 - Should allow filtering by category
 * @TDD_TC03 - Should allow filtering by risk level
 * @TDD_TC04 - Should allow sorting by any column
 * @TDD_TC05 - Should allow manual override of classification
 * @TDD_TC06 - Should allow manual override of risk level
 * @TDD_TC07 - Should allow downloading individual reports
 * @TDD_TC08 - Should allow downloading batch report
 */
class ResultsComponent {
  // Properties
  classifications: Classification[] = [];
  filteredClassifications: Classification[] = [];
  categories: string[] = ['Data Privacy', 'Financial Reporting', 'Workplace Conduct', 'Health Compliance', 'Other'];
  riskLevels: string[] = ['Low', 'Medium', 'High'];
  selectedBatchId: string | null = null;
  isLoading: boolean = false;
  
  // Methods
  
  /**
   * Loads classifications for a specific batch
   * @param batchId ID of the batch to load
   */
  loadClassifications(batchId: string): void {
    // Set isLoading to true
    // Call ClassificationService to get classifications
    // Update classifications array
    // Apply initial filtering
    // Set isLoading to false
  }
  
  /**
   * Filters classifications based on selected criteria
   * @param category Optional category filter
   * @param riskLevel Optional risk level filter
   */
  filterClassifications(category?: string, riskLevel?: string): void {
    // Apply filters to classifications array
    // Update filteredClassifications
  }
  
  /**
   * Handles manual override of classification
   * @param classificationId ID of classification to override
   * @param newCategory New category value
   */
  overrideCategory(classificationId: string, newCategory: string): void {
    // Call ClassificationService to update category
    // Update local data
    // Display success message
  }
  
  /**
   * Handles manual override of risk level
   * @param classificationId ID of classification to override
   * @param newRiskLevel New risk level value
   */
  overrideRiskLevel(classificationId: string, newRiskLevel: string): void {
    // Call ClassificationService to update risk level
    // Update local data
    // Display success message
  }
  
  /**
   * Generates and downloads report for a single document
   * @param documentId ID of document to generate report for
   */
  downloadSingleReport(documentId: string): void {
    // Call ReportService to generate report
    // Handle download of generated PDF
  }
  
  /**
   * Generates and downloads report for entire batch
   */
  downloadBatchReport(): void {
    // Call ReportService to generate batch report
    // Handle download of generated PDF
  }
}
```

### 4.3 Report Component

Displays generated reports with options to view, download, and share.

#### Pseudocode with TDD Anchors

```typescript
// report.component.ts

/**
 * @class ReportComponent
 * @description Displays generated reports with view, download, and share options
 * 
 * @TDD_TC01 - Should display report metadata
 * @TDD_TC02 - Should render PDF preview
 * @TDD_TC03 - Should allow downloading report
 * @TDD_TC04 - Should allow sharing report via email
 * @TDD_TC05 - Should display report generation history
 */
class ReportComponent {
  // Properties
  reportId: string | null = null;
  report: Report | null = null;
  isLoading: boolean = false;
  pdfUrl: string | null = null;
  
  // Methods
  
  /**
   * Loads report details
   * @param reportId ID of report to load
   */
  loadReport(reportId: string): void {
    // Set isLoading to true
    // Call ReportService to get report details
    // Update report object
    // Set pdfUrl for preview
    // Set isLoading to false
  }
  
  /**
   * Downloads the report PDF
   */
  downloadReport(): void {
    // Call ReportService to get download URL
    // Trigger browser download
  }
  
  /**
   * Shares report via email
   * @param email Email address to share with
   */
  shareReport(email: string): void {
    // Call ReportService to share report
    // Display success message
  }
  
  /**
   * Loads report generation history
   */
  loadReportHistory(): void {
    // Call ReportService to get history
    // Update history list
  }
}
```

## 5. Backend Services

### 5.1 Document Service

Handles document upload, storage, and text extraction.

#### Pseudocode with TDD Anchors

```csharp
// DocumentService.cs

/**
 * Document service responsible for handling document operations
 * 
 * @TDD_TC01 - Should create new batch for uploaded documents
 * @TDD_TC02 - Should store uploaded documents
 * @TDD_TC03 - Should extract text from PDF documents
 * @TDD_TC04 - Should extract text from DOCX documents
 * @TDD_TC05 - Should extract text from TXT documents
 * @TDD_TC06 - Should handle extraction errors gracefully
 * @TDD_TC07 - Should update document status throughout processing
 */
public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IBatchRepository _batchRepository;
    private readonly IDocumentParser _documentParser;
    
    /**
     * Creates a new batch for document processing
     * @param userId User initiating the batch
     * @returns Batch ID
     */
    public async Task<Guid> CreateBatchAsync(string userId)
    {
        // Create new Batch entity
        // Set initial properties (Status = Pending, etc.)
        // Save to repository
        // Return BatchId
    }
    
    /**
     * Uploads documents to a batch
     * @param batchId Batch ID
     * @param files Collection of files to upload
     * @returns List of created document IDs
     */
    public async Task<IEnumerable<Guid>> UploadDocumentsAsync(Guid batchId, IEnumerable<IFormFile> files)
    {
        // Validate batch exists
        // Create Document entities for each file
        // Store files in file system or blob storage
        // Save document metadata to repository
        // Update batch with document count
        // Return list of document IDs
    }
    
    /**
     * Extracts text content from a document
     * @param documentId Document ID
     * @returns Extracted text content
     */
    public async Task<string> ExtractTextAsync(Guid documentId)
    {
        // Get document from repository
        // Update status to Processing
        // Use appropriate parser based on file type
        // Extract text content
        // Update document with extracted content
        // Update status to Processed
        // Return extracted text
    }
    
    /**
     * Gets document details
     * @param documentId Document ID
     * @returns Document details
     */
    public async Task<DocumentDto> GetDocumentAsync(Guid documentId)
    {
        // Get document from repository
        // Map to DTO
        // Return DTO
    }
    
    /**
     * Gets all documents in a batch
     * @param batchId Batch ID
     * @returns List of documents in batch
     */
    public async Task<IEnumerable<DocumentDto>> GetBatchDocumentsAsync(Guid batchId)
    {
        // Get documents from repository
        // Map to DTOs
        // Return DTOs
    }
}
```

### 5.2 Classification Service

Handles AI-based document classification, risk assessment, and summary generation.

#### Pseudocode with TDD Anchors

```csharp
// ClassificationService.cs

/**
 * Classification service responsible for AI-based document analysis
 * 
 * @TDD_TC01 - Should classify document into correct category
 * @TDD_TC02 - Should assign appropriate risk level
 * @TDD_TC03 - Should generate concise summary
 * @TDD_TC04 - Should handle AI service errors gracefully
 * @TDD_TC05 - Should allow manual override of classification
 * @TDD_TC06 - Should process batch of documents efficiently
 */
public class ClassificationService : IClassificationService
{
    private readonly IClassificationRepository _classificationRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IAIService _aiService;
    
    /**
     * Classifies a document using AI
     * @param documentId Document ID
     * @returns Classification result
     */
    public async Task<ClassificationDto> ClassifyDocumentAsync(Guid documentId)
    {
        // Get document from repository
        // Prepare document content for AI analysis
        // Call AI service for classification
        // Create Classification entity
        // Save to repository
        // Return classification DTO
    }
    
    /**
     * Processes a batch of documents for classification
     * @param batchId Batch ID
     * @returns Task representing the operation
     */
    public async Task ProcessBatchAsync(Guid batchId)
    {
        // Get all documents in batch
        // Process each document sequentially or in parallel
        // Update batch status as processing progresses
        // Handle errors for individual documents
        // Mark batch as completed when all documents are processed
    }
    
    /**
     * Overrides a classification manually
     * @param classificationId Classification ID
     * @param category New category
     * @param riskLevel New risk level
     * @param summary New summary (optional)
     * @returns Updated classification
     */
    public async Task<ClassificationDto> OverrideClassificationAsync(
        Guid classificationId, 
        string category, 
        string riskLevel, 
        string summary = null)
    {
        // Get classification from repository
        // Update properties
        // Mark as overridden
        // Save changes
        // Return updated classification DTO
    }
    
    /**
     * Gets classification for a document
     * @param documentId Document ID
     * @returns Classification details
     */
    public async Task<ClassificationDto> GetClassificationAsync(Guid documentId)
    {
        // Get classification from repository
        // Map to DTO
        // Return DTO
    }
    
    /**
     * Gets all classifications in a batch
     * @param batchId Batch ID
     * @returns List of classifications in batch
     */
    public async Task<IEnumerable<ClassificationDto>> GetBatchClassificationsAsync(Guid batchId)
    {
        // Get classifications from repository
        // Map to DTOs
        // Return DTOs
    }
}
```

### 5.3 AI Service

Integrates with OpenAI GPT-4 or Anthropic Claude for document analysis.

#### Pseudocode with TDD Anchors

```csharp
// AIService.cs

/**
 * AI service responsible for integrating with LLM providers
 * 
 * @TDD_TC01 - Should connect to OpenAI API successfully
 * @TDD_TC02 - Should connect to Anthropic API successfully
 * @TDD_TC03 - Should classify document text correctly
 * @TDD_TC04 - Should generate appropriate risk level
 * @TDD_TC05 - Should generate concise summary
 * @TDD_TC06 - Should handle API rate limiting
 * @TDD_TC07 - Should handle API errors gracefully
 */
public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly AIModelConfig _modelConfig;
    
    /**
     * Analyzes document content using AI
     * @param documentText Document text content
     * @returns AI analysis result
     */
    public async Task<AIAnalysisResult> AnalyzeDocumentAsync(string documentText)
    {
        // Prepare prompt for AI model
        // Call appropriate AI service (OpenAI or Anthropic)
        // Parse response
        // Extract category, risk level, and summary
        // Return structured result
    }
    
    /**
     * Calls OpenAI API for document analysis
     * @param prompt Prepared prompt
     * @returns Raw API response
     */
    private async Task<string> CallOpenAIAsync(string prompt)
    {
        // Prepare API request
        // Send request to OpenAI
        // Handle rate limiting (retry with backoff)
        // Parse and return response
    }
    
    /**
     * Calls Anthropic API for document analysis
     * @param prompt Prepared prompt
     * @returns Raw API response
     */
    private async Task<string> CallAnthropicAsync(string prompt)
    {
        // Prepare API request
        // Send request to Anthropic
        // Handle rate limiting (retry with backoff)
        // Parse and return response
    }
    
    /**
     * Prepares prompt for AI model
     * @param documentText Document text content
     * @returns Formatted prompt
     */
    private string PreparePrompt(string documentText)
    {
        // Format prompt using template
        // Include instructions for classification, risk assessment, and summarization
        // Return formatted prompt
    }
}
```

### 5.4 Report Service

Generates PDF reports using QuestPDF.

#### Pseudocode with TDD Anchors

```csharp
// ReportService.cs

/**
 * Report service responsible for generating PDF reports
 * 
 * @TDD_TC01 - Should generate single document report
 * @TDD_TC02 - Should generate batch summary report
 * @TDD_TC03 - Should include document metadata in report
 * @TDD_TC04 - Should include classification details in report
 * @TDD_TC05 - Should include summary in report
 * @TDD_TC06 - Should format PDF correctly
 */
public class ReportService : IReportService
{
    private readonly IReportRepository _reportRepository;
    private readonly IDocumentRepository _documentRepository;
    private readonly IClassificationRepository _classificationRepository;
    
    /**
     * Generates report for a single document
     * @param documentId Document ID
     * @returns Report details
     */
    public async Task<ReportDto> GenerateSingleReportAsync(Guid documentId)
    {
        // Get document and classification from repositories
        // Create report model
        // Generate PDF using QuestPDF
        // Save report metadata to repository
        // Return report DTO
    }
    
    /**
     * Generates summary report for a batch
     * @param batchId Batch ID
     * @returns Report details
     */
    public async Task<ReportDto> GenerateBatchReportAsync(Guid batchId)
    {
        // Get all documents and classifications in batch
        // Create batch report model
        // Generate PDF using QuestPDF
        // Save report metadata to repository
        // Return report DTO
    }
    
    /**
     * Gets report details
     * @param reportId Report ID
     * @returns Report details
     */
    public async Task<ReportDto> GetReportAsync(Guid reportId)
    {
        // Get report from repository
        // Map to DTO
        // Return DTO
    }
    
    /**
     * Gets download URL for a report
     * @param reportId Report ID
     * @returns Download URL
     */
    public async Task<string> GetReportDownloadUrlAsync(Guid reportId)
    {
        // Get report from repository
        // Generate temporary download URL
        // Return URL
    }
}

## 6. Document Parser Service

Extracts text from different document formats.

#### Pseudocode with TDD Anchors

```csharp
// DocumentParser.cs

/**
 * Document parser responsible for extracting text from various file formats
 * 
 * @TDD_TC01 - Should extract text from PDF files
 * @TDD_TC02 - Should extract text from DOCX files
 * @TDD_TC03 - Should extract text from TXT files
 * @TDD_TC04 - Should handle corrupted files gracefully
 * @TDD_TC05 - Should preserve text formatting where possible
 */
public class DocumentParser : IDocumentParser
{
    /**
     * Extracts text from a document file
     * @param filePath Path to document file
     * @param fileType Type of file
     * @returns Extracted text
     */
    public async Task<string> ExtractTextAsync(string filePath, FileType fileType)
    {
        // Select appropriate extraction method based on file type
        // Call specific extractor
        // Return extracted text
    }
    
    /**
     * Extracts text from PDF file
     * @param filePath Path to PDF file
     * @returns Extracted text
     */
    private async Task<string> ExtractFromPdfAsync(string filePath)
    {
        // Use PDF library to extract text
        // Process and clean extracted text
        // Return text content
    }
    
    /**
     * Extracts text from DOCX file
     * @param filePath Path to DOCX file
     * @returns Extracted text
     */
    private async Task<string> ExtractFromDocxAsync(string filePath)
    {
        // Use DOCX library to extract text
        // Process and clean extracted text
        // Return text content
    }
    
    /**
     * Extracts text from TXT file
     * @param filePath Path to TXT file
     * @returns Extracted text
     */
    private async Task<string> ExtractFromTxtAsync(string filePath)
    {
        // Read text file
        // Return text content
    }
}
```

## 7. Integration Points

### 7.1 OpenAI Integration

```csharp
// OpenAIClient.cs

/**
 * OpenAI client for GPT-4 integration
 */
public class OpenAIClient : IAIClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    
    /**
     * Sends completion request to OpenAI
     * @param prompt Prompt text
     * @returns AI response
     */
    public async Task<string> GetCompletionAsync(string prompt)
    {
        // Prepare request with prompt
        // Set model parameters (temperature, max_tokens, etc.)
        // Send request to OpenAI API
        // Handle response
        // Extract and return completion text
    }
}
```

### 7.2 Anthropic Integration

```csharp
// AnthropicClient.cs

/**
 * Anthropic client for Claude integration
 */
public class AnthropicClient : IAIClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    
    /**
     * Sends completion request to Anthropic
     * @param prompt Prompt text
     * @returns AI response
     */
    public async Task<string> GetCompletionAsync(string prompt)
    {
        // Prepare request with prompt
        // Set model parameters (temperature, max_tokens, etc.)
        // Send request to Anthropic API
        // Handle response
        // Extract and return completion text
    }
}
```

### 7.3 QuestPDF Integration

```csharp
// ReportGenerator.cs

/**
 * Report generator using QuestPDF
 */
public class ReportGenerator : IReportGenerator
{
    /**
     * Generates single document report
     * @param document Document data
     * @param classification Classification data
     * @returns Path to generated PDF
     */
    public string GenerateSingleReport(DocumentDto document, ClassificationDto classification)
    {
        // Create QuestPDF document
        // Define document structure and styling
        // Add document metadata
        // Add classification details
        // Add summary
        // Generate and save PDF
        // Return file path
    }
    
    /**
     * Generates batch summary report
     * @param batch Batch data
     * @param documents List of documents
     * @param classifications List of classifications
     * @returns Path to generated PDF
     */
    public string GenerateBatchReport(BatchDto batch, IEnumerable<DocumentDto> documents, IEnumerable<ClassificationDto> classifications)
    {
        // Create QuestPDF document
        // Define document structure and styling
        // Add batch summary
        // Add statistics (documents by category, risk level distribution)
        // Add document list with classifications
        // Generate and save PDF
        // Return file path
    }
}
```

## 8. Testing Strategy

### 8.1 Unit Testing

Unit tests will be created for all core services and components, focusing on:

- Document parsing and text extraction
- Classification logic
- Risk assessment algorithms
- Summary generation
- Report generation
- API endpoints

#### Example Test Cases

```csharp
// DocumentServiceTests.cs

/**
 * Tests for DocumentService
 */
public class DocumentServiceTests
{
    /**
     * Test that PDF text extraction works correctly
     */
    [Fact]
    public async Task ExtractTextAsync_WithPdfFile_ShouldExtractText()
    {
        // Arrange: Create test PDF file with known content
        // Act: Call ExtractTextAsync
        // Assert: Verify extracted text matches expected content
    }
    
    /**
     * Test that batch creation works correctly
     */
    [Fact]
    public async Task CreateBatchAsync_WithValidUser_ShouldCreateBatch()
    {
        // Arrange: Set up repository mocks
        // Act: Call CreateBatchAsync
        // Assert: Verify batch is created with correct initial properties
    }
}
```

### 8.2 Integration Testing

Integration tests will verify the interaction between components:

- Frontend-to-backend communication
- Document upload and processing workflow
- Classification and report generation pipeline
- Database operations

#### Example Test Cases

```csharp
// ClassificationIntegrationTests.cs

/**
 * Integration tests for classification workflow
 */
public class ClassificationIntegrationTests
{
    /**
     * Test end-to-end classification workflow
     */
    [Fact]
    public async Task ClassifyDocument_EndToEnd_ShouldCompleteSuccessfully()
    {
        // Arrange: Create test document and upload to system
        // Act: Trigger classification process
        // Assert: Verify document is classified, risk level assigned, and summary generated
    }
}
```

### 8.3 UI Testing

UI tests will verify the frontend functionality:

- Document upload and validation
- Results display and filtering
- Manual override functionality
- Report generation and download

#### Example Test Cases

```typescript
// upload.component.spec.ts

/**
 * Tests for UploadComponent
 */
describe('UploadComponent', () => {
  /**
   * Test file validation
   */
  it('should validate file types correctly', () => {
    // Arrange: Create component and test files
    // Act: Call validateFile method
    // Assert: Verify validation results match expected outcomes
  });
  
  /**
   * Test file upload
   */
  it('should upload files and create batch', () => {
    // Arrange: Create component and test files
    // Act: Call uploadFiles method
    // Assert: Verify service calls and UI updates
  });
});
```

## 9. Implementation Plan

### 9.1 Phase 1: Core Infrastructure

- Set up Angular frontend project with PrimeNG
- Set up .NET Core backend project
- Implement domain model and database schema
- Implement document storage mechanism
- Set up CI/CD pipeline

### 9.2 Phase 2: Document Processing

- Implement document upload functionality
- Implement text extraction for supported file types
- Implement batch processing
- Create basic UI for document upload

### 9.3 Phase 3: AI Integration

- Implement AI service with OpenAI/Anthropic integration
- Implement classification logic
- Implement risk assessment
- Implement summary generation
- Create results display UI

### 9.4 Phase 4: Reporting

- Implement QuestPDF integration
- Create report templates
- Implement report generation
- Implement report download functionality
- Create report viewer UI

### 9.5 Phase 5: Refinement and Testing

- Implement manual override functionality
- Add filtering and sorting to results display
- Comprehensive testing of all components
- Performance optimization
- User acceptance testing

## 10. Extensibility Considerations

### 10.1 Adding New Document Types

The system is designed to be extensible for new document formats:

```csharp
// Adding support for a new file format (e.g., RTF)
public async Task<string> ExtractFromRtfAsync(string filePath)
{
    // Implement RTF-specific extraction logic
    // Return extracted text
}

// Update the file type enum
public enum FileType
{
    PDF,
    DOCX,
    TXT,
    RTF // New format
}

// Update the extraction method selection
public async Task<string> ExtractTextAsync(string filePath, FileType fileType)
{
    switch (fileType)
    {
        case FileType.PDF:
            return await ExtractFromPdfAsync(filePath);
        case FileType.DOCX:
            return await ExtractFromDocxAsync(filePath);
        case FileType.TXT:
            return await ExtractFromTxtAsync(filePath);
        case FileType.RTF:
            return await ExtractFromRtfAsync(filePath); // New format
        default:
            throw new NotSupportedException($"File type {fileType} is not supported.");
    }
}
```

### 10.2 Adding New Classification Categories

The system allows for easy addition of new classification categories:

```csharp
// Update the category enum
public enum DocumentCategory
{
    DataPrivacy,
    FinancialReporting,
    WorkplaceConduct,
    HealthCompliance,
    Other,
    EnvironmentalCompliance, // New category
    InternationalTrade       // New category
}

// Update the AI prompt template
private string PreparePrompt(string documentText)
{
    return $@"
        Analyze the following document and classify it into one of these categories:
        - Data Privacy
        - Financial Reporting
        - Workplace Conduct
        - Health Compliance
        - Environmental Compliance
        - International Trade
        - Other
        
        Document text:
        {documentText}
    ";
}
```

### 10.3 Switching AI Providers

The system is designed to easily switch between AI providers:

```csharp
// AIService.cs

public async Task<AIAnalysisResult> AnalyzeDocumentAsync(string documentText)
{
    // Determine which AI provider to use based on configuration
    string aiProvider = _configuration.GetValue<string>("AIProvider");
    
    string response;
    if (aiProvider == "OpenAI")
    {
        response = await CallOpenAIAsync(PreparePrompt(documentText));
    }
    else if (aiProvider == "Anthropic")
    {
        response = await CallAnthropicAsync(PreparePrompt(documentText));
    }
    else
    {
        throw new NotSupportedException($"AI provider {aiProvider} is not supported.");
    }
    
    // Parse response and return result
}
```

## 11. Conclusion

The Compliance Document Classifier proof-of-concept application provides an automated solution for classifying, assessing, and summarizing compliance-related documents. By leveraging AI capabilities, the system reduces the manual effort required to process regulatory documentation while providing valuable insights through risk assessment and summarization.

The modular design allows for easy extension to support additional document formats, classification categories, and AI providers. The Angular frontend with PrimeNG provides a modern, responsive user interface, while the .NET Core backend ensures robust and scalable processing.

This specification provides a comprehensive blueprint for implementing the system, including domain model, architecture, component design, and implementation plan. The included pseudocode with TDD anchors facilitates a test-driven development approach, ensuring high-quality code and comprehensive test coverage.

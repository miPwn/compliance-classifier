# Compliance Document Classifier - Component Diagrams

## Overview

This document provides detailed component diagrams for the Compliance Document Classifier system. These diagrams illustrate the structure and relationships between the various components that make up the system.

## Frontend Angular Components and Services

The following diagram illustrates the Angular frontend components and services:

```mermaid
graph TD
    subgraph "Angular Components"
        A[AppComponent] --> B[UploadComponent]
        A --> C[ResultsComponent]
        A --> D[ReportComponent]
        A --> E[NavigationComponent]
        A --> F[DashboardComponent]
    end
    
    subgraph "Angular Services"
        G[DocumentService]
        H[ClassificationService]
        I[ReportService]
        J[AuthService]
        K[NotificationService]
    end
    
    B -->|Uses| G
    C -->|Uses| G
    C -->|Uses| H
    D -->|Uses| I
    B -->|Uses| K
    C -->|Uses| K
    D -->|Uses| K
    
    G -->|HTTP Requests| L[API]
    H -->|HTTP Requests| L
    I -->|HTTP Requests| L
    J -->|HTTP Requests| L
    
    style A fill:#f9d6ff,stroke:#333,stroke-width:2px
    style B fill:#d6e8ff,stroke:#333,stroke-width:2px
    style C fill:#d6ffd9,stroke:#333,stroke-width:2px
    style D fill:#ffe6d6,stroke:#333,stroke-width:2px
    style E fill:#d6f5ff,stroke:#333,stroke-width:2px
    style F fill:#fff3d6,stroke:#333,stroke-width:2px
    style G fill:#ffd6d6,stroke:#333,stroke-width:2px
    style H fill:#d6fffc,stroke:#333,stroke-width:2px
    style I fill:#f0d6ff,stroke:#333,stroke-width:2px
    style J fill:#f9f0d6,stroke:#333,stroke-width:2px
    style K fill:#d6f0ff,stroke:#333,stroke-width:2px
    style L fill:#ffd6e8,stroke:#333,stroke-width:2px
```

### Component Details

#### UploadComponent

The UploadComponent handles document batch uploading via a drag-and-drop interface.

```mermaid
classDiagram
    class UploadComponent {
        +acceptedFileTypes: string[]
        +maxFileSize: number
        +files: File[]
        +uploadProgress: number
        +isUploading: boolean
        +batchId: string
        +onFileDrop(files: FileList): void
        +validateFile(file: File): boolean
        +uploadFiles(): void
        +removeFile(index: number): void
        +clearFiles(): void
    }
```

#### ResultsComponent

The ResultsComponent displays classification results in a table with filtering, sorting, and override capabilities.

```mermaid
classDiagram
    class ResultsComponent {
        +classifications: Classification[]
        +filteredClassifications: Classification[]
        +categories: string[]
        +riskLevels: string[]
        +selectedBatchId: string
        +isLoading: boolean
        +loadClassifications(batchId: string): void
        +filterClassifications(category?: string, riskLevel?: string): void
        +overrideCategory(classificationId: string, newCategory: string): void
        +overrideRiskLevel(classificationId: string, newRiskLevel: string): void
        +downloadSingleReport(documentId: string): void
        +downloadBatchReport(): void
    }
```

#### ReportComponent

The ReportComponent displays generated reports with options to view, download, and share.

```mermaid
classDiagram
    class ReportComponent {
        +reportId: string
        +report: Report
        +isLoading: boolean
        +pdfUrl: string
        +loadReport(reportId: string): void
        +downloadReport(): void
        +shareReport(email: string): void
        +loadReportHistory(): void
    }
```

## Backend .NET Core API Controllers and Services

The following diagram illustrates the backend API controllers and services:

```mermaid
graph TD
    subgraph "API Controllers"
        A[DocumentController]
        B[ClassificationController]
        C[ReportController]
    end
    
    subgraph "Application Services"
        D[DocumentService]
        E[ClassificationService]
        F[ReportService]
    end
    
    subgraph "Domain Services"
        G[DocumentProcessingService]
        H[DocumentClassificationService]
        I[ReportGenerationService]
    end
    
    subgraph "Repositories"
        J[DocumentRepository]
        K[ClassificationRepository]
        L[BatchRepository]
        M[ReportRepository]
    end
    
    A -->|Uses| D
    B -->|Uses| E
    C -->|Uses| F
    
    D -->|Uses| G
    D -->|Uses| J
    D -->|Uses| L
    
    E -->|Uses| H
    E -->|Uses| J
    E -->|Uses| K
    
    F -->|Uses| I
    F -->|Uses| J
    F -->|Uses| K
    F -->|Uses| M
    
    style A fill:#f9d6ff,stroke:#333,stroke-width:2px
    style B fill:#d6e8ff,stroke:#333,stroke-width:2px
    style C fill:#d6ffd9,stroke:#333,stroke-width:2px
    style D fill:#ffe6d6,stroke:#333,stroke-width:2px
    style E fill:#d6f5ff,stroke:#333,stroke-width:2px
    style F fill:#fff3d6,stroke:#333,stroke-width:2px
    style G fill:#ffd6d6,stroke:#333,stroke-width:2px
    style H fill:#d6fffc,stroke:#333,stroke-width:2px
    style I fill:#f0d6ff,stroke:#333,stroke-width:2px
    style J fill:#f9f0d6,stroke:#333,stroke-width:2px
    style K fill:#d6f0ff,stroke:#333,stroke-width:2px
    style L fill:#ffd6e8,stroke:#333,stroke-width:2px
    style M fill:#d6ffe8,stroke:#333,stroke-width:2px
```

### Controller Details

#### DocumentController

The DocumentController handles document-related HTTP requests.

```mermaid
classDiagram
    class DocumentController {
        -IDocumentService _documentService
        +DocumentController(IDocumentService documentService)
        +CreateBatchAsync(): Task<ActionResult<Guid>>
        +UploadDocumentsAsync(Guid batchId, IFormFileCollection files): Task<ActionResult<IEnumerable<Guid>>>
        +GetDocumentAsync(Guid id): Task<ActionResult<DocumentDto>>
        +GetBatchDocumentsAsync(Guid batchId): Task<ActionResult<IEnumerable<DocumentDto>>>
    }
```

#### ClassificationController

The ClassificationController handles classification-related HTTP requests.

```mermaid
classDiagram
    class ClassificationController {
        -IClassificationService _classificationService
        +ClassificationController(IClassificationService classificationService)
        +ClassifyDocumentAsync(Guid documentId): Task<ActionResult<ClassificationDto>>
        +GetClassificationAsync(Guid documentId): Task<ActionResult<ClassificationDto>>
        +OverrideClassificationAsync(Guid classificationId, ClassificationOverrideDto overrideDto): Task<ActionResult<ClassificationDto>>
        +GetBatchClassificationsAsync(Guid batchId): Task<ActionResult<IEnumerable<ClassificationDto>>>
    }
```

#### ReportController

The ReportController handles report-related HTTP requests.

```mermaid
classDiagram
    class ReportController {
        -IReportService _reportService
        +ReportController(IReportService reportService)
        +GenerateSingleReportAsync(Guid documentId): Task<ActionResult<ReportDto>>
        +GenerateBatchReportAsync(Guid batchId): Task<ActionResult<ReportDto>>
        +GetReportAsync(Guid reportId): Task<ActionResult<ReportDto>>
        +GetReportDownloadUrlAsync(Guid reportId): Task<ActionResult<string>>
    }
```

## Document Parser Modules

The following diagram illustrates the document parser modules:

```mermaid
graph TD
    subgraph "Document Parser Service"
        A[IDocumentParserService]
        B[DocumentParserService]
    end
    
    subgraph "Parser Factory"
        C[IDocumentParserFactory]
        D[DocumentParserFactory]
    end
    
    subgraph "Document Parsers"
        E[IDocumentParser]
        F[BaseDocumentParser]
        G[TxtDocumentParser]
        H[PdfDocumentParser]
        I[DocxDocumentParser]
    end
    
    B -->|Implements| A
    D -->|Implements| C
    
    B -->|Uses| D
    D -->|Creates| G
    D -->|Creates| H
    D -->|Creates| I
    
    F -->|Implements| E
    G -->|Extends| F
    H -->|Extends| F
    I -->|Extends| F
    
    style A fill:#f9d6ff,stroke:#333,stroke-width:2px
    style B fill:#d6e8ff,stroke:#333,stroke-width:2px
    style C fill:#d6ffd9,stroke:#333,stroke-width:2px
    style D fill:#ffe6d6,stroke:#333,stroke-width:2px
    style E fill:#d6f5ff,stroke:#333,stroke-width:2px
    style F fill:#fff3d6,stroke:#333,stroke-width:2px
    style G fill:#ffd6d6,stroke:#333,stroke-width:2px
    style H fill:#d6fffc,stroke:#333,stroke-width:2px
    style I fill:#f0d6ff,stroke:#333,stroke-width:2px
```

### Parser Details

#### BaseDocumentParser

The BaseDocumentParser provides common functionality for all document parsers.

```mermaid
classDiagram
    class BaseDocumentParser {
        #ILogger<BaseDocumentParser> _logger
        +BaseDocumentParser(ILogger<BaseDocumentParser> logger)
        +ExtractTextAsync(string filePath, FileType fileType): Task<string>
        #ExtractTextInternalAsync(string filePath): Task<string>*
        +ExtractMetadataAsync(string filePath): Task<DocumentMetadata>*
    }
```

#### Concrete Parser Implementations

```mermaid
classDiagram
    BaseDocumentParser <|-- TxtDocumentParser
    BaseDocumentParser <|-- PdfDocumentParser
    BaseDocumentParser <|-- DocxDocumentParser
    
    class TxtDocumentParser {
        +TxtDocumentParser(ILogger<TxtDocumentParser> logger)
        #ExtractTextInternalAsync(string filePath): Task<string>
        +ExtractMetadataAsync(string filePath): Task<DocumentMetadata>
    }
    
    class PdfDocumentParser {
        +PdfDocumentParser(ILogger<PdfDocumentParser> logger)
        #ExtractTextInternalAsync(string filePath): Task<string>
        +ExtractMetadataAsync(string filePath): Task<DocumentMetadata>
    }
    
    class DocxDocumentParser {
        +DocxDocumentParser(ILogger<DocxDocumentParser> logger)
        #ExtractTextInternalAsync(string filePath): Task<string>
        +ExtractMetadataAsync(string filePath): Task<DocumentMetadata>
    }
```

## AI Classification Service Abstraction

The following diagram illustrates the AI classification service abstraction:

```mermaid
graph TD
    subgraph "AI Service Abstraction"
        A[IAIService]
        B[AIService]
    end
    
    subgraph "AI Clients"
        C[IAIClient]
        D[OpenAIClient]
        E[AnthropicClient]
    end
    
    subgraph "Configuration"
        F[AIModelConfig]
    end
    
    B -->|Implements| A
    D -->|Implements| C
    E -->|Implements| C
    
    B -->|Uses| D
    B -->|Uses| E
    B -->|Configured by| F
    
    style A fill:#f9d6ff,stroke:#333,stroke-width:2px
    style B fill:#d6e8ff,stroke:#333,stroke-width:2px
    style C fill:#d6ffd9,stroke:#333,stroke-width:2px
    style D fill:#ffe6d6,stroke:#333,stroke-width:2px
    style E fill:#d6f5ff,stroke:#333,stroke-width:2px
    style F fill:#fff3d6,stroke:#333,stroke-width:2px
```

### AI Service Details

#### IAIService Interface

```mermaid
classDiagram
    class IAIService {
        +AnalyzeDocumentAsync(string documentText): Task<AIAnalysisResult>
    }
```

#### AIService Implementation

```mermaid
classDiagram
    class AIService {
        -HttpClient _httpClient
        -AIModelConfig _modelConfig
        +AIService(HttpClient httpClient, AIModelConfig modelConfig)
        +AnalyzeDocumentAsync(string documentText): Task<AIAnalysisResult>
        -CallOpenAIAsync(string prompt): Task<string>
        -CallAnthropicAsync(string prompt): Task<string>
        -PreparePrompt(string documentText): string
    }
```

#### AIModelConfig Value Object

```mermaid
classDiagram
    class AIModelConfig {
        +string ModelName
        +decimal Temperature
        +int MaxTokens
        +string PromptTemplate
    }
```

## PDF Generation Service

The following diagram illustrates the PDF generation service:

```mermaid
graph TD
    subgraph "Report Generation Service"
        A[IReportGenerationService]
        B[ReportGenerationService]
    end
    
    subgraph "Report Generator"
        C[IReportGenerator]
        D[ReportGenerator]
    end
    
    B -->|Implements| A
    D -->|Implements| C
    
    B -->|Uses| D
    D -->|Uses| E[QuestPDF]
    
    style A fill:#f9d6ff,stroke:#333,stroke-width:2px
    style B fill:#d6e8ff,stroke:#333,stroke-width:2px
    style C fill:#d6ffd9,stroke:#333,stroke-width:2px
    style D fill:#ffe6d6,stroke:#333,stroke-width:2px
    style E fill:#d6f5ff,stroke:#333,stroke-width:2px
```

### Report Generator Details

#### IReportGenerator Interface

```mermaid
classDiagram
    class IReportGenerator {
        +GenerateSingleReport(DocumentDto document, ClassificationDto classification): string
        +GenerateBatchReport(BatchDto batch, IEnumerable<DocumentDto> documents, IEnumerable<ClassificationDto> classifications): string
    }
```

#### ReportGenerator Implementation

```mermaid
classDiagram
    class ReportGenerator {
        +GenerateSingleReport(DocumentDto document, ClassificationDto classification): string
        +GenerateBatchReport(BatchDto batch, IEnumerable<DocumentDto> documents, IEnumerable<ClassificationDto> classifications): string
    }
```

## Domain Model Components

The following diagram illustrates the domain model components:

```mermaid
graph TD
    subgraph "Aggregates"
        A[Document]
        B[Classification]
        C[Batch]
        D[Report]
    end
    
    subgraph "Value Objects"
        E[DocumentMetadata]
        F[AIModelConfig]
    end
    
    subgraph "Domain Events"
        G[DocumentUploadedEvent]
        H[DocumentClassifiedEvent]
        I[BatchCompletedEvent]
        J[ClassificationOverriddenEvent]
        K[ReportGeneratedEvent]
    end
    
    A -->|Has| E
    B -->|References| A
    C -->|Contains| A
    D -->|References| A
    D -->|References| B
    D -->|References| C
    
    A -->|Raises| G
    B -->|Raises| H
    B -->|Raises| J
    C -->|Raises| I
    D -->|Raises| K
    
    style A fill:#f9d6ff,stroke:#333,stroke-width:2px
    style B fill:#d6e8ff,stroke:#333,stroke-width:2px
    style C fill:#d6ffd9,stroke:#333,stroke-width:2px
    style D fill:#ffe6d6,stroke:#333,stroke-width:2px
    style E fill:#d6f5ff,stroke:#333,stroke-width:2px
    style F fill:#fff3d6,stroke:#333,stroke-width:2px
    style G fill:#ffd6d6,stroke:#333,stroke-width:2px
    style H fill:#d6fffc,stroke:#333,stroke-width:2px
    style I fill:#f0d6ff,stroke:#333,stroke-width:2px
    style J fill:#f9f0d6,stroke:#333,stroke-width:2px
    style K fill:#d6f0ff,stroke:#333,stroke-width:2px
```

### Aggregate Details

#### Document Aggregate

```mermaid
classDiagram
    class Document {
        +Guid DocumentId
        +string FileName
        +FileType FileType
        +long FileSize
        +DateTime UploadDate
        +string Content
        +DocumentStatus Status
        +Guid BatchId
        +DocumentMetadata Metadata
        +Document(Guid documentId, string fileName, FileType fileType, long fileSize, Guid batchId)
        +UpdateContent(string content): void
        +UpdateStatus(DocumentStatus status): void
        +EnrichMetadata(DocumentMetadata metadata): void
        +IsProcessed(): bool
        +HasError(): bool
    }
```

#### Classification Aggregate

```mermaid
classDiagram
    class Classification {
        +Guid ClassificationId
        +Guid DocumentId
        +CategoryType Category
        +RiskLevel RiskLevel
        +string Summary
        +DateTime ClassificationDate
        +string ClassifiedBy
        +decimal ConfidenceScore
        +bool IsOverridden
        +Classification(Guid classificationId, Guid documentId, CategoryType category, RiskLevel riskLevel, string summary, string classifiedBy, decimal confidenceScore)
        +Override(CategoryType category, RiskLevel riskLevel, string summary, string overriddenBy): void
        +IsHighRisk(): bool
        +IsLowConfidence(): bool
    }
```

## Conclusion

These component diagrams provide a comprehensive view of the structure and relationships between the various components that make up the Compliance Document Classifier system. They illustrate how the components are organized and how they interact with each other to provide the system's functionality.
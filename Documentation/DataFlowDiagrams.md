# Compliance Document Classifier - Data Flow Diagrams

## Overview

This document provides detailed data flow diagrams for the Compliance Document Classifier's document processing pipeline. These diagrams illustrate how data moves through the system, from document upload to classification and report generation.

## Document Processing Pipeline

The following diagram illustrates the complete document processing pipeline:

```mermaid
graph TD
    A[Document Upload] --> B[Document Storage]
    B --> C[Text Extraction]
    C --> D[Metadata Extraction]
    D --> E[AI Classification]
    E --> F[Risk Assessment]
    F --> G[Summary Generation]
    G --> H[Database Storage]
    H --> I[Report Generation]
    
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

## Level 0 Data Flow Diagram

The Level 0 DFD provides a high-level overview of the system:

```mermaid
graph TD
    User[User] -->|Upload Documents| System[Compliance Document Classifier]
    System -->|Classification Results| User
    System -->|Generated Reports| User
    System <-->|AI Analysis| AIService[AI Service]
    System <-->|Store/Retrieve Data| Database[Database]
    System <-->|Store/Retrieve Documents| Storage[Document Storage]
    
    style User fill:#f9d6ff,stroke:#333,stroke-width:2px
    style System fill:#d6e8ff,stroke:#333,stroke-width:2px
    style AIService fill:#d6ffd9,stroke:#333,stroke-width:2px
    style Database fill:#ffe6d6,stroke:#333,stroke-width:2px
    style Storage fill:#d6f5ff,stroke:#333,stroke-width:2px
```

## Level 1 Data Flow Diagram

The Level 1 DFD breaks down the system into its major processes:

```mermaid
graph TD
    User[User] -->|Upload Documents| P1[Document Management Process]
    P1 <-->|Store/Retrieve Documents| DS1[Document Storage]
    P1 -->|Document Metadata| DS2[Database]
    P1 -->|Document Content| P2[Document Processing Process]
    
    P2 -->|Extracted Text| P3[Classification Process]
    P2 <-->|Document Metadata| DS2
    
    P3 <-->|AI Prompts/Responses| External[AI Service]
    P3 -->|Classification Results| DS2
    P3 -->|Classification Results| User
    
    User -->|Request Report| P4[Report Generation Process]
    P4 <-->|Document & Classification Data| DS2
    P4 <-->|Document Content| DS1
    P4 -->|Generated Report| User
    
    style User fill:#f9d6ff,stroke:#333,stroke-width:2px
    style P1 fill:#d6e8ff,stroke:#333,stroke-width:2px
    style P2 fill:#d6ffd9,stroke:#333,stroke-width:2px
    style P3 fill:#ffe6d6,stroke:#333,stroke-width:2px
    style P4 fill:#d6f5ff,stroke:#333,stroke-width:2px
    style DS1 fill:#fff3d6,stroke:#333,stroke-width:2px
    style DS2 fill:#ffd6d6,stroke:#333,stroke-width:2px
    style External fill:#d6fffc,stroke:#333,stroke-width:2px
```

## Document Upload Flow

The following diagram details the document upload process:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DocumentService
    participant Storage
    participant Database
    
    User->>Frontend: Select documents
    User->>Frontend: Initiate upload
    Frontend->>API: POST /api/document/batch
    API->>DocumentService: CreateBatchAsync()
    DocumentService->>Database: Save batch metadata
    Database-->>DocumentService: Batch ID
    DocumentService-->>API: Batch ID
    API-->>Frontend: Batch ID
    
    Frontend->>API: POST /api/document/batch/{id}/upload
    API->>DocumentService: UploadDocumentsAsync()
    DocumentService->>Storage: Store document files
    DocumentService->>Database: Save document metadata
    Database-->>DocumentService: Document IDs
    DocumentService-->>API: Document IDs
    API-->>Frontend: Document IDs
    Frontend-->>User: Upload confirmation
```

## Document Processing Flow

This diagram illustrates the document processing flow:

```mermaid
sequenceDiagram
    participant API
    participant DocumentService
    participant ParserFactory
    participant DocumentParser
    participant Storage
    participant Database
    
    API->>DocumentService: ExtractTextAsync(documentId)
    DocumentService->>Database: Get document metadata
    Database-->>DocumentService: Document metadata
    DocumentService->>Storage: Get document file
    Storage-->>DocumentService: Document file
    
    DocumentService->>ParserFactory: CreateParser(fileType)
    ParserFactory-->>DocumentService: Appropriate parser
    DocumentService->>DocumentParser: ExtractTextAsync(filePath, fileType)
    DocumentParser-->>DocumentService: Extracted text
    
    DocumentService->>DocumentParser: ExtractMetadataAsync(filePath)
    DocumentParser-->>DocumentService: Document metadata
    
    DocumentService->>Database: Update document with content and metadata
    Database-->>DocumentService: Success confirmation
    DocumentService-->>API: Extracted text and metadata
```

## Classification Flow

The classification process flow is detailed below:

```mermaid
sequenceDiagram
    participant API
    participant ClassificationService
    participant AIService
    participant Database
    
    API->>ClassificationService: ClassifyDocumentAsync(documentId)
    ClassificationService->>Database: Get document content
    Database-->>ClassificationService: Document content
    
    ClassificationService->>AIService: AnalyzeDocumentAsync(content)
    AIService->>AIService: Prepare AI prompt
    AIService->>AIService: Call AI provider (OpenAI/Anthropic)
    AIService->>AIService: Parse AI response
    AIService-->>ClassificationService: AI analysis result (category, risk, summary)
    
    ClassificationService->>Database: Save classification results
    Database-->>ClassificationService: Success confirmation
    ClassificationService-->>API: Classification results
```

## Report Generation Flow

The report generation process flow:

```mermaid
sequenceDiagram
    participant API
    participant ReportService
    participant DocumentRepo
    participant ClassificationRepo
    participant ReportGenerator
    participant Storage
    participant Database
    
    API->>ReportService: GenerateReportAsync(documentId/batchId)
    
    alt Single Document Report
        ReportService->>DocumentRepo: GetDocumentAsync(documentId)
        DocumentRepo-->>ReportService: Document data
        ReportService->>ClassificationRepo: GetClassificationAsync(documentId)
        ClassificationRepo-->>ReportService: Classification data
        ReportService->>ReportGenerator: GenerateSingleReport(document, classification)
    else Batch Report
        ReportService->>DocumentRepo: GetBatchDocumentsAsync(batchId)
        DocumentRepo-->>ReportService: Documents data
        ReportService->>ClassificationRepo: GetBatchClassificationsAsync(batchId)
        ClassificationRepo-->>ReportService: Classifications data
        ReportService->>ReportGenerator: GenerateBatchReport(documents, classifications)
    end
    
    ReportGenerator-->>ReportService: PDF file path
    ReportService->>Storage: Store PDF file
    ReportService->>Database: Save report metadata
    Database-->>ReportService: Report ID
    ReportService-->>API: Report details
```

## Batch Processing Flow

The batch processing flow:

```mermaid
graph TD
    A[Create Batch] --> B[Upload Documents]
    B --> C[Process Each Document]
    C --> D{All Documents Processed?}
    D -->|No| C
    D -->|Yes| E[Mark Batch as Completed]
    E --> F[Generate Batch Report]
    
    subgraph "Document Processing"
    G[Extract Text] --> H[Extract Metadata]
    H --> I[Classify Document]
    I --> J[Assess Risk Level]
    J --> K[Generate Summary]
    end
    
    C -.-> G
    
    style A fill:#f9d6ff,stroke:#333,stroke-width:2px
    style B fill:#d6e8ff,stroke:#333,stroke-width:2px
    style C fill:#d6ffd9,stroke:#333,stroke-width:2px
    style D fill:#ffe6d6,stroke:#333,stroke-width:2px
    style E fill:#d6f5ff,stroke:#333,stroke-width:2px
    style F fill:#fff3d6,stroke:#333,stroke-width:2px
    style G fill:#ffd6d6,stroke:#333,stroke-width:2px
    style H fill:#d6fffc,stroke:#333,stroke-width:2px
    style I fill:#f0d6ff,stroke:#333,stroke-width:2px
    style J fill:#f9d6ff,stroke:#333,stroke-width:2px
    style K fill:#d6e8ff,stroke:#333,stroke-width:2px
```

## Data Store Interactions

This diagram shows how the system interacts with its data stores:

```mermaid
graph TD
    subgraph "Document Storage"
    DS1[File System/Blob Storage]
    end
    
    subgraph "Database"
    DS2[Document Metadata]
    DS3[Classification Results]
    DS4[Batch Information]
    DS5[Report Metadata]
    end
    
    P1[Document Service] <-->|Store/Retrieve Files| DS1
    P1 <-->|Store/Retrieve Metadata| DS2
    P1 <-->|Update Batch Info| DS4
    
    P2[Classification Service] -->|Read Document Content| DS2
    P2 -->|Store Classification Results| DS3
    P2 -->|Update Document Status| DS2
    P2 -->|Update Batch Progress| DS4
    
    P3[Report Service] -->|Read Document Metadata| DS2
    P3 -->|Read Classification Results| DS3
    P3 -->|Read Batch Information| DS4
    P3 -->|Store Report Metadata| DS5
    P3 <-->|Store/Retrieve Report Files| DS1
    
    style DS1 fill:#f9d6ff,stroke:#333,stroke-width:2px
    style DS2 fill:#d6e8ff,stroke:#333,stroke-width:2px
    style DS3 fill:#d6ffd9,stroke:#333,stroke-width:2px
    style DS4 fill:#ffe6d6,stroke:#333,stroke-width:2px
    style DS5 fill:#d6f5ff,stroke:#333,stroke-width:2px
    style P1 fill:#fff3d6,stroke:#333,stroke-width:2px
    style P2 fill:#ffd6d6,stroke:#333,stroke-width:2px
    style P3 fill:#d6fffc,stroke:#333,stroke-width:2px
```

## AI Service Integration Flow

The AI service integration flow:

```mermaid
sequenceDiagram
    participant ClassificationService
    participant AIService
    participant AIModelConfig
    participant OpenAIClient
    participant AnthropicClient
    
    ClassificationService->>AIService: AnalyzeDocumentAsync(documentText)
    AIService->>AIService: PreparePrompt(documentText)
    
    alt OpenAI Configuration
        AIService->>AIModelConfig: Get OpenAI configuration
        AIService->>OpenAIClient: CallOpenAIAsync(prompt)
        OpenAIClient-->>AIService: AI response
    else Anthropic Configuration
        AIService->>AIModelConfig: Get Anthropic configuration
        AIService->>AnthropicClient: CallAnthropicAsync(prompt)
        AnthropicClient-->>AIService: AI response
    end
    
    AIService->>AIService: Parse AI response
    AIService->>AIService: Extract category, risk level, and summary
    AIService-->>ClassificationService: AI analysis result
```

## Conclusion

These data flow diagrams provide a comprehensive view of how information moves through the Compliance Document Classifier system. They illustrate the key processes, data stores, and interactions that enable the system to ingest, process, classify, and report on compliance documents.
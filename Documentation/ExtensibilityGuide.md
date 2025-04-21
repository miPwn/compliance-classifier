# Compliance Document Classifier - Extensibility Guide

## Overview

This guide provides detailed instructions for extending the Compliance Document Classifier system with new document types, classification categories, and AI providers. The system is designed with extensibility in mind, allowing developers to enhance its capabilities without modifying the core architecture.

## Table of Contents

1. [Adding New Document Types](#adding-new-document-types)
2. [Adding New Classification Categories](#adding-new-classification-categories)
3. [Integrating New AI Providers](#integrating-new-ai-providers)
4. [Extending the Report Generation](#extending-the-report-generation)
5. [Creating Custom Processing Pipelines](#creating-custom-processing-pipelines)
6. [Best Practices for Extensions](#best-practices-for-extensions)

## Adding New Document Types

The Compliance Document Classifier currently supports PDF, DOCX, and TXT document formats. This section explains how to add support for additional document formats.

### Step 1: Update the FileType Enum

First, add the new file type to the `FileType` enum in `ComplianceClassifier.Domain/Enums/FileType.cs`:

```csharp
namespace ComplianceClassifier.Domain.Enums
{
    /// <summary>
    /// Supported file types for document processing
    /// </summary>
    public enum FileType
    {
        PDF = 0,
        DOCX = 1,
        TXT = 2,
        RTF = 3,  // New file type
        XML = 4,  // New file type
        HTML = 5  // New file type
    }
}
```

### Step 2: Create a New Document Parser

Create a new parser implementation by extending the `BaseDocumentParser` class. Place this in the `ComplianceClassifier.Infrastructure/DocumentParsers/Implementations` directory:

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using ComplianceClassifier.Domain.ValueObjects;
using ComplianceClassifier.Infrastructure.DocumentParsers.Base;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.DocumentParsers.Implementations
{
    /// <summary>
    /// Parser for RTF (Rich Text Format) documents
    /// </summary>
    public class RtfDocumentParser : BaseDocumentParser
    {
        public RtfDocumentParser(ILogger<RtfDocumentParser> logger) 
            : base(logger)
        {
        }

        /// <summary>
        /// Extracts text from an RTF document
        /// </summary>
        protected override async Task<string> ExtractTextInternalAsync(string filePath)
        {
            _logger.LogInformation("Extracting text from RTF file: {FilePath}", filePath);
            
            try
            {
                // Implementation for RTF text extraction
                // This is a simplified example - you would use a proper RTF parsing library
                string rtfContent = await File.ReadAllTextAsync(filePath);
                string plainText = StripRtfTags(rtfContent);
                
                _logger.LogInformation("Successfully extracted text from RTF file");
                return plainText;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting text from RTF file");
                throw;
            }
        }

        /// <summary>
        /// Extracts metadata from an RTF document
        /// </summary>
        public override async Task<DocumentMetadata> ExtractMetadataAsync(string filePath)
        {
            _logger.LogInformation("Extracting metadata from RTF file: {FilePath}", filePath);
            
            try
            {
                var fileInfo = new FileInfo(filePath);
                
                var metadata = new DocumentMetadata
                {
                    PageCount = await EstimatePageCountAsync(filePath),
                    Author = "Unknown", // Extract from RTF info group if available
                    CreationDate = fileInfo.CreationTime,
                    ModificationDate = fileInfo.LastWriteTime,
                    Keywords = new List<string>() // Extract from RTF info group if available
                };
                
                return metadata;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting metadata from RTF file");
                throw;
            }
        }
        
        // Helper methods for RTF parsing
        private string StripRtfTags(string rtfContent)
        {
            // Simplified implementation
            // In a real application, use a proper RTF parsing library
            string plainText = rtfContent;
            // Remove RTF tags and formatting
            return plainText.Trim();
        }
        
        private async Task<int> EstimatePageCountAsync(string filePath)
        {
            string content = await ExtractTextInternalAsync(filePath);
            // Estimate 3000 characters per page
            return Math.Max(1, (int)Math.Ceiling(content.Length / 3000.0));
        }
    }
}
```

### Step 3: Update the Document Parser Factory

Modify the `DocumentParserFactory` class to create the new parser:

```csharp
public class DocumentParserFactory : IDocumentParserFactory
{
    private readonly IServiceProvider _serviceProvider;

    public DocumentParserFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IDocumentParser CreateParser(FileType fileType)
    {
        return fileType switch
        {
            FileType.PDF => _serviceProvider.GetRequiredService<PdfDocumentParser>(),
            FileType.DOCX => _serviceProvider.GetRequiredService<DocxDocumentParser>(),
            FileType.TXT => _serviceProvider.GetRequiredService<TxtDocumentParser>(),
            FileType.RTF => _serviceProvider.GetRequiredService<RtfDocumentParser>(),
            FileType.XML => _serviceProvider.GetRequiredService<XmlDocumentParser>(),
            FileType.HTML => _serviceProvider.GetRequiredService<HtmlDocumentParser>(),
            _ => throw new ArgumentException($"Unsupported file type: {fileType}")
        };
    }
}
```

### Step 4: Register the New Parser in DependencyInjection

Register the new parser in the `DependencyInjection.cs` file:

```csharp
public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
{
    // Register document parser factory
    services.AddScoped<IDocumentParserFactory, DocumentParserFactory>();
    services.AddScoped<IDocumentParserService, DocumentParserService>();
    
    // Register document parsers
    services.AddScoped<TxtDocumentParser>();
    services.AddScoped<PdfDocumentParser>();
    services.AddScoped<DocxDocumentParser>();
    services.AddScoped<RtfDocumentParser>(); // Register the new parser
    services.AddScoped<XmlDocumentParser>(); // Register the new parser
    services.AddScoped<HtmlDocumentParser>(); // Register the new parser
    
    return services;
}
```

### Step 5: Update the Frontend Validation

Update the frontend validation to accept the new file types:

```typescript
// upload.component.ts
export class UploadComponent {
  // Update the accepted file types
  acceptedFileTypes: string[] = ['.txt', '.pdf', '.docx', '.rtf', '.xml', '.html'];
  
  validateFile(file: File): boolean {
    const fileName = file.name.toLowerCase();
    const validExtension = this.acceptedFileTypes.some(ext => 
      fileName.endsWith(ext)
    );
    
    const validSize = file.size <= this.maxFileSize;
    
    return validExtension && validSize;
  }
}
```

## Adding New Classification Categories

The system currently supports several document categories. This section explains how to add new classification categories.

### Step 1: Update the CategoryType Enum

Add the new categories to the `CategoryType` enum:

```csharp
public enum CategoryType
{
    DataPrivacy = 0,
    FinancialReporting = 1,
    WorkplaceConduct = 2,
    HealthCompliance = 3,
    Other = 4,
    EnvironmentalCompliance = 5,  // New category
    InternationalTrade = 6,       // New category
    IntellectualProperty = 7      // New category
}
```

### Step 2: Update the AI Prompt Template

Modify the AI prompt template to include the new categories:

```csharp
private string PreparePrompt(string documentText)
{
    return $@"
        Analyze the following document and classify it into one of these categories:
        - Data Privacy: Documents related to personal data protection, privacy policies, GDPR, etc.
        - Financial Reporting: Documents related to financial statements, accounting, tax compliance, etc.
        - Workplace Conduct: Documents related to workplace policies, code of conduct, harassment, etc.
        - Health Compliance: Documents related to health regulations, safety protocols, medical compliance, etc.
        - Environmental Compliance: Documents related to environmental regulations, sustainability, waste management, etc.
        - International Trade: Documents related to import/export regulations, customs, trade agreements, etc.
        - Intellectual Property: Documents related to patents, trademarks, copyrights, trade secrets, etc.
        - Other: Documents that don't fit into any of the above categories.
        
        Also provide:
        1. A risk level assessment (Low, Medium, High) based on the content
        2. A brief summary (200 words max) of the key points
        3. A confidence score (0.0 to 1.0) for your classification
        
        Document text:
        {documentText}
    ";
}
```

### Step 3: Update the Frontend Components

Update the frontend components to display the new categories:

```typescript
// results.component.ts
export class ResultsComponent {
  // Update the categories array
  categories: string[] = [
    'Data Privacy', 
    'Financial Reporting', 
    'Workplace Conduct', 
    'Health Compliance',
    'Environmental Compliance',
    'International Trade',
    'Intellectual Property',
    'Other'
  ];
}
```

### Step 4: Update Database Migrations (if needed)

If you're using Entity Framework Core with migrations, create a new migration:

```bash
dotnet ef migrations add AddNewCategories
dotnet ef database update
```

## Integrating New AI Providers

The system currently supports OpenAI GPT-4 and Anthropic Claude. This section explains how to integrate additional AI providers.

### Step 1: Create a New AI Client Interface

Create a new interface for AI clients if it doesn't already exist:

```csharp
public interface IAIClient
{
    Task<string> GetCompletionAsync(string prompt);
}
```

### Step 2: Implement the New AI Client

Create a new implementation of the `IAIClient` interface:

```csharp
public class CohereClient : IAIClient
{
    private readonly HttpClient _httpClient;
    private readonly CohereOptions _options;
    private readonly ILogger<CohereClient> _logger;
    
    public CohereClient(
        HttpClient httpClient,
        IOptions<CohereOptions> options,
        ILogger<CohereClient> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
        
        // Configure HttpClient
        _httpClient.BaseAddress = new Uri("https://api.cohere.ai/");
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_options.ApiKey}");
    }
    
    public async Task<string> GetCompletionAsync(string prompt)
    {
        try
        {
            // Prepare request
            var request = new
            {
                model = _options.Model,
                prompt = prompt,
                max_tokens = _options.MaxTokens,
                temperature = _options.Temperature
            };
            
            var content = new StringContent(
                JsonSerializer.Serialize(request),
                Encoding.UTF8,
                "application/json");
            
            // Send request
            var response = await _httpClient.PostAsync("v1/generate", content);
            
            // Handle response
            response.EnsureSuccessStatusCode();
            
            var responseBody = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<CohereResponse>(responseBody);
            
            return responseObject?.Generations?[0]?.Text?.Trim() ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Cohere AI");
            throw;
        }
    }
    
    private class CohereResponse
    {
        public Generation[] Generations { get; set; }
        
        public class Generation
        {
            public string Text { get; set; }
        }
    }
}

public class CohereOptions
{
    public string ApiKey { get; set; }
    public string Model { get; set; } = "command";
    public int MaxTokens { get; set; } = 1024;
    public float Temperature { get; set; } = 0.7f;
}
```

### Step 3: Update the AI Service

Modify the `AIService` class to support the new AI provider:

```csharp
public class AIService : IAIService
{
    private readonly ILogger<AIService> _logger;
    private readonly AIModelConfig _modelConfig;
    private readonly IServiceProvider _serviceProvider;
    
    public AIService(
        ILogger<AIService> logger,
        IOptions<AIModelConfig> modelConfig,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _modelConfig = modelConfig.Value;
        _serviceProvider = serviceProvider;
    }
    
    public async Task<AIAnalysisResult> AnalyzeDocumentAsync(string documentText)
    {
        try
        {
            // Prepare prompt
            var prompt = PreparePrompt(documentText);
            
            // Get appropriate AI client
            IAIClient aiClient;
            
            if (_modelConfig.ModelName.StartsWith("gpt"))
            {
                aiClient = (IAIClient)_serviceProvider.GetService(typeof(OpenAIClient));
            }
            else if (_modelConfig.ModelName.StartsWith("claude"))
            {
                aiClient = (IAIClient)_serviceProvider.GetService(typeof(AnthropicClient));
            }
            else if (_modelConfig.ModelName.StartsWith("command"))
            {
                aiClient = (IAIClient)_serviceProvider.GetService(typeof(CohereClient));
            }
            else
            {
                throw new NotSupportedException($"AI model {_modelConfig.ModelName} is not supported");
            }
            
            // Call AI service
            var response = await aiClient.GetCompletionAsync(prompt);
            
            // Parse response
            return ParseResponse(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error analyzing document with AI");
            throw;
        }
    }
    
    // Rest of the implementation...
}
```

### Step 4: Register the New AI Client

Register the new AI client in the `DependencyInjection.cs` file:

```csharp
public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
{
    // Register AI services
    services.AddHttpClient<OpenAIClient>();
    services.AddHttpClient<AnthropicClient>();
    services.AddHttpClient<CohereClient>(); // Register the new AI client
    
    services.Configure<OpenAIOptions>(configuration.GetSection("AI:OpenAI"));
    services.Configure<AnthropicOptions>(configuration.GetSection("AI:Anthropic"));
    services.Configure<CohereOptions>(configuration.GetSection("AI:Cohere")); // Configure the new AI client
    
    services.AddScoped<IAIService, AIService>();
    
    return services;
}
```

### Step 5: Update the Configuration

Add configuration for the new AI provider in `appsettings.json`:

```json
{
  "AI": {
    "Provider": "Cohere", // Can be "OpenAI", "Anthropic", or "Cohere"
    "OpenAI": {
      "ApiKey": "your-openai-api-key",
      "Model": "gpt-4-turbo",
      "MaxTokens": 1024,
      "Temperature": 0.7
    },
    "Anthropic": {
      "ApiKey": "your-anthropic-api-key",
      "Model": "claude-v2",
      "MaxTokens": 1024,
      "Temperature": 0.7
    },
    "Cohere": {
      "ApiKey": "your-cohere-api-key",
      "Model": "command",
      "MaxTokens": 1024,
      "Temperature": 0.7
    }
  }
}
```

## Extending the Report Generation

The system currently generates PDF reports using QuestPDF. This section explains how to extend the report generation capabilities.

### Step 1: Create a New Report Template

Create a new report template class:

```csharp
public class ExecutiveSummaryReportTemplate : IDocument
{
    private readonly BatchReportDto _reportData;
    
    public ExecutiveSummaryReportTemplate(BatchReportDto reportData)
    {
        _reportData = reportData;
    }
    
    public DocumentMetadata GetMetadata()
    {
        return new DocumentMetadata
        {
            Title = $"Executive Summary Report - Batch {_reportData.BatchId}",
            Author = "Compliance Document Classifier",
            Subject = "Document Classification Executive Summary",
            Keywords = "compliance, classification, executive, summary"
        };
    }
    
    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Margin(50);
                
                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
    }
    
    // Implementation of header, content, and footer components...
}
```

### Step 2: Update the Report Generator

Modify the `ReportGenerator` class to use the new template:

```csharp
public class ReportGenerator : IReportGenerator
{
    public string GenerateBatchReport(BatchDto batch, IEnumerable<DocumentDto> documents, IEnumerable<ClassificationDto> classifications)
    {
        // Create report data
        var reportData = new BatchReportDto
        {
            BatchId = batch.BatchId,
            GenerationDate = DateTime.UtcNow,
            Documents = documents.ToList(),
            Classifications = classifications.ToList()
        };
        
        // Determine report type based on configuration or request
        bool isExecutiveSummary = true; // This could be a parameter
        
        // Generate appropriate report
        string filePath = Path.Combine(Path.GetTempPath(), $"report_{batch.BatchId}.pdf");
        
        if (isExecutiveSummary)
        {
            // Generate executive summary report
            var template = new ExecutiveSummaryReportTemplate(reportData);
            template.GeneratePdf(filePath);
        }
        else
        {
            // Generate standard batch report
            var template = new BatchReportTemplate(reportData);
            template.GeneratePdf(filePath);
        }
        
        return filePath;
    }
    
    // Other report generation methods...
}
```

## Creating Custom Processing Pipelines

The system uses a standard pipeline for document processing. This section explains how to create custom processing pipelines for specific document types or use cases.

### Step 1: Define a Custom Processing Pipeline Interface

```csharp
public interface ICustomProcessingPipeline
{
    Task<ProcessingResult> ProcessDocumentAsync(Document document);
}

public class ProcessingResult
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public Document ProcessedDocument { get; set; }
    public Classification Classification { get; set; }
}
```

### Step 2: Implement a Custom Pipeline

```csharp
public class FinancialDocumentProcessingPipeline : ICustomProcessingPipeline
{
    private readonly IDocumentParserService _documentParserService;
    private readonly IAIService _aiService;
    private readonly IFinancialDataExtractor _financialDataExtractor;
    
    public FinancialDocumentProcessingPipeline(
        IDocumentParserService documentParserService,
        IAIService aiService,
        IFinancialDataExtractor financialDataExtractor)
    {
        _documentParserService = documentParserService;
        _aiService = aiService;
        _financialDataExtractor = financialDataExtractor;
    }
    
    public async Task<ProcessingResult> ProcessDocumentAsync(Document document)
    {
        // 1. Extract text
        string text = await _documentParserService.ParseDocumentAsync(
            document.FilePath, document.FileType);
        document.UpdateContent(text);
        
        // 2. Extract financial data
        var financialData = await _financialDataExtractor.ExtractDataAsync(text);
        
        // 3. Classify document with financial context
        var aiResult = await _aiService.AnalyzeDocumentWithContextAsync(
            text, financialData);
        
        // 4. Create classification
        var classification = new Classification(
            Guid.NewGuid(),
            document.DocumentId,
            aiResult.Category,
            aiResult.RiskLevel,
            aiResult.Summary,
            "FinancialPipeline",
            aiResult.ConfidenceScore);
        
        return new ProcessingResult
        {
            Success = true,
            Message = "Financial document processed successfully",
            ProcessedDocument = document,
            Classification = classification
        };
    }
}
```

### Step 3: Register the Custom Pipeline

```csharp
public static IServiceCollection AddCustomPipelines(this IServiceCollection services)
{
    services.AddScoped<IFinancialDataExtractor, FinancialDataExtractor>();
    services.AddScoped<ICustomProcessingPipeline, FinancialDocumentProcessingPipeline>();
    
    return services;
}
```

### Step 4: Use the Custom Pipeline in a Service

```csharp
public class DocumentProcessingService : IDocumentProcessingService
{
    private readonly IDocumentParserService _documentParserService;
    private readonly IAIService _aiService;
    private readonly ICustomProcessingPipeline _financialPipeline;
    
    public DocumentProcessingService(
        IDocumentParserService documentParserService,
        IAIService aiService,
        ICustomProcessingPipeline financialPipeline)
    {
        _documentParserService = documentParserService;
        _aiService = aiService;
        _financialPipeline = financialPipeline;
    }
    
    public async Task<ProcessingResult> ProcessDocumentAsync(Document document)
    {
        // Determine if this is a financial document
        bool isFinancialDocument = document.FileName.Contains("financial") ||
                                  document.FileName.Contains("report") ||
                                  document.FileName.Contains("statement");
        
        if (isFinancialDocument)
        {
            // Use custom financial pipeline
            return await _financialPipeline.ProcessDocumentAsync(document);
        }
        else
        {
            // Use standard pipeline
            return await ProcessStandardDocumentAsync(document);
        }
    }
    
    private async Task<ProcessingResult> ProcessStandardDocumentAsync(Document document)
    {
        // Standard processing logic
        // ...
    }
}
```

## Implementing Custom Metadata Extraction

The system extracts basic metadata from documents. This section explains how to implement custom metadata extraction for specific document types.

### Step 1: Extend the DocumentMetadata Class

```csharp
public class FinancialDocumentMetadata : DocumentMetadata
{
    public string CompanyName { get; set; }
    public string ReportingPeriod { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal NetIncome { get; set; }
    public List<string> RegulatoryFrameworks { get; set; }
}
```

### Step 2: Create a Custom Metadata Extractor

```csharp
public interface ICustomMetadataExtractor
{
    Task<DocumentMetadata> ExtractMetadataAsync(string filePath, FileType fileType, string content);
}

public class FinancialMetadataExtractor : ICustomMetadataExtractor
{
    private readonly IDocumentParserService _documentParserService;
    
    public FinancialMetadataExtractor(IDocumentParserService documentParserService)
    {
        _documentParserService = documentParserService;
    }
    
    public async Task<DocumentMetadata> ExtractMetadataAsync(string filePath, FileType fileType, string content)
    {
        // Get base metadata
        var baseMetadata = await _documentParserService.ExtractMetadataAsync(filePath, fileType);
        
        // Create financial metadata
        var financialMetadata = new FinancialDocumentMetadata
        {
            PageCount = baseMetadata.PageCount,
            Author = baseMetadata.Author,
            CreationDate = baseMetadata.CreationDate,
            ModificationDate = baseMetadata.ModificationDate,
            Keywords = baseMetadata.Keywords,
            
            // Extract financial-specific metadata
            CompanyName = ExtractCompanyName(content),
            ReportingPeriod = ExtractReportingPeriod(content),
            TotalRevenue = ExtractTotalRevenue(content),
            NetIncome = ExtractNetIncome(content),
            RegulatoryFrameworks = ExtractRegulatoryFrameworks(content)
        };
        
        return financialMetadata;
    }
    
    // Helper methods for extracting specific financial metadata
    private string ExtractCompanyName(string content)
    {
        // Implementation using regex or other text analysis
        return "Example Corp";
    }
    
    private string ExtractReportingPeriod(string content)
    {
        // Implementation
        return "Q1 2025";
    }
    
    private decimal ExtractTotalRevenue(string content)
    {
        // Implementation
        return 1000000.00m;
    }
    
    private decimal ExtractNetIncome(string content)
    {
        // Implementation
        return 250000.00m;
    }
    
    private List<string> ExtractRegulatoryFrameworks(string content)
    {
        // Implementation
        return new List<string> { "GAAP", "IFRS" };
    }
}
```

### Step 3: Register the Custom Metadata Extractor

```csharp
public static IServiceCollection AddCustomMetadataExtractors(this IServiceCollection services)
{
    services.AddScoped<ICustomMetadataExtractor, FinancialMetadataExtractor>();
    
    return services;
}
```

### Step 4: Use the Custom Metadata Extractor in a Service

```csharp
public class EnhancedDocumentService : IDocumentService
{
    private readonly IDocumentParserService _documentParserService;
    private readonly ICustomMetadataExtractor _financialMetadataExtractor;
    
    public EnhancedDocumentService(
        IDocumentParserService documentParserService,
        ICustomMetadataExtractor financialMetadataExtractor)
    {
        _documentParserService = documentParserService;
        _financialMetadataExtractor = financialMetadataExtractor;
    }
    
    public async Task<DocumentDto> ProcessDocumentAsync(string filePath, FileType fileType)
    {
        // Extract text
        string content = await _documentParserService.ParseDocumentAsync(filePath, fileType);
        
        // Determine if this is a financial document
        bool isFinancialDocument = content.Contains("financial statement") ||
                                  content.Contains("balance sheet") ||
                                  content.Contains("income statement");
        
        // Extract appropriate metadata
        DocumentMetadata metadata;
        if (isFinancialDocument)
        {
            metadata = await _financialMetadataExtractor.ExtractMetadataAsync(filePath, fileType, content);
        }
        else
        {
            metadata = await _documentParserService.ExtractMetadataAsync(filePath, fileType);
        }
        
        // Create document DTO
        var documentDto = new DocumentDto
        {
            FileName = Path.GetFileName(filePath),
            FileType = fileType.ToString(),
            Content = content,
            Metadata = MapToMetadataDto(metadata)
        };
        
        return documentDto;
    }
    
    private DocumentMetadataDto MapToMetadataDto(DocumentMetadata metadata)
    {
        var dto = new DocumentMetadataDto
        {
            PageCount = metadata.PageCount,
            Author = metadata.Author,
            CreationDate = metadata.CreationDate,
            ModificationDate = metadata.ModificationDate,
            Keywords = metadata.Keywords
        };
        
        // Handle financial metadata if available
        if (metadata is FinancialDocumentMetadata financialMetadata)
        {
            dto.AdditionalProperties = new Dictionary<string, object>
            {
                { "CompanyName", financialMetadata.CompanyName },
                { "ReportingPeriod", financialMetadata.ReportingPeriod },
                { "TotalRevenue", financialMetadata.TotalRevenue },
                { "NetIncome", financialMetadata.NetIncome },
                { "RegulatoryFrameworks", financialMetadata.RegulatoryFrameworks }
            };
        }
        
        return dto;
    }
}
```

## Best Practices for Extensions

When extending the Compliance Document Classifier system, follow these best practices:

1. **Follow the Open/Closed Principle**: Extend the system through interfaces and inheritance rather than modifying existing code.

2. **Use Dependency Injection**: Register new components in the DI container to maintain loose coupling.

3. **Write Unit Tests**: Create comprehensive tests for new components to ensure they work correctly.

4. **Document Extensions**: Update documentation to reflect new capabilities and how to use them.

5. **Maintain Backward Compatibility**: Ensure extensions don't break existing functionality.

6. **Consider Performance**: Optimize extensions for performance, especially for document parsing and AI operations.

7. **Handle Errors Gracefully**: Implement proper error handling and logging in extensions.

8. **Follow Security Best Practices**: Ensure extensions maintain the security standards of the system.

9. **Use Feature Flags**: Consider using feature flags to enable/disable extensions in different environments.

10. **Versioning**: Use semantic versioning for extensions to communicate changes clearly.

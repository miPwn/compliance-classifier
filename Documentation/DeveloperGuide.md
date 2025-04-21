# Compliance Document Classifier - Developer Guide

This guide provides technical details about the Document Parser Service implementation and how to extend the system.

## Architecture Overview

The Document Parser Service follows Clean Architecture principles with clear separation of concerns:

```
┌─────────────────────────────┐
│         API Layer           │
│  (Controllers, Endpoints)   │
└───────────────┬─────────────┘
                │
┌───────────────▼─────────────┐
│     Application Layer       │
│    (Services, DTOs)         │
└───────────────┬─────────────┘
                │
┌───────────────▼─────────────┐
│     Domain Layer            │
│ (Interfaces, Entities)      │
└───────────────┬─────────────┘
                │
┌───────────────▼─────────────┐
│   Infrastructure Layer      │
│    (Implementations)        │
└─────────────────────────────┘
```

## Design Patterns

### Strategy Pattern

The Document Parser Service uses the Strategy pattern to handle different document formats:

```
┌───────────────────┐
│  IDocumentParser  │
└─────────┬─────────┘
          │
┌─────────▼─────────┐
│ BaseDocumentParser│
└─────────┬─────────┘
          │
┌─────────┼─────────┐
│         │         │
▼         ▼         ▼
┌─────┐ ┌─────┐ ┌─────┐
│ Txt │ │ Pdf │ │Docx │
│Parser│ │Parser│ │Parser│
└─────┘ └─────┘ └─────┘
```

### Factory Pattern

The Document Parser Factory creates the appropriate parser based on the file type:

```
┌────────────────────────┐
│  IDocumentParserFactory│
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│  DocumentParserFactory │
└────────────────────────┘
```

## Code Structure

### Domain Layer

#### IDocumentParser Interface

```csharp
public interface IDocumentParser
{
    Task<string> ExtractTextAsync(string filePath, FileType fileType);
    Task<DocumentMetadata> ExtractMetadataAsync(string filePath);
}
```

#### IDocumentParserFactory Interface

```csharp
public interface IDocumentParserFactory
{
    IDocumentParser CreateParser(FileType fileType);
}
```

#### IDocumentParserService Interface

```csharp
public interface IDocumentParserService
{
    Task<string> ParseDocumentAsync(string filePath, FileType fileType);
    Task<DocumentMetadata> ExtractMetadataAsync(string filePath, FileType fileType);
}
```

### Infrastructure Layer

#### BaseDocumentParser

```csharp
public abstract class BaseDocumentParser : IDocumentParser
{
    protected readonly ILogger<BaseDocumentParser> _logger;

    protected BaseDocumentParser(ILogger<BaseDocumentParser> logger)
    {
        _logger = logger;
    }

    public async Task<string> ExtractTextAsync(string filePath, FileType fileType)
    {
        // Common validation and error handling
        return await ExtractTextInternalAsync(filePath);
    }

    protected abstract Task<string> ExtractTextInternalAsync(string filePath);
    public abstract Task<DocumentMetadata> ExtractMetadataAsync(string filePath);
}
```

#### Concrete Parser Implementations

Each concrete parser implements the specific logic for parsing a particular document format:

- **TxtDocumentParser**: Uses `File.ReadAllTextAsync` to read text files
- **PdfDocumentParser**: Uses PdfPig to extract text and metadata from PDF files
- **DocxDocumentParser**: Uses DocumentFormat.OpenXml to extract text and metadata from DOCX files

#### DocumentParserFactory

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
            _ => throw new ArgumentException($"Unsupported file type: {fileType}")
        };
    }
}
```

#### DocumentParserService

```csharp
public class DocumentParserService : IDocumentParserService
{
    private readonly IDocumentParserFactory _parserFactory;
    private readonly ILogger<DocumentParserService> _logger;

    public DocumentParserService(
        IDocumentParserFactory parserFactory,
        ILogger<DocumentParserService> logger)
    {
        _parserFactory = parserFactory;
        _logger = logger;
    }

    public async Task<string> ParseDocumentAsync(string filePath, FileType fileType)
    {
        var parser = _parserFactory.CreateParser(fileType);
        return await parser.ExtractTextAsync(filePath, fileType);
    }

    public async Task<DocumentMetadata> ExtractMetadataAsync(string filePath, FileType fileType)
    {
        var parser = _parserFactory.CreateParser(fileType);
        return await parser.ExtractMetadataAsync(filePath);
    }
}
```

### Application Layer

#### DocumentParsingRequestDto

```csharp
public class DocumentParsingRequestDto
{
    public string FilePath { get; set; }
    public FileType FileType { get; set; }
    public Guid DocumentId { get; set; }
}
```

#### DocumentParsingResponseDto

```csharp
public class DocumentParsingResponseDto
{
    public Guid DocumentId { get; set; }
    public string Content { get; set; }
    public DocumentMetadataDto Metadata { get; set; }
    public bool Success { get; set; }
    public string ErrorMessage { get; set; }
}
```

#### DocumentParsingService

```csharp
public class DocumentParsingService : IDocumentParsingService
{
    private readonly IDocumentParserService _documentParserService;
    private readonly ILogger<DocumentParsingService> _logger;

    public DocumentParsingService(
        IDocumentParserService documentParserService,
        ILogger<DocumentParsingService> logger)
    {
        _documentParserService = documentParserService;
        _logger = logger;
    }

    public async Task<DocumentParsingResponseDto> ParseDocumentAsync(DocumentParsingRequestDto request)
    {
        // Implementation details
    }
}
```

## Dependency Injection

The Document Parser Service components are registered in the DependencyInjection.cs file:

```csharp
// Register document parser services
services.AddScoped<IDocumentParserFactory, DocumentParserFactory>();
services.AddScoped<IDocumentParserService, DocumentParserService>();
services.AddScoped<IDocumentParsingService, DocumentParsingService>();

// Register document parsers
services.AddScoped<TxtDocumentParser>();
services.AddScoped<PdfDocumentParser>();
services.AddScoped<DocxDocumentParser>();
```

## Extending the System

### Adding a New Document Type

1. Add the new file type to the FileType enum:

```csharp
public enum FileType
{
    PDF,
    DOCX,
    TXT,
    NewFormat
}
```

2. Create a new parser implementation:

```csharp
public class NewFormatDocumentParser : BaseDocumentParser
{
    public NewFormatDocumentParser(ILogger<NewFormatDocumentParser> logger) 
        : base(logger)
    {
    }

    protected override async Task<string> ExtractTextInternalAsync(string filePath)
    {
        // Implement text extraction for the new format
    }

    public override async Task<DocumentMetadata> ExtractMetadataAsync(string filePath)
    {
        // Implement metadata extraction for the new format
    }
}
```

3. Update the DocumentParserFactory:

```csharp
public IDocumentParser CreateParser(FileType fileType)
{
    return fileType switch
    {
        FileType.PDF => _serviceProvider.GetRequiredService<PdfDocumentParser>(),
        FileType.DOCX => _serviceProvider.GetRequiredService<DocxDocumentParser>(),
        FileType.TXT => _serviceProvider.GetRequiredService<TxtDocumentParser>(),
        FileType.NewFormat => _serviceProvider.GetRequiredService<NewFormatDocumentParser>(),
        _ => throw new ArgumentException($"Unsupported file type: {fileType}")
    };
}
```

4. Register the new parser in DependencyInjection.cs:

```csharp
services.AddScoped<NewFormatDocumentParser>();
```

### Enhancing Existing Parsers

To enhance an existing parser, you can modify the implementation to add new features:

```csharp
public class EnhancedPdfDocumentParser : PdfDocumentParser
{
    public EnhancedPdfDocumentParser(ILogger<EnhancedPdfDocumentParser> logger) 
        : base(logger)
    {
    }

    protected override async Task<string> ExtractTextInternalAsync(string filePath)
    {
        var baseText = await base.ExtractTextInternalAsync(filePath);
        // Add additional processing
        return baseText;
    }

    public override async Task<DocumentMetadata> ExtractMetadataAsync(string filePath)
    {
        var baseMetadata = await base.ExtractMetadataAsync(filePath);
        // Add additional metadata
        return baseMetadata;
    }
}
```

## Testing

The Document Parser Service is designed to be testable. Here's an example of how to test a document parser:

```csharp
[Fact]
public async Task TxtDocumentParser_ExtractTextAsync_ShouldReturnFileContent()
{
    // Arrange
    var loggerMock = new Mock<ILogger<TxtDocumentParser>>();
    var parser = new TxtDocumentParser(loggerMock.Object);
    var filePath = "test.txt";
    var fileContent = "Test content";
    
    File.WriteAllText(filePath, fileContent);

    // Act
    var result = await parser.ExtractTextAsync(filePath, FileType.TXT);

    // Assert
    Assert.Equal(fileContent, result);
    
    // Cleanup
    File.Delete(filePath);
}
```

## Performance Considerations

- **Asynchronous Operations**: All parsing operations are asynchronous to avoid blocking the main thread
- **Memory Usage**: Large files are processed efficiently to minimize memory usage
- **Error Handling**: Comprehensive error handling ensures the system is robust

## Security Considerations

- **File Access**: The system only accesses files that are explicitly provided
- **Input Validation**: All inputs are validated to prevent security issues
- **Error Messages**: Error messages are designed to be informative without revealing sensitive information

## Conclusion

The Document Parser Service is designed to be robust, extensible, and maintainable. By following Clean Architecture principles and implementing the Strategy pattern, the service can be easily extended to support new document types and enhanced with new features.
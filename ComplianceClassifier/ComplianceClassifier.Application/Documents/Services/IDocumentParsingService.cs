using ComplianceClassifier.Application.Documents.DTOs;

namespace ComplianceClassifier.Application.Documents.Services;

/// <summary>
/// Interface for document parsing service in the application layer
/// </summary>
public interface IDocumentParsingService
{
    /// <summary>
    /// Parses a document and extracts its content and metadata
    /// </summary>
    /// <param name="request">Document parsing request</param>
    /// <returns>Document parsing response</returns>
    Task<DocumentParsingResponseDto> ParseDocumentAsync(DocumentParsingRequestDto request);
}
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.ValueObjects;

namespace ComplianceClassifier.Domain.Interfaces;

/// <summary>
/// Interface for document parsing service
/// </summary>
public interface IDocumentParserService
{
    /// <summary>
    /// Parses a document file and extracts text content
    /// </summary>
    /// <param name="filePath">Path to document file</param>
    /// <param name="fileType">Type of file</param>
    /// <returns>Extracted text content</returns>
    Task<string> ParseDocumentAsync(string filePath, FileType fileType);

    /// <summary>
    /// Extracts metadata from a document file
    /// </summary>
    /// <param name="filePath">Path to document file</param>
    /// <param name="fileType">Type of file</param>
    /// <returns>Document metadata</returns>
    Task<DocumentMetadata> ExtractMetadataAsync(string filePath, FileType fileType);
}
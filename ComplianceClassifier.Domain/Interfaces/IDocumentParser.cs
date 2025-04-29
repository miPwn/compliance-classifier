using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.ValueObjects;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Interface for document parsing operations
    /// </summary>
    public interface IDocumentParser
    {
        /// <summary>
        /// Extracts text from a document file
        /// </summary>
        /// <param name="filePath">Path to document file</param>
        /// <param name="fileType">Type of file</param>
        /// <returns>Extracted text</returns>
        Task<string> ExtractTextAsync(string filePath, FileType fileType);
        
        /// <summary>
        /// Extracts metadata from a document file
        /// </summary>
        /// <param name="filePath">Path to document file</param>
        /// <returns>Document metadata</returns>
        Task<DocumentMetadata> ExtractMetadataAsync(string filePath);
    }
}
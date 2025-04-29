using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.ValueObjects;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Service interface for document processing operations
    /// </summary>
    public interface IDocumentProcessingService
    {
        /// <summary>
        /// Extracts text content from a document
        /// </summary>
        /// <param name="document">Document to process</param>
        /// <returns>Extracted text content</returns>
        Task<string> ExtractTextAsync(Document document);
        
        /// <summary>
        /// Validates a document for processing
        /// </summary>
        /// <param name="document">Document to validate</param>
        /// <returns>True if document is valid, false otherwise</returns>
        Task<bool> ValidateDocumentAsync(Document document);
        
        /// <summary>
        /// Enriches a document with metadata
        /// </summary>
        /// <param name="document">Document to enrich</param>
        /// <returns>Extracted document metadata</returns>
        Task<DocumentMetadata> EnrichMetadataAsync(Document document);
    }
}
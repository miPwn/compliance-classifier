using ComplianceClassifier.Domain.Aggregates.Classification;
using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Service interface for document classification operations
    /// </summary>
    public interface IDocumentClassificationService
    {
        /// <summary>
        /// Classifies a document using AI
        /// </summary>
        /// <param name="document">Document to classify</param>
        /// <returns>Classification result</returns>
        Task<Classification> ClassifyDocumentAsync(Document document);
        
        /// <summary>
        /// Assigns a risk level to a document based on its content and classification
        /// </summary>
        /// <param name="document">Document to assess</param>
        /// <param name="classification">Classification information</param>
        /// <returns>Assigned risk level</returns>
        Task<RiskLevel> AssignRiskLevelAsync(Document document, Classification classification);
        
        /// <summary>
        /// Generates a summary for a document
        /// </summary>
        /// <param name="document">Document to summarize</param>
        /// <returns>Generated summary</returns>
        Task<string> GenerateSummaryAsync(Document document);
    }
}
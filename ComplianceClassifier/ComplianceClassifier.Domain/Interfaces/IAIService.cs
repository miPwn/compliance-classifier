using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Service interface for AI operations
    /// </summary>
    public interface IAIService
    {
        /// <summary>
        /// Analyzes document content using AI
        /// </summary>
        /// <param name="documentText">Document text content</param>
        /// <returns>AI analysis result</returns>
        Task<AIAnalysisResult> AnalyzeDocumentAsync(string documentText);
    }

    /// <summary>
    /// Result of AI analysis
    /// </summary>
    public class AIAnalysisResult
    {
        /// <summary>
        /// Classified category
        /// </summary>
        public CategoryType Category { get; set; }
        
        /// <summary>
        /// Assigned risk level
        /// </summary>
        public RiskLevel RiskLevel { get; set; }
        
        /// <summary>
        /// Generated summary
        /// </summary>
        public string Summary { get; set; }
        
        /// <summary>
        /// Confidence score (0-1)
        /// </summary>
        public decimal ConfidenceScore { get; set; }
    }
}
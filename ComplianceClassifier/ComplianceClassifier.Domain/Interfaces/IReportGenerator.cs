using ComplianceClassifier.Domain.Aggregates.Classification;
using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.Aggregates.Batch;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Interface for report generation operations
    /// </summary>
    public interface IReportGenerator
    {
        /// <summary>
        /// Generates a single document report
        /// </summary>
        /// <param name="document">Document data</param>
        /// <param name="classification">Classification data</param>
        /// <returns>Path to generated PDF</returns>
        string GenerateSingleReport(Document document, Classification classification);
        
        /// <summary>
        /// Generates a batch summary report
        /// </summary>
        /// <param name="batch">Batch data</param>
        /// <param name="documents">List of documents</param>
        /// <param name="classifications">List of classifications</param>
        /// <returns>Path to generated PDF</returns>
        string GenerateBatchReport(Batch batch, IEnumerable<Document> documents, IEnumerable<Classification> classifications);
    }
}
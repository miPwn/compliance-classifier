using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ComplianceClassifier.Domain.Aggregates.Batch;
using ComplianceClassifier.Domain.Aggregates.Classification;
using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.Aggregates.Report;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Service interface for report generation operations
    /// </summary>
    public interface IReportGenerationService
    {
        /// <summary>
        /// Generates a report for a single document
        /// </summary>
        /// <param name="document">Document to generate report for</param>
        /// <param name="classification">Classification information</param>
        /// <returns>Generated report</returns>
        Task<Report> GenerateSingleReportAsync(Document document, Classification classification);
        
        /// <summary>
        /// Generates a summary report for a batch of documents
        /// </summary>
        /// <param name="batch">Batch to generate report for</param>
        /// <param name="classifications">List of classifications in the batch</param>
        /// <returns>Generated report</returns>
        Task<Report> GenerateBatchReportAsync(Batch batch, IEnumerable<Classification> classifications);
    }
}
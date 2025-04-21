using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Repository interface for Document aggregate
    /// </summary>
    public interface IDocumentRepository : IRepository<Document>
    {
        Task<IEnumerable<Document>> GetByBatchIdAsync(Guid batchId);
        Task<Document> GetWithContentAsync(Guid id);
        Task UpdateStatusAsync(Guid id, DocumentStatus status);
        Task UpdateContentAsync(Guid id, string content);
    }
}
using ComplianceClassifier.Domain.Aggregates.Batch;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Repository interface for Batch aggregate
    /// </summary>
    public interface IBatchRepository : IRepository<Batch>
    {
        Task<IEnumerable<Batch>> GetByUserIdAsync(string userId);
        Task<IEnumerable<Batch>> GetByStatusAsync(BatchStatus status);
        Task<IEnumerable<Batch>> GetCompletedBatchesAsync();
        Task<IEnumerable<Batch>> GetRecentBatchesAsync(int count);
        Task UpdateStatusAsync(Guid id, BatchStatus status);
        Task IncrementProcessedDocumentsAsync(Guid id);
    }
}
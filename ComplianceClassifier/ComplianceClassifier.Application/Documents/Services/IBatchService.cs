using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Application.Documents.Services;

/// <summary>
/// Interface for batch service in the application layer
/// </summary>
public interface IBatchService
{
    /// <summary>
    /// Creates a new batch
    /// </summary>
    /// <param name="createBatchDto">Batch creation data</param>
    /// <returns>Created batch</returns>
    Task<BatchDto> CreateBatchAsync(CreateBatchDto createBatchDto);

    /// <summary>
    /// Gets a batch by ID
    /// </summary>
    /// <param name="batchId">Batch ID</param>
    /// <returns>Batch details</returns>
    Task<BatchDto> GetBatchByIdAsync(Guid batchId);

    /// <summary>
    /// Gets all batches
    /// </summary>
    /// <returns>List of batches</returns>
    Task<IEnumerable<BatchDto>> GetAllBatchesAsync();

    /// <summary>
    /// Gets batches by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of batches</returns>
    Task<IEnumerable<BatchDto>> GetBatchesByUserIdAsync(string userId);

    /// <summary>
    /// Gets batches by status
    /// </summary>
    /// <param name="status">Batch status</param>
    /// <returns>List of batches</returns>
    Task<IEnumerable<BatchDto>> GetBatchesByStatusAsync(BatchStatus status);

    /// <summary>
    /// Gets recent batches
    /// </summary>
    /// <param name="count">Number of batches to retrieve</param>
    /// <returns>List of batches</returns>
    Task<IEnumerable<BatchDto>> GetRecentBatchesAsync(int count);

    /// <summary>
    /// Updates batch status
    /// </summary>
    /// <param name="batchId">Batch ID</param>
    /// <param name="status">New status</param>
    /// <returns>Updated batch</returns>
    Task<BatchDto> UpdateBatchStatusAsync(Guid batchId, BatchStatus status);

    /// <summary>
    /// Adds documents to a batch
    /// </summary>
    /// <param name="batchId">Batch ID</param>
    /// <param name="count">Number of documents to add</param>
    /// <returns>Updated batch</returns>
    Task<BatchDto> AddDocumentsToBatchAsync(Guid batchId, int count);
}
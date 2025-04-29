using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Domain.Aggregates.Batch;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;

namespace ComplianceClassifier.Application.Documents.Services
{
    /// <summary>
    /// Implementation of batch service
    /// </summary>
    public class BatchService : IBatchService
    {
        private readonly IBatchRepository _batchRepository;

        public BatchService(IBatchRepository batchRepository)
        {
            _batchRepository = batchRepository ?? throw new ArgumentNullException(nameof(batchRepository));
        }

        public async Task<BatchDto> CreateBatchAsync(CreateBatchDto createBatchDto)
        {
            var batchId = Guid.NewGuid();
            var batch = new Batch(batchId, createBatchDto.UserId);
            
            await _batchRepository.AddAsync(batch);
            
            return MapToDto(batch);
        }

        public async Task<BatchDto> GetBatchByIdAsync(Guid batchId)
        {
            var batch = await _batchRepository.GetByIdAsync(batchId);
            if (batch == null)
            {
                throw new KeyNotFoundException($"Batch with ID {batchId} not found");
            }
            
            return MapToDto(batch);
        }

        public async Task<IEnumerable<BatchDto>> GetAllBatchesAsync()
        {
            var batches = await _batchRepository.GetAllAsync();
            return batches.Select(MapToDto);
        }

        public async Task<IEnumerable<BatchDto>> GetBatchesByUserIdAsync(string userId)
        {
            var batches = await _batchRepository.GetByUserIdAsync(userId);
            return batches.Select(MapToDto);
        }

        public async Task<IEnumerable<BatchDto>> GetBatchesByStatusAsync(BatchStatus status)
        {
            var batches = await _batchRepository.GetByStatusAsync(status);
            return batches.Select(MapToDto);
        }

        public async Task<IEnumerable<BatchDto>> GetRecentBatchesAsync(int count)
        {
            var batches = await _batchRepository.GetRecentBatchesAsync(count);
            return batches.Select(MapToDto);
        }

        public async Task<BatchDto> UpdateBatchStatusAsync(Guid batchId, BatchStatus status)
        {
            await _batchRepository.UpdateStatusAsync(batchId, status);
            var batch = await _batchRepository.GetByIdAsync(batchId);
            
            if (batch == null)
            {
                throw new KeyNotFoundException($"Batch with ID {batchId} not found");
            }
            
            return MapToDto(batch);
        }

        public async Task<BatchDto> AddDocumentsToBatchAsync(Guid batchId, int count)
        {
            var batch = await _batchRepository.GetByIdAsync(batchId);
            
            if (batch == null)
            {
                throw new KeyNotFoundException($"Batch with ID {batchId} not found");
            }
            
            batch.AddDocuments(count);
            await _batchRepository.UpdateAsync(batch);
            
            return MapToDto(batch);
        }

        private static BatchDto MapToDto(Batch batch)
        {
            return new BatchDto
            {
                BatchId = batch.BatchId,
                UploadDate = batch.UploadDate,
                UserId = batch.UserId,
                Status = batch.Status.ToString(),
                TotalDocuments = batch.TotalDocuments,
                ProcessedDocuments = batch.ProcessedDocuments,
                CompletionDate = batch.CompletionDate,
                CompletionPercentage = batch.GetCompletionPercentage()
            };
        }
    }
}
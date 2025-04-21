using System;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Aggregates.Batch
{
    /// <summary>
    /// Batch aggregate root
    /// </summary>
    public class Batch
    {
        public Guid BatchId { get; private set; }
        public DateTime UploadDate { get; private set; }
        public string UserId { get; private set; }
        public BatchStatus Status { get; private set; }
        public int TotalDocuments { get; private set; }
        public int ProcessedDocuments { get; private set; }
        public DateTime? CompletionDate { get; private set; }

        // For EF Core
        private Batch() { }

        public Batch(Guid batchId, string userId)
        {
            BatchId = batchId;
            UserId = userId;
            UploadDate = DateTime.UtcNow;
            Status = BatchStatus.Pending;
            TotalDocuments = 0;
            ProcessedDocuments = 0;
            CompletionDate = null;
        }

        public void AddDocuments(int count)
        {
            TotalDocuments += count;
        }

        public void IncrementProcessedDocuments()
        {
            ProcessedDocuments++;
            
            if (ProcessedDocuments >= TotalDocuments)
            {
                Status = BatchStatus.Completed;
                CompletionDate = DateTime.UtcNow;
            }
        }

        public void StartProcessing()
        {
            Status = BatchStatus.Processing;
        }

        public void MarkAsCompleted()
        {
            Status = BatchStatus.Completed;
            CompletionDate = DateTime.UtcNow;
        }

        public void MarkAsError()
        {
            Status = BatchStatus.Error;
        }

        public bool IsCompleted()
        {
            return Status == BatchStatus.Completed;
        }

        public bool HasError()
        {
            return Status == BatchStatus.Error;
        }

        public double GetCompletionPercentage()
        {
            if (TotalDocuments == 0)
                return 0;

            return (double)ProcessedDocuments / TotalDocuments * 100;
        }
    }
}
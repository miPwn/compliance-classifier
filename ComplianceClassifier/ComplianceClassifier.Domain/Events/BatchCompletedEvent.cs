namespace ComplianceClassifier.Domain.Events
{
    /// <summary>
    /// Event raised when a batch processing is completed
    /// </summary>
    public class BatchCompletedEvent : DomainEvent
    {
        public Guid BatchId { get; }
        public int TotalDocuments { get; }
        public int ProcessedDocuments { get; }
        public int SuccessfulDocuments { get; }
        public int FailedDocuments { get; }

        public BatchCompletedEvent(
            Guid batchId, 
            int totalDocuments, 
            int processedDocuments, 
            int successfulDocuments, 
            int failedDocuments)
            : base()
        {
            BatchId = batchId;
            TotalDocuments = totalDocuments;
            ProcessedDocuments = processedDocuments;
            SuccessfulDocuments = successfulDocuments;
            FailedDocuments = failedDocuments;
        }
    }
}
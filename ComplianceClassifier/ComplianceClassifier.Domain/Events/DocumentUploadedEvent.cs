namespace ComplianceClassifier.Domain.Events
{
    /// <summary>
    /// Event raised when a document is uploaded
    /// </summary>
    public class DocumentUploadedEvent : DomainEvent
    {
        public Guid DocumentId { get; }
        public Guid BatchId { get; }
        public string FileName { get; }

        public DocumentUploadedEvent(Guid documentId, Guid batchId, string fileName)
            : base()
        {
            DocumentId = documentId;
            BatchId = batchId;
            FileName = fileName;
        }
    }
}
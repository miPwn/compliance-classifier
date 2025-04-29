using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.ValueObjects;

namespace ComplianceClassifier.Domain.Aggregates.Document
{
    /// <summary>
    /// Document aggregate root
    /// </summary>
    public class Document
    {
        public Guid DocumentId { get; private set; }
        public string FileName { get; private set; }
        public FileType FileType { get; private set; }
        public long FileSize { get; private set; }
        public DateTime UploadDate { get; private set; }
        public string Content { get; private set; }
        public DocumentStatus Status { get; private set; }
        public Guid BatchId { get; private set; }
        public DocumentMetadata Metadata { get; private set; }

        // For EF Core
        private Document() { }

        public Document(
            Guid documentId,
            string fileName,
            FileType fileType,
            long fileSize,
            Guid batchId)
        {
            DocumentId = documentId;
            FileName = fileName;
            FileType = fileType;
            FileSize = fileSize;
            BatchId = batchId;
            UploadDate = DateTime.UtcNow;
            Status = DocumentStatus.Pending;
            Content = string.Empty;
        }

        public void UpdateContent(string content)
        {
            Content = content;
        }

        public void UpdateStatus(DocumentStatus status)
        {
            Status = status;
        }

        public void EnrichMetadata(DocumentMetadata metadata)
        {
            Metadata = metadata;
        }

        public bool IsProcessed()
        {
            return Status == DocumentStatus.Classified;
        }

        public bool HasError()
        {
            return Status == DocumentStatus.Error;
        }
    }
}
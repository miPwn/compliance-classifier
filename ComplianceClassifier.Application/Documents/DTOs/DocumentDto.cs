namespace ComplianceClassifier.Application.Documents.DTOs
{
    /// <summary>
    /// Data transfer object for Document
    /// </summary>
    public class DocumentDto
    {
        public Guid DocumentId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
        public Guid BatchId { get; set; }
        public DocumentMetadataDto Metadata { get; set; }
    }

    /// <summary>
    /// Data transfer object for DocumentMetadata
    /// </summary>
    public class DocumentMetadataDto
    {
        public int PageCount { get; set; }
        public string Author { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationDate { get; set; }
        public string[] Keywords { get; set; }
    }
}
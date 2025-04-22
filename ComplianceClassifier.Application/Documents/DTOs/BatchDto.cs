using System;
using System.Collections.Generic;

namespace ComplianceClassifier.Application.Documents.DTOs
{
    /// <summary>
    /// Data transfer object for Batch
    /// </summary>
    public class BatchDto
    {
        public Guid BatchId { get; set; }
        public DateTime UploadDate { get; set; }
        public string UserId { get; set; }
        public string Status { get; set; }
        public int TotalDocuments { get; set; }
        public int ProcessedDocuments { get; set; }
        public DateTime? CompletionDate { get; set; }
        public double CompletionPercentage { get; set; }
    }

    /// <summary>
    /// Data transfer object for creating a new batch
    /// </summary>
    public class CreateBatchDto
    {
        public string UserId { get; set; }
    }

    /// <summary>
    /// Data transfer object for adding documents to a batch
    /// </summary>
    public class AddDocumentsToBatchDto
    {
        public Guid BatchId { get; set; }
        public List<Guid> DocumentIds { get; set; }
    }
}
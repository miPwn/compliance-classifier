using System;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Events
{
    /// <summary>
    /// Event raised when a report is generated
    /// </summary>
    public class ReportGeneratedEvent : DomainEvent
    {
        public Guid ReportId { get; }
        public Guid? BatchId { get; }
        public Guid? DocumentId { get; }
        public ReportType ReportType { get; }
        public string FilePath { get; }

        public ReportGeneratedEvent(
            Guid reportId,
            Guid? batchId,
            Guid? documentId,
            ReportType reportType,
            string filePath)
            : base()
        {
            ReportId = reportId;
            BatchId = batchId;
            DocumentId = documentId;
            ReportType = reportType;
            FilePath = filePath;
        }
    }
}
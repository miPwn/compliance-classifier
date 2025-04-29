using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Aggregates.Report
{
    /// <summary>
    /// Report aggregate root
    /// </summary>
    public class Report
    {
        public Guid ReportId { get; private set; }
        public Guid? BatchId { get; private set; }
        public Guid? DocumentId { get; private set; }
        public DateTime GenerationDate { get; private set; }
        public ReportType ReportType { get; private set; }
        public string FilePath { get; private set; }

        // For EF Core
        private Report() { }

        public Report(
            Guid reportId,
            ReportType reportType,
            string filePath)
        {
            ReportId = reportId;
            ReportType = reportType;
            FilePath = filePath;
            GenerationDate = DateTime.UtcNow;
        }

        public static Report CreateSingleDocumentReport(
            Guid reportId,
            Guid documentId,
            string filePath)
        {
            var report = new Report(reportId, ReportType.SingleDocument, filePath)
            {
                DocumentId = documentId
            };
            return report;
        }

        public static Report CreateBatchReport(
            Guid reportId,
            Guid batchId,
            string filePath)
        {
            var report = new Report(reportId, ReportType.BatchSummary, filePath)
            {
                BatchId = batchId
            };
            return report;
        }

        public bool IsSingleDocumentReport()
        {
            return ReportType == ReportType.SingleDocument;
        }

        public bool IsBatchReport()
        {
            return ReportType == ReportType.BatchSummary;
        }

        public void UpdateFilePath(string filePath)
        {
            FilePath = filePath;
        }
    }
}
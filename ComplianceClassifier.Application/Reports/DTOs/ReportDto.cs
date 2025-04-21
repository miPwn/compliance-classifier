using System;

namespace ComplianceClassifier.Application.Reports.DTOs
{
    /// <summary>
    /// Data transfer object for Report
    /// </summary>
    public class ReportDto
    {
        public Guid ReportId { get; set; }
        public Guid? BatchId { get; set; }
        public Guid? DocumentId { get; set; }
        public DateTime GenerationDate { get; set; }
        public string ReportType { get; set; }
        public string FilePath { get; set; }
        public string DownloadUrl { get; set; }
    }
}
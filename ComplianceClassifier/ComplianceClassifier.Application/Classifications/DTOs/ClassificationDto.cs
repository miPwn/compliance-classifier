namespace ComplianceClassifier.Application.Classifications.DTOs
{
    /// <summary>
    /// Data transfer object for Classification
    /// </summary>
    public class ClassificationDto
    {
        public Guid ClassificationId { get; set; }
        public Guid DocumentId { get; set; }
        public string Category { get; set; }
        public string RiskLevel { get; set; }
        public string Summary { get; set; }
        public DateTime ClassificationDate { get; set; }
        public string ClassifiedBy { get; set; }
        public decimal ConfidenceScore { get; set; }
        public bool IsOverridden { get; set; }
    }

    /// <summary>
    /// Data transfer object for Classification override request
    /// </summary>
    public class ClassificationOverrideDto
    {
        public string Category { get; set; }
        public string RiskLevel { get; set; }
        public string Summary { get; set; }
    }
}
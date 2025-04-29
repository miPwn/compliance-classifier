using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Events
{
    /// <summary>
    /// Event raised when a document is classified
    /// </summary>
    public class DocumentClassifiedEvent : DomainEvent
    {
        public Guid DocumentId { get; }
        public Guid ClassificationId { get; }
        public CategoryType Category { get; }
        public RiskLevel RiskLevel { get; }
        public decimal ConfidenceScore { get; }
        public string ClassifiedBy { get; }

        public DocumentClassifiedEvent(
            Guid documentId, 
            Guid classificationId, 
            CategoryType category, 
            RiskLevel riskLevel, 
            decimal confidenceScore, 
            string classifiedBy)
            : base()
        {
            DocumentId = documentId;
            ClassificationId = classificationId;
            Category = category;
            RiskLevel = riskLevel;
            ConfidenceScore = confidenceScore;
            ClassifiedBy = classifiedBy;
        }
    }
}
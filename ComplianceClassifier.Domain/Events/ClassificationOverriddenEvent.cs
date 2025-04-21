using System;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Events
{
    /// <summary>
    /// Event raised when a classification is manually overridden
    /// </summary>
    public class ClassificationOverriddenEvent : DomainEvent
    {
        public Guid ClassificationId { get; }
        public Guid DocumentId { get; }
        public CategoryType OriginalCategory { get; }
        public CategoryType NewCategory { get; }
        public RiskLevel OriginalRiskLevel { get; }
        public RiskLevel NewRiskLevel { get; }
        public string OverriddenBy { get; }

        public ClassificationOverriddenEvent(
            Guid classificationId,
            Guid documentId,
            CategoryType originalCategory,
            CategoryType newCategory,
            RiskLevel originalRiskLevel,
            RiskLevel newRiskLevel,
            string overriddenBy)
            : base()
        {
            ClassificationId = classificationId;
            DocumentId = documentId;
            OriginalCategory = originalCategory;
            NewCategory = newCategory;
            OriginalRiskLevel = originalRiskLevel;
            NewRiskLevel = newRiskLevel;
            OverriddenBy = overriddenBy;
        }
    }
}
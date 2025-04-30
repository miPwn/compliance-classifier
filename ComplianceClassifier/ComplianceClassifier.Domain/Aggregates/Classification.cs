using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Aggregates;

/// <summary>
/// Classification aggregate root
/// </summary>
public class Classification
{
    public Guid ClassificationId { get; private set; }
    public Guid DocumentId { get; private set; }
    public CategoryType Category { get; private set; }
    public RiskLevel RiskLevel { get; private set; }
    public string Summary { get; private set; }
    public DateTime ClassificationDate { get; private set; }
    public string ClassifiedBy { get; private set; }
    public decimal ConfidenceScore { get; }
    public bool IsOverridden { get; private set; }

    // For EF Core
    private Classification() { }

    public Classification(
        Guid classificationId,
        Guid documentId,
        CategoryType category,
        RiskLevel riskLevel,
        string summary,
        string classifiedBy,
        decimal confidenceScore)
    {
        ClassificationId = classificationId;
        DocumentId = documentId;
        Category = category;
        RiskLevel = riskLevel;
        Summary = summary;
        ClassificationDate = DateTime.UtcNow;
        ClassifiedBy = classifiedBy;
        ConfidenceScore = confidenceScore;
        IsOverridden = false;
    }

    public void Override(CategoryType category, RiskLevel riskLevel, string summary, string overriddenBy)
    {
        Category = category;
        RiskLevel = riskLevel;
            
        if (!string.IsNullOrWhiteSpace(summary))
        {
            Summary = summary;
        }
            
        ClassifiedBy = overriddenBy;
        IsOverridden = true;
    }

    public bool IsHighRisk()
    {
        return RiskLevel == RiskLevel.High;
    }

    public bool IsLowConfidence()
    {
        return ConfidenceScore < 0.7m;
    }
}
namespace ComplianceClassifier.Domain.Enums;

/// <summary>
/// Represents the processing status of a document
/// </summary>
public enum DocumentStatus
{
    Pending,
    Processing,
    Classified,
    Error
}
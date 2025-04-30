namespace ComplianceClassifier.Domain.Enums;

/// <summary>
/// Represents the processing status of a batch
/// </summary>
public enum BatchStatus
{
    Pending,
    Processing,
    Completed,
    Error
}
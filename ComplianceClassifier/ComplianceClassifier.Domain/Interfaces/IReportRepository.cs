using ComplianceClassifier.Domain.Aggregates;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Interfaces;

/// <summary>
/// Repository interface for Report aggregate
/// </summary>
public interface IReportRepository : IRepository<Report>
{
    Task<Report> GetByDocumentIdAsync(Guid documentId);
    Task<Report> GetByBatchIdAsync(Guid batchId);
    Task<IEnumerable<Report>> GetByReportTypeAsync(ReportType reportType);
    Task<IEnumerable<Report>> GetRecentReportsAsync(int count);
    Task UpdateFilePathAsync(Guid id, string filePath);
}
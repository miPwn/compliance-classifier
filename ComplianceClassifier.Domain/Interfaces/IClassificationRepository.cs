using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ComplianceClassifier.Domain.Aggregates.Classification;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Repository interface for Classification aggregate
    /// </summary>
    public interface IClassificationRepository : IRepository<Classification>
    {
        Task<Classification> GetByDocumentIdAsync(Guid documentId);
        Task<IEnumerable<Classification>> GetByBatchIdAsync(Guid batchId);
        Task<IEnumerable<Classification>> GetByCategoryAsync(CategoryType category);
        Task<IEnumerable<Classification>> GetByRiskLevelAsync(RiskLevel riskLevel);
        Task<IEnumerable<Classification>> GetOverriddenClassificationsAsync();
    }
}
using Microsoft.EntityFrameworkCore;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Domain.Aggregates;

namespace ComplianceClassifier.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementation of the classification repository
/// </summary>
public class ClassificationRepository : IClassificationRepository
{
    private readonly ApplicationDbContext _context;

    public ClassificationRepository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Classification> GetByIdAsync(Guid id)
    {
        return await _context.Classifications.FindAsync(id);
    }

    public async Task<IEnumerable<Classification>> GetAllAsync()
    {
        return await _context.Classifications.ToListAsync();
    }

    public async Task<Classification> AddAsync(Classification entity)
    {
        await _context.Classifications.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Classification entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var classification = await _context.Classifications.FindAsync(id);
        if (classification != null)
        {
            _context.Classifications.Remove(classification);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Classification> GetByDocumentIdAsync(Guid documentId)
    {
        return await _context.Classifications
            .FirstOrDefaultAsync(c => c.DocumentId == documentId);
    }

    public async Task<IEnumerable<Classification>> GetByBatchIdAsync(Guid batchId)
    {
        return await _context.Classifications
            .Join(_context.Documents,
                c => c.DocumentId,
                d => d.DocumentId,
                (c, d) => new { Classification = c, Document = d })
            .Where(x => x.Document.BatchId == batchId)
            .Select(x => x.Classification)
            .ToListAsync();
    }

    public async Task<IEnumerable<Classification>> GetByCategoryAsync(CategoryType category)
    {
        return await _context.Classifications
            .Where(c => c.Category == category)
            .ToListAsync();
    }

    public async Task<IEnumerable<Classification>> GetByRiskLevelAsync(RiskLevel riskLevel)
    {
        return await _context.Classifications
            .Where(c => c.RiskLevel == riskLevel)
            .ToListAsync();
    }

    public async Task<IEnumerable<Classification>> GetOverriddenClassificationsAsync()
    {
        return await _context.Classifications
            .Where(c => c.IsOverridden)
            .ToListAsync();
    }
}
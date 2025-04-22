using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;

namespace ComplianceClassifier.Infrastructure.Persistence.Repositories
{
    /// <summary>
    /// Implementation of the document repository
    /// </summary>
    public class DocumentRepository : IDocumentRepository
    {
        private readonly ApplicationDbContext _context;

        public DocumentRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Document> GetByIdAsync(Guid id)
        {
            return await _context.Documents
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.DocumentId == id);
        }

        public async Task<IEnumerable<Document>> GetAllAsync()
        {
            return await _context.Documents
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Document> AddAsync(Document entity)
        {
            await _context.Documents.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(Document entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document != null)
            {
                _context.Documents.Remove(document);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Document>> GetByBatchIdAsync(Guid batchId)
        {
            return await _context.Documents
                .Where(d => d.BatchId == batchId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Document> GetWithContentAsync(Guid id)
        {
            return await _context.Documents
                .FirstOrDefaultAsync(d => d.DocumentId == id);
        }

        public async Task UpdateStatusAsync(Guid id, DocumentStatus status)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document != null)
            {
                document.UpdateStatus(status);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateContentAsync(Guid id, string content)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document != null)
            {
                document.UpdateContent(content);
                await _context.SaveChangesAsync();
            }
        }
    }
}
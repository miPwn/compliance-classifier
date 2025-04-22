using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ComplianceClassifier.Domain.Aggregates.Batch;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;

namespace ComplianceClassifier.Infrastructure.Persistence.Repositories
{
    /// <summary>
    /// Implementation of the batch repository
    /// </summary>
    public class BatchRepository : IBatchRepository
    {
        private readonly ApplicationDbContext _context;

        public BatchRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Batch> GetByIdAsync(Guid id)
        {
            return await _context.Batches.FindAsync(id);
        }

        public async Task<IEnumerable<Batch>> GetAllAsync()
        {
            return await _context.Batches.ToListAsync();
        }

        public async Task<Batch> AddAsync(Batch entity)
        {
            await _context.Batches.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(Batch entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var batch = await _context.Batches.FindAsync(id);
            if (batch != null)
            {
                _context.Batches.Remove(batch);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Batch>> GetByUserIdAsync(string userId)
        {
            return await _context.Batches
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.UploadDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Batch>> GetByStatusAsync(BatchStatus status)
        {
            return await _context.Batches
                .Where(b => b.Status == status)
                .OrderByDescending(b => b.UploadDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Batch>> GetCompletedBatchesAsync()
        {
            return await _context.Batches
                .Where(b => b.Status == BatchStatus.Completed)
                .OrderByDescending(b => b.CompletionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Batch>> GetRecentBatchesAsync(int count)
        {
            return await _context.Batches
                .OrderByDescending(b => b.UploadDate)
                .Take(count)
                .ToListAsync();
        }

        public async Task UpdateStatusAsync(Guid id, BatchStatus status)
        {
            var batch = await _context.Batches.FindAsync(id);
            if (batch != null)
            {
                if (status == BatchStatus.Completed)
                {
                    batch.MarkAsCompleted();
                }
                else if (status == BatchStatus.Processing)
                {
                    batch.StartProcessing();
                }
                else if (status == BatchStatus.Error)
                {
                    batch.MarkAsError();
                }
                
                await _context.SaveChangesAsync();
            }
        }

        public async Task IncrementProcessedDocumentsAsync(Guid id)
        {
            var batch = await _context.Batches.FindAsync(id);
            if (batch != null)
            {
                batch.IncrementProcessedDocuments();
                await _context.SaveChangesAsync();
            }
        }
    }
}
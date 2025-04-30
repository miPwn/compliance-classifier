using Microsoft.EntityFrameworkCore;
using Xunit;
using ComplianceClassifier.Domain.Aggregates;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Infrastructure.Persistence;
using ComplianceClassifier.Infrastructure.Persistence.Repositories;

namespace ComplianceClassifier.UnitTests.Repositories;

public class BatchRepositoryTests
{
    private readonly DbContextOptions<ApplicationDbContext> _options = new DbContextOptionsBuilder<ApplicationDbContext>()
        .UseInMemoryDatabase(databaseName: $"BatchRepositoryTests_{Guid.NewGuid()}")
        .Options;
    private readonly IConnectionStringProvider _connectionStringProvider = new TestConnectionStringProvider();

    // Use in-memory database for testing
    // Mock connection string provider

    [Fact]
    public async Task AddAsync_ShouldAddBatchToDatabase()
    {
        // Arrange
        var batchId = Guid.NewGuid();
        var userId = "test-user";
        var batch = new Batch(batchId, userId);

        // Act
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var repository = new BatchRepository(context);
            await repository.AddAsync(batch);
        }

        // Assert
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var savedBatch = await context.Batches.FindAsync(batchId);
            Assert.NotNull(savedBatch);
            Assert.Equal(batchId, savedBatch.BatchId);
            Assert.Equal(userId, savedBatch.UserId);
            Assert.Equal(BatchStatus.Pending, savedBatch.Status);
            Assert.Equal(0, savedBatch.TotalDocuments);
            Assert.Equal(0, savedBatch.ProcessedDocuments);
        }
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnBatch_WhenBatchExists()
    {
        // Arrange
        var batchId = Guid.NewGuid();
        var userId = "test-user";
        var batch = new Batch(batchId, userId);

        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            await context.Batches.AddAsync(batch);
            await context.SaveChangesAsync();
        }

        // Act
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var repository = new BatchRepository(context);
            var result = await repository.GetByIdAsync(batchId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(batchId, result.BatchId);
            Assert.Equal(userId, result.UserId);
        }
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenBatchDoesNotExist()
    {
        // Arrange
        var nonExistentBatchId = Guid.NewGuid();

        // Act
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var repository = new BatchRepository(context);
            var result = await repository.GetByIdAsync(nonExistentBatchId);

            // Assert
            Assert.Null(result);
        }
    }

    [Fact]
    public async Task GetByUserIdAsync_ShouldReturnUserBatches()
    {
        // Arrange
        var userId = "test-user";
        var otherUserId = "other-user";
            
        var batch1 = new Batch(Guid.NewGuid(), userId);
        var batch2 = new Batch(Guid.NewGuid(), userId);
        var batch3 = new Batch(Guid.NewGuid(), otherUserId);

        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            await context.Batches.AddRangeAsync(batch1, batch2, batch3);
            await context.SaveChangesAsync();
        }

        // Act
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var repository = new BatchRepository(context);
            var result = await repository.GetByUserIdAsync(userId);

            // Assert
            var batches = result.ToList();
            Assert.Equal(2, batches.Count);
            Assert.All(batches, b => Assert.Equal(userId, b.UserId));
        }
    }

    [Fact]
    public async Task UpdateStatusAsync_ShouldUpdateBatchStatus()
    {
        // Arrange
        var batchId = Guid.NewGuid();
        var userId = "test-user";
        var batch = new Batch(batchId, userId);

        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            await context.Batches.AddAsync(batch);
            await context.SaveChangesAsync();
        }

        // Act
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var repository = new BatchRepository(context);
            await repository.UpdateStatusAsync(batchId, BatchStatus.Processing);
        }

        // Assert
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var updatedBatch = await context.Batches.FindAsync(batchId);
            Assert.Equal(BatchStatus.Processing, updatedBatch.Status);
        }
    }

    [Fact]
    public async Task IncrementProcessedDocumentsAsync_ShouldIncrementCounter()
    {
        // Arrange
        var batchId = Guid.NewGuid();
        var userId = "test-user";
        var batch = new Batch(batchId, userId);
        batch.AddDocuments(5); // Set total documents to 5

        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            await context.Batches.AddAsync(batch);
            await context.SaveChangesAsync();
        }

        // Act
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var repository = new BatchRepository(context);
            await repository.IncrementProcessedDocumentsAsync(batchId);
            await repository.IncrementProcessedDocumentsAsync(batchId);
        }

        // Assert
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var updatedBatch = await context.Batches.FindAsync(batchId);
            Assert.Equal(2, updatedBatch.ProcessedDocuments);
            Assert.Equal(BatchStatus.Pending, updatedBatch.Status); // Still pending as not all docs processed
        }
    }

    [Fact]
    public async Task IncrementProcessedDocumentsAsync_ShouldCompleteWhenAllProcessed()
    {
        // Arrange
        var batchId = Guid.NewGuid();
        var userId = "test-user";
        var batch = new Batch(batchId, userId);
        batch.AddDocuments(2); // Set total documents to 2

        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            await context.Batches.AddAsync(batch);
            await context.SaveChangesAsync();
        }

        // Act
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var repository = new BatchRepository(context);
            await repository.IncrementProcessedDocumentsAsync(batchId);
            await repository.IncrementProcessedDocumentsAsync(batchId);
        }

        // Assert
        await using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
        {
            var updatedBatch = await context.Batches.FindAsync(batchId);
            Assert.Equal(2, updatedBatch.ProcessedDocuments);
            Assert.Equal(BatchStatus.Completed, updatedBatch.Status); // Should be completed
            Assert.NotNull(updatedBatch.CompletionDate);
        }
    }
}
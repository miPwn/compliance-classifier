using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Infrastructure.Persistence;
using ComplianceClassifier.Infrastructure.Persistence.Repositories;

namespace ComplianceClassifier.UnitTests.Repositories
{
    public class DocumentRepositoryTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly IConnectionStringProvider _connectionStringProvider;

        public DocumentRepositoryTests()
        {
            // Use in-memory database for testing
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"DocumentRepositoryTests_{Guid.NewGuid()}")
                .Options;

            // Mock connection string provider
            _connectionStringProvider = new TestConnectionStringProvider();
        }

        [Fact]
        public async Task AddAsync_ShouldAddDocumentToDatabase()
        {
            // Arrange
            var documentId = Guid.NewGuid();
            var batchId = Guid.NewGuid();
            var document = new Document(
                documentId,
                "test-document.pdf",
                FileType.PDF,
                1024,
                batchId);

            // Act
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var repository = new DocumentRepository(context);
                await repository.AddAsync(document);
            }

            // Assert
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var savedDocument = await context.Documents.FindAsync(documentId);
                Assert.NotNull(savedDocument);
                Assert.Equal(documentId, savedDocument.DocumentId);
                Assert.Equal("test-document.pdf", savedDocument.FileName);
                Assert.Equal(FileType.PDF, savedDocument.FileType);
                Assert.Equal(1024, savedDocument.FileSize);
                Assert.Equal(batchId, savedDocument.BatchId);
                Assert.Equal(DocumentStatus.Pending, savedDocument.Status);
                Assert.Equal(string.Empty, savedDocument.Content);
            }
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnDocument_WhenDocumentExists()
        {
            // Arrange
            var documentId = Guid.NewGuid();
            var batchId = Guid.NewGuid();
            var document = new Document(
                documentId,
                "test-document.pdf",
                FileType.PDF,
                1024,
                batchId);

            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                await context.Documents.AddAsync(document);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var repository = new DocumentRepository(context);
                var result = await repository.GetByIdAsync(documentId);

                // Assert
                Assert.NotNull(result);
                Assert.Equal(documentId, result.DocumentId);
                Assert.Equal("test-document.pdf", result.FileName);
                Assert.Equal(batchId, result.BatchId);
            }
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenDocumentDoesNotExist()
        {
            // Arrange
            var nonExistentDocumentId = Guid.NewGuid();

            // Act
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var repository = new DocumentRepository(context);
                var result = await repository.GetByIdAsync(nonExistentDocumentId);

                // Assert
                Assert.Null(result);
            }
        }

        [Fact]
        public async Task GetByBatchIdAsync_ShouldReturnBatchDocuments()
        {
            // Arrange
            var batchId = Guid.NewGuid();
            var otherBatchId = Guid.NewGuid();
            
            var document1 = new Document(Guid.NewGuid(), "doc1.pdf", FileType.PDF, 1024, batchId);
            var document2 = new Document(Guid.NewGuid(), "doc2.pdf", FileType.PDF, 2048, batchId);
            var document3 = new Document(Guid.NewGuid(), "doc3.pdf", FileType.PDF, 3072, otherBatchId);

            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                await context.Documents.AddRangeAsync(document1, document2, document3);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var repository = new DocumentRepository(context);
                var result = await repository.GetByBatchIdAsync(batchId);

                // Assert
                var documents = result.ToList();
                Assert.Equal(2, documents.Count);
                Assert.All(documents, d => Assert.Equal(batchId, d.BatchId));
            }
        }

        [Fact]
        public async Task UpdateStatusAsync_ShouldUpdateDocumentStatus()
        {
            // Arrange
            var documentId = Guid.NewGuid();
            var batchId = Guid.NewGuid();
            var document = new Document(
                documentId,
                "test-document.pdf",
                FileType.PDF,
                1024,
                batchId);

            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                await context.Documents.AddAsync(document);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var repository = new DocumentRepository(context);
                await repository.UpdateStatusAsync(documentId, DocumentStatus.Processing);
            }

            // Assert
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var updatedDocument = await context.Documents.FindAsync(documentId);
                Assert.Equal(DocumentStatus.Processing, updatedDocument.Status);
            }
        }

        [Fact]
        public async Task UpdateContentAsync_ShouldUpdateDocumentContent()
        {
            // Arrange
            var documentId = Guid.NewGuid();
            var batchId = Guid.NewGuid();
            var document = new Document(
                documentId,
                "test-document.pdf",
                FileType.PDF,
                1024,
                batchId);

            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                await context.Documents.AddAsync(document);
                await context.SaveChangesAsync();
            }

            // Act
            var newContent = "This is the extracted content from the document.";
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var repository = new DocumentRepository(context);
                await repository.UpdateContentAsync(documentId, newContent);
            }

            // Assert
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var updatedDocument = await context.Documents.FindAsync(documentId);
                Assert.Equal(newContent, updatedDocument.Content);
            }
        }

        [Fact]
        public async Task GetWithContentAsync_ShouldReturnDocumentWithContent()
        {
            // Arrange
            var documentId = Guid.NewGuid();
            var batchId = Guid.NewGuid();
            var document = new Document(
                documentId,
                "test-document.pdf",
                FileType.PDF,
                1024,
                batchId);
            
            var content = "This is the document content.";
            document.UpdateContent(content);

            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                await context.Documents.AddAsync(document);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options, _connectionStringProvider))
            {
                var repository = new DocumentRepository(context);
                var result = await repository.GetWithContentAsync(documentId);

                // Assert
                Assert.NotNull(result);
                Assert.Equal(documentId, result.DocumentId);
                Assert.Equal(content, result.Content);
            }
        }
    }

    // Test implementation of IConnectionStringProvider
    public class TestConnectionStringProvider : IConnectionStringProvider
    {
        public string GetConnectionString()
        {
            return "Data Source=:memory:";
        }
    }
}
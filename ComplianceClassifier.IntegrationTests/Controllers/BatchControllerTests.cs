using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using ComplianceClassifier.Application.Documents.DTOs;

namespace ComplianceClassifier.IntegrationTests.Controllers
{
    public class BatchControllerTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory<Program> _factory;
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public BatchControllerTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false
            });
        }

        [Fact]
        public async Task CreateBatch_ShouldReturnCreated_WithBatchDetails()
        {
            // Arrange
            var createBatchDto = new CreateBatchDto
            {
                UserId = "test-user-123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/batch", createBatchDto);
            
            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            
            var batch = await response.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
            Assert.NotNull(batch);
            Assert.NotEqual(Guid.Empty, batch.BatchId);
            Assert.Equal(createBatchDto.UserId, batch.UserId);
            Assert.Equal("Pending", batch.Status);
            Assert.Equal(0, batch.TotalDocuments);
            Assert.Equal(0, batch.ProcessedDocuments);
        }

        [Fact]
        public async Task GetBatch_ShouldReturnBatch_WhenBatchExists()
        {
            // Arrange
            var createBatchDto = new CreateBatchDto
            {
                UserId = "test-user-123"
            };
            
            var createResponse = await _client.PostAsJsonAsync("/api/batch", createBatchDto);
            var createdBatch = await createResponse.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
            
            // Act
            var response = await _client.GetAsync($"/api/batch/{createdBatch.BatchId}");
            
            // Assert
            response.EnsureSuccessStatusCode();
            var batch = await response.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
            Assert.NotNull(batch);
            Assert.Equal(createdBatch.BatchId, batch.BatchId);
            Assert.Equal(createBatchDto.UserId, batch.UserId);
        }

        [Fact]
        public async Task GetBatch_ShouldReturnNotFound_WhenBatchDoesNotExist()
        {
            // Arrange
            var nonExistentBatchId = Guid.NewGuid();
            
            // Act
            var response = await _client.GetAsync($"/api/batch/{nonExistentBatchId}");
            
            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetBatchesByUser_ShouldReturnUserBatches()
        {
            // Arrange
            var userId = $"test-user-{Guid.NewGuid()}";
            
            // Create two batches for the user
            var createBatchDto = new CreateBatchDto { UserId = userId };
            await _client.PostAsJsonAsync("/api/batch", createBatchDto);
            await _client.PostAsJsonAsync("/api/batch", createBatchDto);
            
            // Act
            var response = await _client.GetAsync($"/api/batch/user/{userId}");
            
            // Assert
            response.EnsureSuccessStatusCode();
            var batches = await response.Content.ReadFromJsonAsync<List<BatchDto>>(_jsonOptions);
            Assert.NotNull(batches);
            Assert.Equal(2, batches.Count);
            Assert.All(batches, b => Assert.Equal(userId, b.UserId));
        }

        [Fact]
        public async Task UpdateBatchStatus_ShouldUpdateStatus()
        {
            // Arrange
            var createBatchDto = new CreateBatchDto { UserId = "test-user-123" };
            var createResponse = await _client.PostAsJsonAsync("/api/batch", createBatchDto);
            var createdBatch = await createResponse.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
            
            // Act
            var response = await _client.PutAsync(
                $"/api/batch/{createdBatch.BatchId}/status/Processing", 
                null);
            
            // Assert
            response.EnsureSuccessStatusCode();
            var updatedBatch = await response.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
            Assert.NotNull(updatedBatch);
            Assert.Equal(createdBatch.BatchId, updatedBatch.BatchId);
            Assert.Equal("Processing", updatedBatch.Status);
        }

        [Fact]
        public async Task AddDocumentsToBatch_ShouldUpdateBatchDocumentCount()
        {
            // Arrange
            var createBatchDto = new CreateBatchDto { UserId = "test-user-123" };
            var createResponse = await _client.PostAsJsonAsync("/api/batch", createBatchDto);
            var createdBatch = await createResponse.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
            
            // Act
            var documentCount = 5;
            var response = await _client.PostAsJsonAsync(
                $"/api/batch/{createdBatch.BatchId}/documents", 
                documentCount);
            
            // Assert
            response.EnsureSuccessStatusCode();
            var updatedBatch = await response.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
            Assert.NotNull(updatedBatch);
            Assert.Equal(createdBatch.BatchId, updatedBatch.BatchId);
            Assert.Equal(documentCount, updatedBatch.TotalDocuments);
        }
    }
}
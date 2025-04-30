using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using ComplianceClassifier.Application.Documents.DTOs;

namespace ComplianceClassifier.IntegrationTests.Controllers;

public class DocumentControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;
    private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    public DocumentControllerTests(CustomWebApplicationFactory factory)
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
        var response = await _client.PostAsJsonAsync("/api/document/batch", createBatchDto);
            
        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            
        var batch = await response.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);
        Assert.NotNull(batch);
        Assert.NotEqual(Guid.Empty, batch.BatchId);
        Assert.Equal(createBatchDto.UserId, batch.UserId);
        Assert.Equal("Pending", batch.Status);
    }

    [Fact]
    public async Task UploadDocuments_ShouldReturnDocumentIds()
    {
        // Arrange
        // First create a batch
        var createBatchDto = new CreateBatchDto { UserId = "test-user-123" };
        var batchResponse = await _client.PostAsJsonAsync("/api/document/batch", createBatchDto);
        var batch = await batchResponse.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);

        // Create a test file
        var fileContent = "This is a test file content";
        var fileName = "test-document.txt";
            
        // Act
        // Create multipart form data content
        using var content = new MultipartFormDataContent();
        var fileContent1 = new ByteArrayContent(Encoding.UTF8.GetBytes(fileContent));
        fileContent1.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
        content.Add(fileContent1, "files", fileName);

        var uploadResponse = await _client.PostAsync($"/api/document/batch/{batch.BatchId}/upload", content);
            
        // Assert
        uploadResponse.EnsureSuccessStatusCode();
        var documentIds = await uploadResponse.Content.ReadFromJsonAsync<List<Guid>>(_jsonOptions);
        Assert.NotNull(documentIds);
        Assert.Single(documentIds);
        Assert.NotEqual(Guid.Empty, documentIds[0]);
    }

    [Fact]
    public async Task GetDocument_ShouldReturnDocument_WhenDocumentExists()
    {
        // Arrange
        // First create a batch
        var createBatchDto = new CreateBatchDto { UserId = "test-user-123" };
        var batchResponse = await _client.PostAsJsonAsync("/api/document/batch", createBatchDto);
        var batch = await batchResponse.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);

        // Upload a document
        var fileContent = "This is a test file content";
        var fileName = "test-document.txt";
            
        using var content = new MultipartFormDataContent();
        var fileContent1 = new ByteArrayContent(Encoding.UTF8.GetBytes(fileContent));
        fileContent1.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
        content.Add(fileContent1, "files", fileName);

        var uploadResponse = await _client.PostAsync($"/api/document/batch/{batch.BatchId}/upload", content);
        var documentIds = await uploadResponse.Content.ReadFromJsonAsync<List<Guid>>(_jsonOptions);
            
        // Act
        var response = await _client.GetAsync($"/api/document/{documentIds[0]}");
            
        // Assert
        response.EnsureSuccessStatusCode();
        var document = await response.Content.ReadFromJsonAsync<DocumentDto>(_jsonOptions);
        Assert.NotNull(document);
        Assert.Equal(documentIds[0], document.DocumentId);
        Assert.Equal(fileName, document.FileName);
        Assert.Equal(batch.BatchId, document.BatchId);
    }

    [Fact]
    public async Task GetDocument_ShouldReturnNotFound_WhenDocumentDoesNotExist()
    {
        // Arrange
        var nonExistentDocumentId = Guid.NewGuid();
            
        // Act
        var response = await _client.GetAsync($"/api/document/{nonExistentDocumentId}");
            
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetBatchDocuments_ShouldReturnDocumentsInBatch()
    {
        // Arrange
        // First create a batch
        var createBatchDto = new CreateBatchDto { UserId = "test-user-123" };
        var batchResponse = await _client.PostAsJsonAsync("/api/document/batch", createBatchDto);
        var batch = await batchResponse.Content.ReadFromJsonAsync<BatchDto>(_jsonOptions);

        // Upload two documents
        var fileContent = "This is a test file content";
            
        using var content1 = new MultipartFormDataContent();
        var fileContent1 = new ByteArrayContent(Encoding.UTF8.GetBytes(fileContent));
        fileContent1.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
        content1.Add(fileContent1, "files", "document1.txt");
        await _client.PostAsync($"/api/document/batch/{batch.BatchId}/upload", content1);
            
        using var content2 = new MultipartFormDataContent();
        var fileContent2 = new ByteArrayContent(Encoding.UTF8.GetBytes(fileContent));
        fileContent2.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
        content2.Add(fileContent2, "files", "document2.txt");
        await _client.PostAsync($"/api/document/batch/{batch.BatchId}/upload", content2);
            
        // Act
        var response = await _client.GetAsync($"/api/document/batch/{batch.BatchId}");
            
        // Assert
        response.EnsureSuccessStatusCode();
        var documents = await response.Content.ReadFromJsonAsync<List<DocumentDto>>(_jsonOptions);
        Assert.NotNull(documents);
        Assert.Equal(2, documents.Count);
        Assert.All(documents, d => Assert.Equal(batch.BatchId, d.BatchId));
    }
}
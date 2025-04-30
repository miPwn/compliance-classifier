using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace ComplianceClassifier.E2ETests;

public static class Program
{
    private static readonly HttpClient _httpClient = new();
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };
    private static readonly IConfiguration _configuration =
        new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .Build();

    public static async Task Main(string[] args)
    {
        _httpClient.BaseAddress = new Uri(_configuration["ApiBaseUrl"]);

        try
        {
            Console.WriteLine("Starting E2E test for batch creation and document upload...");

            // Step 1: Create a new batch
            var batchId = await CreateBatchAsync();
            Console.WriteLine($"Created batch with ID: {batchId}");

            // Step 2: Upload documents to the batch
            var documentIds = await UploadDocumentsAsync(batchId);
            Console.WriteLine($"Uploaded {documentIds.Count} documents to the batch");

            // Step 3: Retrieve the batch and verify its status
            await VerifyBatchStatusAsync(batchId, documentIds.Count);

            Console.WriteLine("E2E test completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during E2E test: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }

    private static async Task<Guid> CreateBatchAsync()
    {
        Console.WriteLine("Creating a new batch...");

        var createBatchDto = new
        {
            UserId = _configuration["TestUser:UserId"]
        };

        var response = await _httpClient.PostAsJsonAsync("/api/batch", createBatchDto);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var batch = JsonSerializer.Deserialize<BatchDto>(content, _jsonOptions);

        return batch.BatchId;
    }

    private static async Task<List<Guid>> UploadDocumentsAsync(Guid batchId)
    {
        Console.WriteLine($"Uploading documents to batch {batchId}...");

        var testFilesPath = _configuration["TestFiles:BasePath"];
        var files = Directory.GetFiles(testFilesPath, "*.txt");

        if (files.Length == 0)
        {
            throw new Exception($"No test files found in {testFilesPath}");
        }

        // Upload each file
        var documentIds = new List<Guid>();
        foreach (var filePath in files)
        {
            var fileName = Path.GetFileName(filePath);
            var fileContent = await File.ReadAllTextAsync(filePath);

            using var content = new MultipartFormDataContent();
            var fileContentBytes = new ByteArrayContent(Encoding.UTF8.GetBytes(fileContent));
            fileContentBytes.Headers.ContentType = MediaTypeHeaderValue.Parse("text/plain");
            content.Add(fileContentBytes, "files", fileName);

            var response = await _httpClient.PostAsync($"/api/document/batch/{batchId}/upload", content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var uploadedDocumentIds = JsonSerializer.Deserialize<List<Guid>>(responseContent, _jsonOptions);
            documentIds.AddRange(uploadedDocumentIds);

            Console.WriteLine($"Uploaded file: {fileName}");
        }

        return documentIds;
    }

    private static async Task VerifyBatchStatusAsync(Guid batchId, int expectedDocumentCount)
    {
        Console.WriteLine($"Verifying batch {batchId} status...");

        var response = await _httpClient.GetAsync($"/api/batch/{batchId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var batch = JsonSerializer.Deserialize<BatchDto>(content, _jsonOptions);

        Console.WriteLine($"Batch status: {batch.Status}");
        Console.WriteLine($"Total documents: {batch.TotalDocuments}");
        Console.WriteLine($"Processed documents: {batch.ProcessedDocuments}");
        Console.WriteLine($"Completion percentage: {batch.CompletionPercentage}%");

        // Verify the batch has the expected number of documents
        if (batch.TotalDocuments != expectedDocumentCount)
        {
            throw new Exception($"Expected {expectedDocumentCount} documents, but found {batch.TotalDocuments}");
        }

        // Get all documents in the batch
        var documentsResponse = await _httpClient.GetAsync($"/api/document/batch/{batchId}");
        documentsResponse.EnsureSuccessStatusCode();

        var documentsContent = await documentsResponse.Content.ReadAsStringAsync();
        var documents = JsonSerializer.Deserialize<List<DocumentDto>>(documentsContent, _jsonOptions);

        Console.WriteLine($"Retrieved {documents.Count} documents from the batch");

        // Verify each document
        foreach (var document in documents)
        {
            Console.WriteLine($"Document: {document.FileName}, Status: {document.Status}");
        }
    }

    // DTOs for deserialization
    private class BatchDto
    {
        public Guid BatchId { get; set; }
        public DateTime UploadDate { get; set; }
        public string UserId { get; set; }
        public string Status { get; set; }
        public int TotalDocuments { get; set; }
        public int ProcessedDocuments { get; set; }
        public DateTime? CompletionDate { get; set; }
        public double CompletionPercentage { get; set; }
    }

    private class DocumentDto
    {
        public Guid DocumentId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
        public string Status { get; set; }
        public Guid BatchId { get; set; }
    }
}
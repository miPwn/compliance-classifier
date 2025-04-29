using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Application.Documents.Services
{
    /// <summary>
    /// Service for parsing documents in the application layer
    /// </summary>
    public class DocumentParsingService : IDocumentParsingService
    {
        private readonly IDocumentParserService _documentParserService;
        private readonly ILogger<DocumentParsingService> _logger;

        public DocumentParsingService(
            IDocumentParserService documentParserService,
            ILogger<DocumentParsingService> logger)
        {
            _documentParserService = documentParserService;
            _logger = logger;
        }

        /// <summary>
        /// Parses a document and extracts its content and metadata
        /// </summary>
        /// <param name="request">Document parsing request</param>
        /// <returns>Document parsing response</returns>
        public async Task<DocumentParsingResponseDto> ParseDocumentAsync(DocumentParsingRequestDto request)
        {
            _logger.LogInformation("Parsing document with ID: {DocumentId}, Path: {FilePath}, Type: {FileType}",
                request.DocumentId, request.FilePath, request.FileType);
            
            var response = new DocumentParsingResponseDto
            {
                DocumentId = request.DocumentId,
                Success = false
            };
            
            try
            {
                // Extract text content
                string content = await _documentParserService.ParseDocumentAsync(request.FilePath, request.FileType);
                response.Content = content;
                
                // Extract metadata
                var metadata = await _documentParserService.ExtractMetadataAsync(request.FilePath, request.FileType);
                
                // Map domain metadata to DTO
                response.Metadata = new DocumentMetadataDto
                {
                    PageCount = metadata.PageCount,
                    Author = metadata.Author,
                    CreationDate = metadata.CreationDate,
                    ModificationDate = metadata.ModificationDate,
                    Keywords = metadata.Keywords?.ToArray() ?? Array.Empty<string>()
                };
                
                response.Success = true;
                
                _logger.LogInformation("Successfully parsed document with ID: {DocumentId}", request.DocumentId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing document with ID: {DocumentId}", request.DocumentId);
                response.ErrorMessage = $"Error parsing document: {ex.Message}";
            }
            
            return response;
        }
    }
}
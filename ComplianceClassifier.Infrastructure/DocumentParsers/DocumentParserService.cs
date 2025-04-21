using System;
using System.IO;
using System.Threading.Tasks;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Domain.ValueObjects;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.DocumentParsers
{
    /// <summary>
    /// Service for parsing documents
    /// </summary>
    public class DocumentParserService : IDocumentParserService
    {
        private readonly IDocumentParserFactory _parserFactory;
        private readonly ILogger<DocumentParserService> _logger;

        public DocumentParserService(
            IDocumentParserFactory parserFactory,
            ILogger<DocumentParserService> logger)
        {
            _parserFactory = parserFactory;
            _logger = logger;
        }

        /// <summary>
        /// Parses a document file and extracts text content
        /// </summary>
        /// <param name="filePath">Path to document file</param>
        /// <param name="fileType">Type of file</param>
        /// <returns>Extracted text content</returns>
        public async Task<string> ParseDocumentAsync(string filePath, FileType fileType)
        {
            _logger.LogInformation("Parsing document: {FilePath}, Type: {FileType}", filePath, fileType);
            
            try
            {
                if (!File.Exists(filePath))
                {
                    _logger.LogError("File not found: {FilePath}", filePath);
                    throw new FileNotFoundException($"File not found: {filePath}");
                }

                var parser = _parserFactory.CreateParser(fileType);
                return await parser.ExtractTextAsync(filePath, fileType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing document: {FilePath}, Type: {FileType}", filePath, fileType);
                throw;
            }
        }

        /// <summary>
        /// Extracts metadata from a document file
        /// </summary>
        /// <param name="filePath">Path to document file</param>
        /// <param name="fileType">Type of file</param>
        /// <returns>Document metadata</returns>
        public async Task<DocumentMetadata> ExtractMetadataAsync(string filePath, FileType fileType)
        {
            _logger.LogInformation("Extracting metadata from document: {FilePath}, Type: {FileType}", filePath, fileType);
            
            try
            {
                if (!File.Exists(filePath))
                {
                    _logger.LogError("File not found: {FilePath}", filePath);
                    throw new FileNotFoundException($"File not found: {filePath}");
                }

                var parser = _parserFactory.CreateParser(fileType);
                return await parser.ExtractMetadataAsync(filePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting metadata: {FilePath}, Type: {FileType}", filePath, fileType);
                throw;
            }
        }
    }
}
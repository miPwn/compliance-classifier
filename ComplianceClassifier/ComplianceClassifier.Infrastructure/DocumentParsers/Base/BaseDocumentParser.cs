using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Domain.ValueObjects;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.DocumentParsers.Base
{
    /// <summary>
    /// Base abstract class for document parsers
    /// </summary>
    public abstract class BaseDocumentParser : IDocumentParser
    {
        protected readonly ILogger<BaseDocumentParser> _logger;

        protected BaseDocumentParser(ILogger<BaseDocumentParser> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Extracts text from a document file
        /// </summary>
        /// <param name="filePath">Path to document file</param>
        /// <param name="fileType">Type of file</param>
        /// <returns>Extracted text</returns>
        public async Task<string> ExtractTextAsync(string filePath, FileType fileType)
        {
            try
            {
                if (!File.Exists(filePath))
                {
                    _logger.LogError("File not found: {FilePath}", filePath);
                    throw new FileNotFoundException($"File not found: {filePath}");
                }

                _logger.LogInformation("Extracting text from {FileType} file: {FilePath}", fileType, filePath);
                
                return await ExtractTextInternalAsync(filePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting text from {FileType} file: {FilePath}", fileType, filePath);
                throw;
            }
        }

        /// <summary>
        /// Internal method to extract text from a document file
        /// </summary>
        /// <param name="filePath">Path to document file</param>
        /// <returns>Extracted text</returns>
        protected abstract Task<string> ExtractTextInternalAsync(string filePath);

        /// <summary>
        /// Extracts metadata from a document file
        /// </summary>
        /// <param name="filePath">Path to document file</param>
        /// <returns>Document metadata</returns>
        public abstract Task<DocumentMetadata> ExtractMetadataAsync(string filePath);
    }
}
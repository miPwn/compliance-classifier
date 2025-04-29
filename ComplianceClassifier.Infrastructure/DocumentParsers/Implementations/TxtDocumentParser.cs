using ComplianceClassifier.Domain.ValueObjects;
using ComplianceClassifier.Infrastructure.DocumentParsers.Base;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.DocumentParsers.Implementations
{
    /// <summary>
    /// Parser for TXT documents
    /// </summary>
    public class TxtDocumentParser : BaseDocumentParser
    {
        public TxtDocumentParser(ILogger<TxtDocumentParser> logger) 
            : base(logger)
        {
        }

        /// <summary>
        /// Extracts text from a TXT file
        /// </summary>
        /// <param name="filePath">Path to TXT file</param>
        /// <returns>Extracted text</returns>
        protected override async Task<string> ExtractTextInternalAsync(string filePath)
        {
            _logger.LogInformation("Extracting text from TXT file: {FilePath}", filePath);
            
            try
            {
                return await File.ReadAllTextAsync(filePath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading TXT file: {FilePath}", filePath);
                throw;
            }
        }

        /// <summary>
        /// Extracts metadata from a TXT file
        /// </summary>
        /// <param name="filePath">Path to TXT file</param>
        /// <returns>Document metadata</returns>
        public override async Task<DocumentMetadata> ExtractMetadataAsync(string filePath)
        {
            _logger.LogInformation("Extracting metadata from TXT file: {FilePath}", filePath);
            
            try
            {
                var fileInfo = new FileInfo(filePath);
                
                // For TXT files, we have limited metadata
                var content = await File.ReadAllTextAsync(filePath);
                var lineCount = content.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None).Length;
                
                return new DocumentMetadata(
                    pageCount: lineCount > 0 ? (int)Math.Ceiling(lineCount / 50.0) : 1, // Estimate page count based on lines
                    author: "Unknown", // TXT files don't typically have author metadata
                    creationDate: fileInfo.CreationTimeUtc,
                    modificationDate: fileInfo.LastWriteTimeUtc,
                    keywords: new List<string>()
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting metadata from TXT file: {FilePath}", filePath);
                throw;
            }
        }
    }
}
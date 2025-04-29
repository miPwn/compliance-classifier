using System.Text;
using ComplianceClassifier.Domain.ValueObjects;
using ComplianceClassifier.Infrastructure.DocumentParsers.Base;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.DocumentParsers.Implementations
{
    /// <summary>
    /// Parser for DOCX documents
    /// </summary>
    public class DocxDocumentParser : BaseDocumentParser
    {
        public DocxDocumentParser(ILogger<DocxDocumentParser> logger) 
            : base(logger)
        {
        }

        /// <summary>
        /// Extracts text from a DOCX file
        /// </summary>
        /// <param name="filePath">Path to DOCX file</param>
        /// <returns>Extracted text</returns>
        protected override async Task<string> ExtractTextInternalAsync(string filePath)
        {
            _logger.LogInformation("Extracting text from DOCX file: {FilePath}", filePath);
            
            return await Task.Run(() =>
            {
                try
                {
                    var stringBuilder = new StringBuilder();
                    
                    using (var document = WordprocessingDocument.Open(filePath, false))
                    {
                        var body = document.MainDocumentPart?.Document.Body;
                        
                        if (body != null)
                        {
                            // Extract text from paragraphs
                            foreach (var paragraph in body.Descendants<Paragraph>())
                            {
                                stringBuilder.AppendLine(paragraph.InnerText);
                            }
                        }
                    }
                    
                    return stringBuilder.ToString();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error extracting text from DOCX file: {FilePath}", filePath);
                    throw;
                }
            });
        }

        /// <summary>
        /// Extracts metadata from a DOCX file
        /// </summary>
        /// <param name="filePath">Path to DOCX file</param>
        /// <returns>Document metadata</returns>
        public override async Task<DocumentMetadata> ExtractMetadataAsync(string filePath)
        {
            _logger.LogInformation("Extracting metadata from DOCX file: {FilePath}", filePath);
            
            return await Task.Run(() =>
            {
                try
                {
                    using (var document = WordprocessingDocument.Open(filePath, false))
                    {
                        var coreProps = document.PackageProperties;
                        var keywords = new List<string>();
                        
                        if (coreProps?.Keywords != null)
                        {
                            keywords = coreProps.Keywords.Split(',', ';')
                                .Select(k => k.Trim())
                                .Where(k => !string.IsNullOrWhiteSpace(k))
                                .ToList();
                        }
                        
                        // Get page count (approximate based on paragraphs)
                        var body = document.MainDocumentPart?.Document.Body;
                        int paragraphCount = body?.Descendants<Paragraph>().Count() ?? 0;
                        int estimatedPageCount = Math.Max(1, (int)Math.Ceiling(paragraphCount / 40.0)); // Rough estimate
                        
                        // Parse creation and modification dates
                        DateTime creationDate = coreProps?.Created != null 
                            ? coreProps.Created.Value 
                            : DateTime.UtcNow;
                        
                        DateTime modificationDate = coreProps?.Modified != null 
                            ? coreProps.Modified.Value 
                            : DateTime.UtcNow;
                        
                        return new DocumentMetadata(
                            pageCount: estimatedPageCount,
                            author: coreProps?.Creator ?? "Unknown",
                            creationDate: creationDate,
                            modificationDate: modificationDate,
                            keywords: keywords
                        );
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error extracting metadata from DOCX file: {FilePath}", filePath);
                    throw;
                }
            });
        }
    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ComplianceClassifier.Domain.ValueObjects;
using ComplianceClassifier.Infrastructure.DocumentParsers.Base;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;

namespace ComplianceClassifier.Infrastructure.DocumentParsers.Implementations
{
    /// <summary>
    /// Parser for PDF documents
    /// </summary>
    public class PdfDocumentParser : BaseDocumentParser
    {
        public PdfDocumentParser(ILogger<PdfDocumentParser> logger) 
            : base(logger)
        {
        }

        /// <summary>
        /// Extracts text from a PDF file
        /// </summary>
        /// <param name="filePath">Path to PDF file</param>
        /// <returns>Extracted text</returns>
        protected override async Task<string> ExtractTextInternalAsync(string filePath)
        {
            _logger.LogInformation("Extracting text from PDF file: {FilePath}", filePath);
            
            return await Task.Run(() =>
            {
                try
                {
                    var stringBuilder = new StringBuilder();
                    
                    using (var document = PdfDocument.Open(filePath))
                    {
                        foreach (var page in document.GetPages())
                        {
                            var text = ContentOrderTextExtractor.GetText(page);
                            stringBuilder.AppendLine(text);
                        }
                    }
                    
                    return stringBuilder.ToString();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error extracting text from PDF file: {FilePath}", filePath);
                    throw;
                }
            });
        }

        /// <summary>
        /// Extracts metadata from a PDF file
        /// </summary>
        /// <param name="filePath">Path to PDF file</param>
        /// <returns>Document metadata</returns>
        public override async Task<DocumentMetadata> ExtractMetadataAsync(string filePath)
        {
            _logger.LogInformation("Extracting metadata from PDF file: {FilePath}", filePath);
            
            return await Task.Run(() =>
            {
                try
                {
                    using (var document = PdfDocument.Open(filePath))
                    {
                        var information = document.Information;
                        var keywords = new List<string>();
                        
                        if (!string.IsNullOrWhiteSpace(information.Keywords))
                        {
                            keywords = information.Keywords.Split(',', ';')
                                .Select(k => k.Trim())
                                .Where(k => !string.IsNullOrWhiteSpace(k))
                                .ToList();
                        }
                        
                        // Parse creation and modification dates
                        DateTime creationDate = DateTime.UtcNow;
                        DateTime modificationDate = DateTime.UtcNow;
                        
                        if (!string.IsNullOrWhiteSpace(information.CreationDate))
                        {
                            if (DateTime.TryParse(information.CreationDate, out var parsedCreationDate))
                            {
                                creationDate = parsedCreationDate;
                            }
                        }
                        
                        if (!string.IsNullOrWhiteSpace(information.ModifiedDate))
                        {
                            if (DateTime.TryParse(information.ModifiedDate, out var parsedModificationDate))
                            {
                                modificationDate = parsedModificationDate;
                            }
                        }
                        
                        return new DocumentMetadata(
                            pageCount: document.NumberOfPages,
                            author: information.Author ?? "Unknown",
                            creationDate: creationDate,
                            modificationDate: modificationDate,
                            keywords: keywords
                        );
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error extracting metadata from PDF file: {FilePath}", filePath);
                    throw;
                }
            });
        }
    }
}
using System;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Infrastructure.DocumentParsers.Implementations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.DocumentParsers.Factory
{
    /// <summary>
    /// Factory for creating document parsers based on file type
    /// </summary>
    public class DocumentParserFactory : IDocumentParserFactory
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DocumentParserFactory> _logger;

        public DocumentParserFactory(
            IServiceProvider serviceProvider,
            ILogger<DocumentParserFactory> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        /// <summary>
        /// Creates a document parser based on file type
        /// </summary>
        /// <param name="fileType">Type of file</param>
        /// <returns>Document parser</returns>
        public IDocumentParser CreateParser(FileType fileType)
        {
            _logger.LogInformation("Creating parser for file type: {FileType}", fileType);
            
            return fileType switch
            {
                FileType.PDF => _serviceProvider.GetRequiredService<PdfDocumentParser>(),
                FileType.DOCX => _serviceProvider.GetRequiredService<DocxDocumentParser>(),
                FileType.TXT => _serviceProvider.GetRequiredService<TxtDocumentParser>(),
                _ => throw new ArgumentException($"Unsupported file type: {fileType}")
            };
        }
    }
}
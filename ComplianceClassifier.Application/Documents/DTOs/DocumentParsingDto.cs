using System;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Application.Documents.DTOs
{
    /// <summary>
    /// Data transfer object for document parsing request
    /// </summary>
    public class DocumentParsingRequestDto
    {
        /// <summary>
        /// Path to the document file
        /// </summary>
        public string FilePath { get; set; }
        
        /// <summary>
        /// Type of the document file
        /// </summary>
        public FileType FileType { get; set; }
        
        /// <summary>
        /// ID of the document
        /// </summary>
        public Guid DocumentId { get; set; }
    }

    /// <summary>
    /// Data transfer object for document parsing response
    /// </summary>
    public class DocumentParsingResponseDto
    {
        /// <summary>
        /// ID of the document
        /// </summary>
        public Guid DocumentId { get; set; }
        
        /// <summary>
        /// Extracted text content from the document
        /// </summary>
        public string Content { get; set; }
        
        /// <summary>
        /// Metadata of the document
        /// </summary>
        public DocumentMetadataDto Metadata { get; set; }
        
        /// <summary>
        /// Indicates whether the parsing was successful
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// Error message if parsing failed
        /// </summary>
        public string ErrorMessage { get; set; }
    }
}
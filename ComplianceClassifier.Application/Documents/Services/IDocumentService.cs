using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Application.Documents.Services
{
    /// <summary>
    /// Interface for document service in the application layer
    /// </summary>
    public interface IDocumentService
    {
        /// <summary>
        /// Gets a document by ID
        /// </summary>
        /// <param name="documentId">Document ID</param>
        /// <returns>Document details</returns>
        Task<DocumentDto> GetDocumentByIdAsync(Guid documentId);

        /// <summary>
        /// Gets all documents
        /// </summary>
        /// <returns>List of documents</returns>
        Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync();

        /// <summary>
        /// Gets documents by batch ID
        /// </summary>
        /// <param name="batchId">Batch ID</param>
        /// <returns>List of documents</returns>
        Task<IEnumerable<DocumentDto>> GetDocumentsByBatchIdAsync(Guid batchId);

        /// <summary>
        /// Uploads documents to a batch
        /// </summary>
        /// <param name="batchId">Batch ID</param>
        /// <param name="files">Files to upload as (filename, stream) tuples</param>
        /// <returns>List of created document IDs</returns>
        Task<IEnumerable<Guid>> UploadDocumentsAsync(Guid batchId, IEnumerable<(string FileName, Stream Content, string ContentType, long Length)> files);

        /// <summary>
        /// Updates document status
        /// </summary>
        /// <param name="documentId">Document ID</param>
        /// <param name="status">New status</param>
        /// <returns>Updated document</returns>
        Task<DocumentDto> UpdateDocumentStatusAsync(Guid documentId, DocumentStatus status);

        /// <summary>
        /// Gets document with content
        /// </summary>
        /// <param name="documentId">Document ID</param>
        /// <returns>Document with content</returns>
        Task<DocumentDto> GetDocumentWithContentAsync(Guid documentId);
    }
}
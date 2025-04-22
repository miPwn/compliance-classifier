using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Domain.Aggregates.Document;
using ComplianceClassifier.Domain.Enums;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Domain.ValueObjects;

namespace ComplianceClassifier.Application.Documents.Services
{
    /// <summary>
    /// Implementation of document service
    /// </summary>
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly IBatchRepository _batchRepository;
        private readonly IDocumentParsingService _documentParsingService;

        public DocumentService(
            IDocumentRepository documentRepository,
            IBatchRepository batchRepository,
            IDocumentParsingService documentParsingService)
        {
            _documentRepository = documentRepository ?? throw new ArgumentNullException(nameof(documentRepository));
            _batchRepository = batchRepository ?? throw new ArgumentNullException(nameof(batchRepository));
            _documentParsingService = documentParsingService ?? throw new ArgumentNullException(nameof(documentParsingService));
        }

        public async Task<DocumentDto> GetDocumentByIdAsync(Guid documentId)
        {
            var document = await _documentRepository.GetByIdAsync(documentId);
            if (document == null)
            {
                throw new KeyNotFoundException($"Document with ID {documentId} not found");
            }
            
            return MapToDto(document);
        }

        public async Task<IEnumerable<DocumentDto>> GetAllDocumentsAsync()
        {
            var documents = await _documentRepository.GetAllAsync();
            return documents.Select(MapToDto);
        }

        public async Task<IEnumerable<DocumentDto>> GetDocumentsByBatchIdAsync(Guid batchId)
        {
            var documents = await _documentRepository.GetByBatchIdAsync(batchId);
            return documents.Select(MapToDto);
        }

        public async Task<IEnumerable<Guid>> UploadDocumentsAsync(Guid batchId, IEnumerable<(string FileName, Stream Content, string ContentType, long Length)> files)
        {
            var batch = await _batchRepository.GetByIdAsync(batchId);
            if (batch == null)
            {
                throw new KeyNotFoundException($"Batch with ID {batchId} not found");
            }

            var documentIds = new List<Guid>();
            var filesList = files.ToList();
            
            // Add documents to batch
            batch.AddDocuments(filesList.Count);
            await _batchRepository.UpdateAsync(batch);
            
            // Process each file
            foreach (var file in filesList)
            {
                var documentId = Guid.NewGuid();
                var fileType = GetFileType(file.ContentType, file.FileName);
                
                var document = new Document(
                    documentId,
                    file.FileName,
                    fileType,
                    file.Length,
                    batchId);
                
                await _documentRepository.AddAsync(document);
                documentIds.Add(documentId);
                
                // Parse document content (this would typically be done asynchronously in a real system)
                try
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await file.Content.CopyToAsync(memoryStream);
                        memoryStream.Position = 0;
                        
                        // Save the file to a temporary location
                        var tempFilePath = Path.GetTempFileName();
                        using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
                        {
                            await memoryStream.CopyToAsync(fileStream);
                        }
                        
                        // Parse the document
                        var parsingRequest = new DocumentParsingRequestDto
                        {
                            DocumentId = documentId,
                            FilePath = tempFilePath,
                            FileType = fileType
                        };
                        
                        var parsingResult = await _documentParsingService.ParseDocumentAsync(parsingRequest);
                        
                        if (parsingResult.Success)
                        {
                            await _documentRepository.UpdateContentAsync(documentId, parsingResult.Content);
                            
                            if (parsingResult.Metadata != null)
                            {
                                var metadata = new DocumentMetadata(
                                    parsingResult.Metadata.PageCount,
                                    parsingResult.Metadata.Author,
                                    parsingResult.Metadata.CreationDate,
                                    parsingResult.Metadata.ModificationDate,
                                    parsingResult.Metadata.Keywords?.ToList() ?? new List<string>());
                                
                                document = await _documentRepository.GetByIdAsync(documentId);
                                document.EnrichMetadata(metadata);
                                await _documentRepository.UpdateAsync(document);
                            }
                            
                            await _documentRepository.UpdateStatusAsync(documentId, DocumentStatus.Classified);
                            await _batchRepository.IncrementProcessedDocumentsAsync(batchId);
                        }
                        else
                        {
                            await _documentRepository.UpdateStatusAsync(documentId, DocumentStatus.Error);
                        }
                        
                        // Clean up temporary file
                        if (File.Exists(tempFilePath))
                        {
                            File.Delete(tempFilePath);
                        }
                    }
                }
                catch (Exception)
                {
                    await _documentRepository.UpdateStatusAsync(documentId, DocumentStatus.Error);
                }
            }
            
            return documentIds;
        }

        public async Task<DocumentDto> UpdateDocumentStatusAsync(Guid documentId, DocumentStatus status)
        {
            await _documentRepository.UpdateStatusAsync(documentId, status);
            var document = await _documentRepository.GetByIdAsync(documentId);
            
            if (document == null)
            {
                throw new KeyNotFoundException($"Document with ID {documentId} not found");
            }
            
            return MapToDto(document);
        }

        public async Task<DocumentDto> GetDocumentWithContentAsync(Guid documentId)
        {
            var document = await _documentRepository.GetWithContentAsync(documentId);
            if (document == null)
            {
                throw new KeyNotFoundException($"Document with ID {documentId} not found");
            }
            
            return MapToDto(document);
        }

        private static FileType GetFileType(string contentType, string fileName)
        {
            if (contentType.Contains("pdf") || fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return FileType.PDF;
            }
            
            if (contentType.Contains("word") || fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase) || fileName.EndsWith(".doc", StringComparison.OrdinalIgnoreCase))
            {
                return FileType.DOCX;
            }
            
            if (contentType.Contains("text") || fileName.EndsWith(".txt", StringComparison.OrdinalIgnoreCase))
            {
                return FileType.TXT;
            }
            
            // Default to TXT
            return FileType.TXT;
        }

        private static DocumentDto MapToDto(Document document)
        {
            var dto = new DocumentDto
            {
                DocumentId = document.DocumentId,
                FileName = document.FileName,
                FileType = document.FileType.ToString(),
                FileSize = document.FileSize,
                UploadDate = document.UploadDate,
                Content = document.Content,
                Status = document.Status.ToString(),
                BatchId = document.BatchId
            };
            
            if (document.Metadata != null)
            {
                dto.Metadata = new DocumentMetadataDto
                {
                    PageCount = document.Metadata.PageCount,
                    Author = document.Metadata.Author,
                    CreationDate = document.Metadata.CreationDate,
                    ModificationDate = document.Metadata.ModificationDate,
                    Keywords = document.Metadata.Keywords?.ToArray() ?? Array.Empty<string>()
                };
            }
            
            return dto;
        }
    }
}
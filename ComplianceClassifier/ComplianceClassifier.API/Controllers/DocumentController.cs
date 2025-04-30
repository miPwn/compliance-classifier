using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Application.Documents.Services;

namespace ComplianceClassifier.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentController : ControllerBase
{
    private readonly ILogger<DocumentController> _logger;
    private readonly IDocumentService _documentService;
    private readonly IBatchService _batchService;

    public DocumentController(
        ILogger<DocumentController> logger,
        IDocumentService documentService,
        IBatchService batchService)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _documentService = documentService ?? throw new ArgumentNullException(nameof(documentService));
        _batchService = batchService ?? throw new ArgumentNullException(nameof(batchService));
    }

    /// <summary>
    /// Creates a new batch for document processing
    /// </summary>
    /// <param name="createBatchDto">Batch creation data</param>
    /// <returns>Batch ID</returns>
    [HttpPost("batch")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BatchDto>> CreateBatch([FromBody] CreateBatchDto createBatchDto)
    {
        try
        {
            if (string.IsNullOrEmpty(createBatchDto.UserId))
            {
                return BadRequest("User ID is required");
            }

            var batch = await _batchService.CreateBatchAsync(createBatchDto);
            return Created($"/api/batch/{batch.BatchId}", batch);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating batch");
            return BadRequest("Failed to create batch");
        }
    }

    /// <summary>
    /// Uploads documents to a batch
    /// </summary>
    /// <param name="batchId">Batch ID</param>
    /// <param name="files">Files to upload</param>
    /// <returns>List of created document IDs</returns>
    [HttpPost("batch/{batchId}/upload")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<Guid>>> UploadDocuments(Guid batchId, [FromForm] List<IFormFile> files)
    {
        try
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files provided");
            }

            // Convert IFormFile to the format expected by the service
            var fileData = new List<(string FileName, Stream Content, string ContentType, long Length)>();
            foreach (var file in files)
            {
                fileData.Add((file.FileName, file.OpenReadStream(), file.ContentType, file.Length));
            }

            var documentIds = await _documentService.UploadDocumentsAsync(batchId, fileData);
            return Ok(documentIds);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"Batch with ID {batchId} not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading documents to batch {BatchId}", batchId);
            return BadRequest("Failed to upload documents");
        }
    }

    /// <summary>
    /// Gets document details
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>Document details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDto>> GetDocument(Guid id)
    {
        try
        {
            var document = await _documentService.GetDocumentByIdAsync(id);
            return Ok(document);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting document {DocumentId}", id);
            return NotFound();
        }
    }

    /// <summary>
    /// Gets all documents in a batch
    /// </summary>
    /// <param name="batchId">Batch ID</param>
    /// <returns>List of documents in batch</returns>
    [HttpGet("batch/{batchId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<DocumentDto>>> GetBatchDocuments(Guid batchId)
    {
        try
        {
            var documents = await _documentService.GetDocumentsByBatchIdAsync(batchId);
            return Ok(documents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting documents for batch {BatchId}", batchId);
            return NotFound();
        }
    }

    /// <summary>
    /// Gets document with content
    /// </summary>
    /// <param name="id">Document ID</param>
    /// <returns>Document with content</returns>
    [HttpGet("{id}/content")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDto>> GetDocumentWithContent(Guid id)
    {
        try
        {
            var document = await _documentService.GetDocumentWithContentAsync(id);
            return Ok(document);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting document content for {DocumentId}", id);
            return NotFound();
        }
    }
}
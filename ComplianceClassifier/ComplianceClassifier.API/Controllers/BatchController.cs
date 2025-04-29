using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Application.Documents.Services;
using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BatchController : ControllerBase
    {
        private readonly ILogger<BatchController> _logger;
        private readonly IBatchService _batchService;

        public BatchController(
            ILogger<BatchController> logger,
            IBatchService batchService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _batchService = batchService ?? throw new ArgumentNullException(nameof(batchService));
        }

        /// <summary>
        /// Creates a new batch
        /// </summary>
        /// <param name="createBatchDto">Batch creation data</param>
        /// <returns>Created batch</returns>
        [HttpPost]
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
                return CreatedAtAction(nameof(GetBatch), new { id = batch.BatchId }, batch);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating batch");
                return BadRequest("Failed to create batch");
            }
        }

        /// <summary>
        /// Gets a batch by ID
        /// </summary>
        /// <param name="id">Batch ID</param>
        /// <returns>Batch details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BatchDto>> GetBatch(Guid id)
        {
            try
            {
                var batch = await _batchService.GetBatchByIdAsync(id);
                return Ok(batch);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting batch {BatchId}", id);
                return NotFound();
            }
        }

        /// <summary>
        /// Gets all batches
        /// </summary>
        /// <returns>List of batches</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BatchDto>>> GetAllBatches()
        {
            try
            {
                var batches = await _batchService.GetAllBatchesAsync();
                return Ok(batches);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all batches");
                return Ok(new List<BatchDto>());
            }
        }

        /// <summary>
        /// Gets batches by user ID
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>List of batches</returns>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BatchDto>>> GetBatchesByUser(string userId)
        {
            try
            {
                var batches = await _batchService.GetBatchesByUserIdAsync(userId);
                return Ok(batches);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting batches for user {UserId}", userId);
                return Ok(new List<BatchDto>());
            }
        }

        /// <summary>
        /// Gets batches by status
        /// </summary>
        /// <param name="status">Batch status</param>
        /// <returns>List of batches</returns>
        [HttpGet("status/{status}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<BatchDto>>> GetBatchesByStatus(string status)
        {
            try
            {
                if (!Enum.TryParse<BatchStatus>(status, true, out var batchStatus))
                {
                    return BadRequest($"Invalid status: {status}");
                }

                var batches = await _batchService.GetBatchesByStatusAsync(batchStatus);
                return Ok(batches);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting batches with status {Status}", status);
                return Ok(new List<BatchDto>());
            }
        }

        /// <summary>
        /// Gets recent batches
        /// </summary>
        /// <param name="count">Number of batches to retrieve</param>
        /// <returns>List of batches</returns>
        [HttpGet("recent")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BatchDto>>> GetRecentBatches([FromQuery] int count = 10)
        {
            try
            {
                var batches = await _batchService.GetRecentBatchesAsync(count);
                return Ok(batches);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent batches");
                return Ok(new List<BatchDto>());
            }
        }

        /// <summary>
        /// Updates batch status
        /// </summary>
        /// <param name="id">Batch ID</param>
        /// <param name="status">New status</param>
        /// <returns>Updated batch</returns>
        [HttpPut("{id}/status/{status}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BatchDto>> UpdateBatchStatus(Guid id, string status)
        {
            try
            {
                if (!Enum.TryParse<BatchStatus>(status, true, out var batchStatus))
                {
                    return BadRequest($"Invalid status: {status}");
                }

                var batch = await _batchService.UpdateBatchStatusAsync(id, batchStatus);
                return Ok(batch);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status for batch {BatchId}", id);
                return BadRequest("Failed to update batch status");
            }
        }

        /// <summary>
        /// Adds documents to a batch
        /// </summary>
        /// <param name="id">Batch ID</param>
        /// <param name="count">Number of documents to add</param>
        /// <returns>Updated batch</returns>
        [HttpPost("{id}/documents")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BatchDto>> AddDocumentsToBatch(Guid id, [FromBody] int count)
        {
            try
            {
                if (count <= 0)
                {
                    return BadRequest("Document count must be greater than zero");
                }

                var batch = await _batchService.AddDocumentsToBatchAsync(id, count);
                return Ok(batch);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding documents to batch {BatchId}", id);
                return BadRequest("Failed to add documents to batch");
            }
        }
    }
}
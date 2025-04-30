using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ComplianceClassifier.Application.Documents.Services;

namespace ComplianceClassifier.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FileController : ControllerBase
{
    private readonly IFileService _fileService;
    private readonly ILogger<FileController> _logger;
    private readonly long _fileSizeLimit = 50 * 1024 * 1024; // 50MB
    private readonly string[] _allowedExtensions = { ".pdf", ".doc", ".docx", ".txt", ".csv", ".xls", ".xlsx" };

    public FileController(
        IFileService fileService,
        ILogger<FileController> logger)
    {
        _fileService = fileService ?? throw new ArgumentNullException(nameof(fileService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Uploads a file
    /// </summary>
    /// <param name="file">File to upload</param>
    /// <returns>File path</returns>
    [HttpPost("upload")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [RequestSizeLimit(52428800)] // 50MB in bytes
    public async Task<ActionResult<string>> UploadFile(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file was provided");
            }

            // Validate file size
            if (file.Length > _fileSizeLimit)
            {
                return BadRequest($"File size exceeds the limit of {_fileSizeLimit / (1024 * 1024)}MB");
            }

            // Validate file extension
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !Array.Exists(_allowedExtensions, e => e == extension))
            {
                return BadRequest($"File type {extension} is not allowed");
            }

            // Scan file for malware (placeholder for actual implementation)
            // await _malwareScanner.ScanFileAsync(file.OpenReadStream());

            // Save file securely
            using (var stream = file.OpenReadStream())
            {
                string filePath = await _fileService.SaveFileAsync(stream, file.FileName, file.ContentType);
                return Ok(new { filePath });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file {FileName}", file?.FileName);
            return BadRequest("Failed to upload file");
        }
    }

    /// <summary>
    /// Downloads a file
    /// </summary>
    /// <param name="filePath">File path</param>
    /// <returns>File</returns>
    [HttpGet("download")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DownloadFile([FromQuery] string filePath)
    {
        try
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return BadRequest("File path is required");
            }

            var (fileStream, contentType) = await _fileService.GetFileAsync(filePath);
            return File(fileStream, contentType, Path.GetFileName(filePath));
        }
        catch (FileNotFoundException)
        {
            return NotFound("File not found");
        }
        catch (UnauthorizedAccessException)
        {
            return BadRequest("Access to the file is denied");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file {FilePath}", filePath);
            return BadRequest("Failed to download file");
        }
    }

    /// <summary>
    /// Deletes a file
    /// </summary>
    /// <param name="filePath">File path</param>
    /// <returns>Success message</returns>
    [HttpDelete("delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteFile([FromQuery] string filePath)
    {
        try
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return BadRequest("File path is required");
            }

            await _fileService.DeleteFileAsync(filePath);
            return Ok(new { message = "File deleted successfully" });
        }
        catch (FileNotFoundException)
        {
            return NotFound("File not found");
        }
        catch (UnauthorizedAccessException)
        {
            return BadRequest("Access to the file is denied");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file {FilePath}", filePath);
            return BadRequest("Failed to delete file");
        }
    }
}
using System.Security.Cryptography;
using Microsoft.Extensions.Logging;
using ComplianceClassifier.Application.Documents.Services;

namespace ComplianceClassifier.Infrastructure.FileStorage
{
    /// <summary>
    /// Implementation of secure file service
    /// </summary>
    public class SecureFileService : IFileService
    {
        private readonly ILogger<SecureFileService> _logger;
        private readonly string _baseStoragePath;
        private readonly string _encryptionKey;

        /// <summary>
        /// Initializes a new instance of the <see cref="SecureFileService"/> class
        /// </summary>
        public SecureFileService(
            ILogger<SecureFileService> logger,
            string baseStoragePath,
            string encryptionKey)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _baseStoragePath = baseStoragePath ?? throw new ArgumentNullException(nameof(baseStoragePath));
            _encryptionKey = encryptionKey ?? throw new ArgumentNullException(nameof(encryptionKey));

            // Ensure the storage directory exists
            if (!Directory.Exists(_baseStoragePath))
            {
                Directory.CreateDirectory(_baseStoragePath);
            }
        }

        /// <inheritdoc/>
        public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType)
        {
            if (fileStream == null)
            {
                throw new ArgumentNullException(nameof(fileStream));
            }

            if (string.IsNullOrEmpty(fileName))
            {
                throw new ArgumentNullException(nameof(fileName));
            }

            try
            {
                // Generate a unique file name to prevent path traversal attacks
                string safeFileName = Path.GetRandomFileName() + Path.GetExtension(fileName);
                string relativePath = Path.Combine(DateTime.UtcNow.ToString("yyyy-MM-dd"), safeFileName);
                string fullPath = Path.Combine(_baseStoragePath, relativePath);

                // Ensure the directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(fullPath));

                // Encrypt and save the file
                using (var outputStream = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None))
                using (var aes = Aes.Create())
                {
                    aes.Key = Convert.FromBase64String(_encryptionKey);
                    aes.GenerateIV();

                    // Write the IV to the beginning of the file
                    await outputStream.WriteAsync(aes.IV, 0, aes.IV.Length);

                    using (var cryptoStream = new CryptoStream(outputStream, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        await fileStream.CopyToAsync(cryptoStream);
                    }
                }

                return relativePath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file {FileName}", fileName);
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<(Stream FileStream, string ContentType)> GetFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                throw new ArgumentNullException(nameof(filePath));
            }

            try
            {
                // Prevent path traversal attacks
                string normalizedPath = Path.GetFullPath(Path.Combine(_baseStoragePath, filePath));
                if (!normalizedPath.StartsWith(_baseStoragePath))
                {
                    throw new UnauthorizedAccessException("Access to the path is denied.");
                }

                if (!File.Exists(normalizedPath))
                {
                    throw new FileNotFoundException("File not found.", filePath);
                }

                // Determine content type based on file extension
                string contentType = GetContentType(Path.GetExtension(filePath));

                // Decrypt and return the file
                var memoryStream = new MemoryStream();
                using (var inputStream = new FileStream(normalizedPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    // Read the IV from the beginning of the file
                    byte[] iv = new byte[16]; // AES IV size is 16 bytes
                    await inputStream.ReadAsync(iv, 0, iv.Length);

                    using (var aes = Aes.Create())
                    {
                        aes.Key = Convert.FromBase64String(_encryptionKey);
                        aes.IV = iv;

                        using (var cryptoStream = new CryptoStream(inputStream, aes.CreateDecryptor(), CryptoStreamMode.Read))
                        {
                            await cryptoStream.CopyToAsync(memoryStream);
                        }
                    }
                }

                memoryStream.Position = 0;
                return (memoryStream, contentType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving file {FilePath}", filePath);
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task DeleteFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                throw new ArgumentNullException(nameof(filePath));
            }

            try
            {
                // Prevent path traversal attacks
                string normalizedPath = Path.GetFullPath(Path.Combine(_baseStoragePath, filePath));
                if (!normalizedPath.StartsWith(_baseStoragePath))
                {
                    throw new UnauthorizedAccessException("Access to the path is denied.");
                }

                if (File.Exists(normalizedPath))
                {
                    File.Delete(normalizedPath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file {FilePath}", filePath);
                throw;
            }
        }

        /// <summary>
        /// Gets the content type based on file extension
        /// </summary>
        /// <param name="extension">File extension</param>
        /// <returns>Content type</returns>
        private string GetContentType(string extension)
        {
            return extension.ToLower() switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".txt" => "text/plain",
                ".csv" => "text/csv",
                ".json" => "application/json",
                ".xml" => "application/xml",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };
        }
    }
}
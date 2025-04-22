using System.IO;
using System.Threading.Tasks;

namespace ComplianceClassifier.Application.Documents.Services
{
    /// <summary>
    /// Interface for file storage service
    /// </summary>
    public interface IFileService
    {
        /// <summary>
        /// Saves a file to storage
        /// </summary>
        /// <param name="fileStream">File stream</param>
        /// <param name="fileName">File name</param>
        /// <param name="contentType">Content type</param>
        /// <returns>Relative path to the saved file</returns>
        Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType);

        /// <summary>
        /// Gets a file from storage
        /// </summary>
        /// <param name="filePath">Relative path to the file</param>
        /// <returns>File stream and content type</returns>
        Task<(Stream FileStream, string ContentType)> GetFileAsync(string filePath);

        /// <summary>
        /// Deletes a file from storage
        /// </summary>
        /// <param name="filePath">Relative path to the file</param>
        /// <returns>Task</returns>
        Task DeleteFileAsync(string filePath);
    }
}
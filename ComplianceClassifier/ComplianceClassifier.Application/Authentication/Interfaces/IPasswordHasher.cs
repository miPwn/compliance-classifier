namespace ComplianceClassifier.Application.Authentication.Interfaces
{
    /// <summary>
    /// Interface for password hashing service
    /// </summary>
    public interface IPasswordHasher
    {
        /// <summary>
        /// Hashes a password for a user
        /// </summary>
        /// <param name="password">Password to hash</param>
        /// <param name="userId">User ID</param>
        /// <returns>Task</returns>
        Task HashPasswordAsync(string password, Guid userId);

        /// <summary>
        /// Verifies a password for a user
        /// </summary>
        /// <param name="password">Password to verify</param>
        /// <param name="userId">User ID</param>
        /// <returns>True if password is valid, false otherwise</returns>
        Task<bool> VerifyPasswordAsync(string password, Guid userId);
    }
}
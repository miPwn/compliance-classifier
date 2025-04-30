namespace ComplianceClassifier.Domain.Interfaces;

/// <summary>
/// Interface for user password repository
/// </summary>
public interface IUserPasswordRepository
{
    /// <summary>
    /// Stores a password hash for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="passwordHash">Password hash</param>
    /// <returns>Task</returns>
    Task StorePasswordAsync(Guid userId, string passwordHash);

    /// <summary>
    /// Gets a password hash for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>Password hash if found, null otherwise</returns>
    Task<string> GetPasswordHashAsync(Guid userId);

    /// <summary>
    /// Deletes a password hash for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>True if deleted, false otherwise</returns>
    Task<bool> DeletePasswordAsync(Guid userId);
}
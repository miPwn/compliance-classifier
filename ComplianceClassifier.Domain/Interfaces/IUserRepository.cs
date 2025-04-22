using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ComplianceClassifier.Domain.Aggregates;

namespace ComplianceClassifier.Domain.Interfaces
{
    /// <summary>
    /// Interface for user repository
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Gets a user by ID
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User if found, null otherwise</returns>
        Task<User> GetByIdAsync(Guid id);

        /// <summary>
        /// Gets a user by username
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>User if found, null otherwise</returns>
        Task<User> GetByUsernameAsync(string username);

        /// <summary>
        /// Gets a user by email
        /// </summary>
        /// <param name="email">Email address</param>
        /// <returns>User if found, null otherwise</returns>
        Task<User> GetByEmailAsync(string email);

        /// <summary>
        /// Creates a new user
        /// </summary>
        /// <param name="user">User to create</param>
        /// <returns>Created user</returns>
        Task<User> CreateAsync(User user);

        /// <summary>
        /// Updates an existing user
        /// </summary>
        /// <param name="user">User to update</param>
        /// <returns>Updated user</returns>
        Task<User> UpdateAsync(User user);

        /// <summary>
        /// Deletes a user
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>True if deleted, false otherwise</returns>
        Task<bool> DeleteAsync(Guid id);

        /// <summary>
        /// Gets all users
        /// </summary>
        /// <returns>List of users</returns>
        Task<IEnumerable<User>> GetAllAsync();

        /// <summary>
        /// Gets users by role
        /// </summary>
        /// <param name="role">Role name</param>
        /// <returns>List of users with the specified role</returns>
        Task<IEnumerable<User>> GetByRoleAsync(string role);
    }
}
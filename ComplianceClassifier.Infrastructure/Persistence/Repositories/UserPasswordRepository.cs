using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Infrastructure.Persistence.Entities;

namespace ComplianceClassifier.Infrastructure.Persistence.Repositories
{
    /// <summary>
    /// Implementation of the user password repository
    /// </summary>
    public class UserPasswordRepository : IUserPasswordRepository
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<UserPasswordRepository> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserPasswordRepository"/> class
        /// </summary>
        public UserPasswordRepository(
            ApplicationDbContext dbContext,
            ILogger<UserPasswordRepository> logger)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <inheritdoc/>
        public async Task<string> GetPasswordHashAsync(Guid userId)
        {
            try
            {
                var userPassword = await _dbContext.UserPasswords
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                return userPassword?.PasswordHash;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting password hash for user {UserId}", userId);
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task StorePasswordAsync(Guid userId, string passwordHash)
        {
            if (string.IsNullOrEmpty(passwordHash))
            {
                throw new ArgumentNullException(nameof(passwordHash));
            }

            try
            {
                var existingPassword = await _dbContext.UserPasswords
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (existingPassword != null)
                {
                    // Update existing password
                    existingPassword.PasswordHash = passwordHash;
                    existingPassword.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    // Create new password
                    _dbContext.UserPasswords.Add(new UserPassword
                    {
                        UserId = userId,
                        PasswordHash = passwordHash,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error storing password hash for user {UserId}", userId);
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> DeletePasswordAsync(Guid userId)
        {
            try
            {
                var userPassword = await _dbContext.UserPasswords
                    .FirstOrDefaultAsync(p => p.UserId == userId);

                if (userPassword == null)
                {
                    return false;
                }

                _dbContext.UserPasswords.Remove(userPassword);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting password hash for user {UserId}", userId);
                return false;
            }
        }
    }
}
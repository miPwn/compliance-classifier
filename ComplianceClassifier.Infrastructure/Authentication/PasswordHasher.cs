using ComplianceClassifier.Application.Authentication.Interfaces;
using ComplianceClassifier.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace ComplianceClassifier.Infrastructure.Authentication
{
    /// <summary>
    /// Implementation of the password hasher using BCrypt
    /// </summary>
    public class PasswordHasher : IPasswordHasher
    {
        private readonly IUserPasswordRepository _userPasswordRepository;
        private readonly ILogger<PasswordHasher> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="PasswordHasher"/> class
        /// </summary>
        public PasswordHasher(
            IUserPasswordRepository userPasswordRepository,
            ILogger<PasswordHasher> logger)
        {
            _userPasswordRepository = userPasswordRepository ?? throw new ArgumentNullException(nameof(userPasswordRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <inheritdoc/>
        public async Task HashPasswordAsync(string password, Guid userId)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentNullException(nameof(password));
            }

            try
            {
                // Generate a salt and hash the password
                string salt = BCrypt.Net.BCrypt.GenerateSalt(12);
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);

                // Store the hashed password
                await _userPasswordRepository.StorePasswordAsync(userId, hashedPassword);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error hashing password for user {UserId}", userId);
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<bool> VerifyPasswordAsync(string password, Guid userId)
        {
            if (string.IsNullOrEmpty(password))
            {
                return false;
            }

            try
            {
                // Get the stored hashed password
                string storedHash = await _userPasswordRepository.GetPasswordHashAsync(userId);
                if (string.IsNullOrEmpty(storedHash))
                {
                    return false;
                }

                // Verify the password
                return BCrypt.Net.BCrypt.Verify(password, storedHash);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying password for user {UserId}", userId);
                return false;
            }
        }
    }
}
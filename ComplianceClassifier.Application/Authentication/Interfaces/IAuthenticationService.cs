using System;
using System.Threading.Tasks;
using ComplianceClassifier.Application.Authentication.DTOs;

namespace ComplianceClassifier.Application.Authentication.Interfaces
{
    /// <summary>
    /// Interface for authentication service
    /// </summary>
    public interface IAuthenticationService
    {
        /// <summary>
        /// Authenticates a user with username and password
        /// </summary>
        /// <param name="request">Authentication request</param>
        /// <returns>Authentication result</returns>
        Task<AuthenticationResultDto> AuthenticateAsync(AuthenticationRequestDto request);

        /// <summary>
        /// Registers a new user
        /// </summary>
        /// <param name="request">Registration request</param>
        /// <returns>Registration result</returns>
        Task<RegistrationResultDto> RegisterAsync(RegistrationRequestDto request);

        /// <summary>
        /// Validates a JWT token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>True if valid, false otherwise</returns>
        Task<bool> ValidateTokenAsync(string token);

        /// <summary>
        /// Refreshes a JWT token
        /// </summary>
        /// <param name="request">Refresh token request</param>
        /// <returns>New authentication result</returns>
        Task<AuthenticationResultDto> RefreshTokenAsync(RefreshTokenRequestDto request);

        /// <summary>
        /// Revokes a refresh token
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="refreshToken">Refresh token</param>
        /// <returns>True if revoked, false otherwise</returns>
        Task<bool> RevokeRefreshTokenAsync(Guid userId, string refreshToken);
    }
}
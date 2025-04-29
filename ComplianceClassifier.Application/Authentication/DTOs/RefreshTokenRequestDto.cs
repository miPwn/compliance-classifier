using System.ComponentModel.DataAnnotations;

namespace ComplianceClassifier.Application.Authentication.DTOs
{
    /// <summary>
    /// DTO for refresh token request
    /// </summary>
    public class RefreshTokenRequestDto
    {
        /// <summary>
        /// Gets or sets the user ID
        /// </summary>
        [Required]
        public Guid UserId { get; set; }

        /// <summary>
        /// Gets or sets the refresh token
        /// </summary>
        [Required]
        public string RefreshToken { get; set; }
    }
}
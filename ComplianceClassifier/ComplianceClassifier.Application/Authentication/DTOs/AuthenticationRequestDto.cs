using System.ComponentModel.DataAnnotations;

namespace ComplianceClassifier.Application.Authentication.DTOs;

/// <summary>
/// DTO for authentication request
/// </summary>
public class AuthenticationRequestDto
{
    /// <summary>
    /// Gets or sets the username
    /// </summary>
    [Required]
    public string Username { get; set; }

    /// <summary>
    /// Gets or sets the password
    /// </summary>
    [Required]
    public string Password { get; set; }
}
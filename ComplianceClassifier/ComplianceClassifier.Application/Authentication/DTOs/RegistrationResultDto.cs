namespace ComplianceClassifier.Application.Authentication.DTOs;

/// <summary>
/// DTO for registration result
/// </summary>
public class RegistrationResultDto
{
    /// <summary>
    /// Gets or sets the user ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Gets or sets the username
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    /// Gets or sets the user's email
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Gets or sets whether the registration was successful
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Gets or sets the JWT token if registration was successful
    /// </summary>
    public string Token { get; set; }

    /// <summary>
    /// Gets or sets the refresh token if registration was successful
    /// </summary>
    public string RefreshToken { get; set; }

    /// <summary>
    /// Gets or sets the token expiration date
    /// </summary>
    public DateTime? Expiration { get; set; }

    /// <summary>
    /// Gets or sets the error message if registration failed
    /// </summary>
    public string ErrorMessage { get; set; }

    /// <summary>
    /// Gets or sets the validation errors if registration failed
    /// </summary>
    public Dictionary<string, List<string>> ValidationErrors { get; set; }
}
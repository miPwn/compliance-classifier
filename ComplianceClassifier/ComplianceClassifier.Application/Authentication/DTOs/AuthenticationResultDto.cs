namespace ComplianceClassifier.Application.Authentication.DTOs;

/// <summary>
/// DTO for authentication result
/// </summary>
public class AuthenticationResultDto
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
    /// Gets or sets the user's first name
    /// </summary>
    public string FirstName { get; set; }

    /// <summary>
    /// Gets or sets the user's last name
    /// </summary>
    public string LastName { get; set; }

    /// <summary>
    /// Gets or sets the user's email
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Gets or sets the JWT token
    /// </summary>
    public string Token { get; set; }

    /// <summary>
    /// Gets or sets the refresh token
    /// </summary>
    public string RefreshToken { get; set; }

    /// <summary>
    /// Gets or sets the token expiration date
    /// </summary>
    public DateTime Expiration { get; set; }

    /// <summary>
    /// Gets or sets the user's roles
    /// </summary>
    public IEnumerable<string> Roles { get; set; }

    /// <summary>
    /// Gets or sets whether the authentication was successful
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Gets or sets the error message if authentication failed
    /// </summary>
    public string ErrorMessage { get; set; }
}
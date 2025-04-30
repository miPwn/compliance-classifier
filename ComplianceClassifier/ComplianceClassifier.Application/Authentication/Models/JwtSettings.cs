namespace ComplianceClassifier.Application.Authentication.Models;

/// <summary>
/// JWT settings model
/// </summary>
public class JwtSettings
{
    /// <summary>
    /// Gets or sets the JWT issuer
    /// </summary>
    public string Issuer { get; set; }

    /// <summary>
    /// Gets or sets the JWT audience
    /// </summary>
    public string Audience { get; set; }

    /// <summary>
    /// Gets or sets the JWT secret key
    /// </summary>
    public string SecretKey { get; set; }

    /// <summary>
    /// Gets or sets the JWT expiry in minutes
    /// </summary>
    public int ExpiryInMinutes { get; set; }

    /// <summary>
    /// Gets or sets the refresh token expiry in days
    /// </summary>
    public int RefreshTokenExpiryInDays { get; set; } = 7;
}
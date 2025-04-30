namespace ComplianceClassifier.Domain.ValueObjects;

/// <summary>
/// Represents a refresh token
/// </summary>
public class RefreshToken
{
    /// <summary>
    /// Gets or sets the token value
    /// </summary>
    public string Token { get; private set; }

    /// <summary>
    /// Gets or sets the expiration date
    /// </summary>
    public DateTime Expires { get; }

    /// <summary>
    /// Gets or sets the creation date
    /// </summary>
    public DateTime Created { get; private set; }

    /// <summary>
    /// Gets or sets the date the token was revoked
    /// </summary>
    public DateTime? Revoked { get; private set; }

    /// <summary>
    /// Gets whether the token is expired
    /// </summary>
    public bool IsExpired => DateTime.UtcNow >= Expires;

    /// <summary>
    /// Gets whether the token is active
    /// </summary>
    public bool IsActive => Revoked == null && !IsExpired;

    // For EF Core
    private RefreshToken() { }

    /// <summary>
    /// Creates a new refresh token
    /// </summary>
    /// <param name="token">Token value</param>
    /// <param name="expires">Expiration date</param>
    public RefreshToken(string token, DateTime expires)
    {
        Token = token ?? throw new ArgumentNullException(nameof(token));
        Expires = expires;
        Created = DateTime.UtcNow;
    }

    /// <summary>
    /// Revokes the token
    /// </summary>
    public void Revoke()
    {
        Revoked = DateTime.UtcNow;
    }
}
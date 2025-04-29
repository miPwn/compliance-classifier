using ComplianceClassifier.Domain.ValueObjects;

namespace ComplianceClassifier.Domain.Aggregates
{
    /// <summary>
    /// Represents a user in the system
    /// </summary>
    public class User
    {
        /// <summary>
        /// Gets or sets the user ID
        /// </summary>
        public Guid Id { get; private set; }

        /// <summary>
        /// Gets or sets the username
        /// </summary>
        public string Username { get; private set; }

        /// <summary>
        /// Gets or sets the email address
        /// </summary>
        public string Email { get; private set; }

        /// <summary>
        /// Gets or sets the user's first name
        /// </summary>
        public string FirstName { get; private set; }

        /// <summary>
        /// Gets or sets the user's last name
        /// </summary>
        public string LastName { get; private set; }

        /// <summary>
        /// Gets or sets the user's roles
        /// </summary>
        public ICollection<string> Roles { get; private set; }

        /// <summary>
        /// Gets or sets the date the user was created
        /// </summary>
        public DateTime CreatedAt { get; private set; }

        /// <summary>
        /// Gets or sets the date the user was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; private set; }

        /// <summary>
        /// Gets or sets the user's refresh tokens
        /// </summary>
        public ICollection<RefreshToken> RefreshTokens { get; private set; } = new List<RefreshToken>();

        // Private constructor for EF Core
        private User() { }

        /// <summary>
        /// Creates a new user
        /// </summary>
        public User(Guid id, string username, string email, string firstName, string lastName, ICollection<string> roles)
        {
            Id = id;
            Username = username ?? throw new ArgumentNullException(nameof(username));
            Email = email ?? throw new ArgumentNullException(nameof(email));
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName ?? throw new ArgumentNullException(nameof(lastName));
            Roles = roles ?? new List<string>();
            CreatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Updates the user's information
        /// </summary>
        public void Update(string email, string firstName, string lastName)
        {
            Email = email ?? throw new ArgumentNullException(nameof(email));
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName ?? throw new ArgumentNullException(nameof(lastName));
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Adds a role to the user
        /// </summary>
        public void AddRole(string role)
        {
            if (string.IsNullOrEmpty(role))
            {
                throw new ArgumentNullException(nameof(role));
            }

            if (Roles == null)
            {
                Roles = new List<string>();
            }

            if (!Roles.Contains(role))
            {
                ((List<string>)Roles).Add(role);
                UpdatedAt = DateTime.UtcNow;
            }
        }

        /// <summary>
        /// Removes a role from the user
        /// </summary>
        public void RemoveRole(string role)
        {
            if (string.IsNullOrEmpty(role))
            {
                throw new ArgumentNullException(nameof(role));
            }

            if (Roles != null && Roles.Contains(role))
            {
                ((List<string>)Roles).Remove(role);
                UpdatedAt = DateTime.UtcNow;
            }
        }

        /// <summary>
        /// Adds a refresh token to the user
        /// </summary>
        /// <param name="token">Token value</param>
        /// <param name="expires">Expiration date</param>
        /// <returns>The created refresh token</returns>
        public RefreshToken AddRefreshToken(string token, DateTime expires)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new ArgumentNullException(nameof(token));
            }

            var refreshToken = new RefreshToken(token, expires);
            RefreshTokens.Add(refreshToken);
            UpdatedAt = DateTime.UtcNow;
            return refreshToken;
        }

        /// <summary>
        /// Revokes a refresh token
        /// </summary>
        /// <param name="token">Token value</param>
        /// <returns>True if the token was found and revoked, false otherwise</returns>
        public bool RevokeRefreshToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new ArgumentNullException(nameof(token));
            }

            var refreshToken = RefreshTokens.FirstOrDefault(t => t.Token == token);
            if (refreshToken == null || !refreshToken.IsActive)
            {
                return false;
            }

            refreshToken.Revoke();
            UpdatedAt = DateTime.UtcNow;
            return true;
        }

        /// <summary>
        /// Gets an active refresh token
        /// </summary>
        /// <param name="token">Token value</param>
        /// <returns>The refresh token if found and active, null otherwise</returns>
        public RefreshToken GetActiveRefreshToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            return RefreshTokens.FirstOrDefault(t => t.Token == token && t.IsActive);
        }
    }
}
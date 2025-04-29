namespace ComplianceClassifier.Infrastructure.Persistence.Entities
{
    /// <summary>
    /// Entity for storing user passwords
    /// </summary>
    public class UserPassword
    {
        /// <summary>
        /// Gets or sets the user ID
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Gets or sets the password hash
        /// </summary>
        public string PasswordHash { get; set; }

        /// <summary>
        /// Gets or sets the date the password was created
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Gets or sets the date the password was last updated
        /// </summary>
        public DateTime? UpdatedAt { get; set; }
    }
}
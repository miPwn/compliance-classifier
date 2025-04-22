using System;

namespace ComplianceClassifier.Infrastructure.Persistence
{
    /// <summary>
    /// Interface for providing database connection strings
    /// </summary>
    public interface IConnectionStringProvider
    {
        /// <summary>
        /// Gets the connection string for the application database
        /// </summary>
        /// <returns>The connection string</returns>
        string GetConnectionString();
    }
}
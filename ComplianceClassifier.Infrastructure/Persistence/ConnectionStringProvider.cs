using System;
using Microsoft.Extensions.Configuration;
using DotNetEnv;

namespace ComplianceClassifier.Infrastructure.Persistence
{
    /// <summary>
    /// Provides database connection strings from configuration
    /// </summary>
    public class ConnectionStringProvider : IConnectionStringProvider
    {
        private readonly IConfiguration _configuration;

        public ConnectionStringProvider(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            
            // Load environment variables from .env file if it exists
            Env.Load();
        }

        /// <summary>
        /// Gets the connection string for the application database
        /// </summary>
        /// <returns>The connection string</returns>
        public string GetConnectionString()
        {
            // Get the connection string from configuration
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            
            // If the connection string contains environment variable placeholders, replace them
            if (connectionString.Contains("${"))
            {
                // Get environment variables with no hardcoded fallbacks for sensitive data
                string host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
                string port = Environment.GetEnvironmentVariable("POSTGRES_PORT");
                string database = Environment.GetEnvironmentVariable("POSTGRES_DB");
                string username = Environment.GetEnvironmentVariable("POSTGRES_USER");
                string password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
                
                // Validate required environment variables
                if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                {
                    throw new InvalidOperationException(
                        "Database credentials not found. Please set POSTGRES_USER and POSTGRES_PASSWORD environment variables.");
                }
                
                // Replace placeholders with environment variables
                connectionString = connectionString
                    .Replace("${POSTGRES_HOST}", host ?? "localhost")
                    .Replace("${POSTGRES_PORT}", port ?? "5432")
                    .Replace("${POSTGRES_DB}", database ?? "comp-filer")
                    .Replace("${POSTGRES_USER}", username)
                    .Replace("${POSTGRES_PASSWORD}", password);
            }

            return connectionString;
        }
    }
}
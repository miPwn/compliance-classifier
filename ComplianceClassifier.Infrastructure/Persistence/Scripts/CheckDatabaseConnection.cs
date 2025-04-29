using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ComplianceClassifier.Infrastructure.Persistence.Scripts
{
    /// <summary>
    /// Utility class to check database connection
    /// </summary>
    public class CheckDatabaseConnection
    {
        /// <summary>
        /// Main entry point for the database connection check utility
        /// </summary>
        public static async Task Main(string[] args)
        {
            try
            {
                Console.WriteLine("Checking database connection...");

                // Load environment variables from .env file if it exists
                Env.Load();
                Env.TraversePath().Load();

                // Load configuration
                var configuration = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: true)
                    .AddJsonFile("appsettings.Development.json", optional: true)
                    .AddEnvironmentVariables()
                    .Build();

                // Create connection string provider
                var connectionStringProvider = new ConnectionStringProvider(configuration);
                var connectionString = connectionStringProvider.GetConnectionString();

                Console.WriteLine($"Using connection string: {MaskPassword(connectionString)}");

                // Configure DbContext options
                var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
                optionsBuilder.UseNpgsql(connectionString);

                // Create and test the context
                using (var context = new ApplicationDbContext(optionsBuilder.Options, connectionStringProvider))
                {
                    Console.WriteLine("Attempting to connect to the database...");

                    // Check if the database exists and can be connected to
                    bool canConnect = await context.Database.CanConnectAsync();

                    if (canConnect)
                    {
                        Console.WriteLine("✅ Successfully connected to the database.");

                        // Check if the schema is properly set up by querying the tables
                        try
                        {
                            int batchCount = await context.Batches.CountAsync();
                            int documentCount = await context.Documents.CountAsync();
                            int classificationCount = await context.Classifications.CountAsync();
                            int reportCount = await context.Reports.CountAsync();

                            Console.WriteLine("✅ Database schema is properly set up.");
                            Console.WriteLine($"Current record counts:");
                            Console.WriteLine($"- Batches: {batchCount}");
                            Console.WriteLine($"- Documents: {documentCount}");
                            Console.WriteLine($"- Classifications: {classificationCount}");
                            Console.WriteLine($"- Reports: {reportCount}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("❌ Database schema is not properly set up.");
                            Console.WriteLine($"Error: {ex.Message}");
                            Console.WriteLine("Please run the database initialization script to set up the schema.");
                        }
                    }
                    else
                    {
                        Console.WriteLine("❌ Failed to connect to the database.");
                        Console.WriteLine("Please check your connection string and ensure the database server is running.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ An error occurred while checking the database connection:");
                Console.WriteLine(ex.ToString());
            }
        }

        /// <summary>
        /// Masks the password in a connection string for display purposes
        /// </summary>
        private static string MaskPassword(string connectionString)
        {
            if (string.IsNullOrEmpty(connectionString))
                return connectionString;

            // Find the password part and mask it
            int passwordIndex = connectionString.IndexOf("Password=", StringComparison.OrdinalIgnoreCase);
            if (passwordIndex < 0)
                return connectionString;

            int passwordEndIndex = connectionString.IndexOf(';', passwordIndex);
            if (passwordEndIndex < 0)
                passwordEndIndex = connectionString.Length;
            return connectionString.Substring(0, passwordIndex + 9) + "********" +
                   connectionString.Substring(passwordEndIndex);
        }
    }
}
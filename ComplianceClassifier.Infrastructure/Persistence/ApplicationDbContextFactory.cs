using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using DotNetEnv;

namespace ComplianceClassifier.Infrastructure.Persistence
{
    /// <summary>
    /// Factory for creating ApplicationDbContext instances during design-time operations
    /// such as migrations and scaffolding
    /// </summary>
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Load environment variables from .env file
            var rootDirectory = Directory.GetCurrentDirectory();
            while (!File.Exists(Path.Combine(rootDirectory, ".env")) && Directory.GetParent(rootDirectory) != null)
            {
                rootDirectory = Directory.GetParent(rootDirectory).FullName;
            }

            var envPath = Path.Combine(rootDirectory, ".env");
            if (File.Exists(envPath))
            {
                Env.Load(envPath);
            }

            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(rootDirectory)
                .AddJsonFile("ComplianceClassifier.API/appsettings.json", optional: true)
                .AddJsonFile("ComplianceClassifier.API/appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            // Create connection string provider
            var connectionStringProvider = new ConnectionStringProvider(configuration);

            // Configure DbContext options
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseNpgsql(connectionStringProvider.GetConnectionString());

            return new ApplicationDbContext(optionsBuilder.Options, connectionStringProvider);
        }
    }
}
using ComplianceClassifier.API;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ComplianceClassifier.Infrastructure.Persistence;

namespace ComplianceClassifier.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Find the DbContext service descriptor
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Remove the registered IConnectionStringProvider
            var connectionStringProviderDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(IConnectionStringProvider));

            if (connectionStringProviderDescriptor != null)
            {
                services.Remove(connectionStringProviderDescriptor);
            }

            // Add test connection string provider
            services.AddSingleton<IConnectionStringProvider, TestConnectionStringProvider>();

            // Add ApplicationDbContext using an in-memory database for testing
            services.AddDbContext<ApplicationDbContext>((options, context) =>
            {
                context.UseInMemoryDatabase("IntegrationTestsDb");
            });

            // Build the service provider
            var sp = services.BuildServiceProvider();

            // Create a scope to obtain a reference to the database context
            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<ApplicationDbContext>();
                var logger = scopedServices.GetRequiredService<ILogger<CustomWebApplicationFactory>>();

                // Ensure the database is created
                db.Database.EnsureCreated();

                try
                {
                    // Seed the database with test data if needed
                    // InitializeDbForTests(db);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred seeding the database. Error: {Message}", ex.Message);
                }
            }
        });
    }
}

public class TestConnectionStringProvider : IConnectionStringProvider
{
    public string GetConnectionString()
    {
        return "Data Source=:memory:";
    }
}
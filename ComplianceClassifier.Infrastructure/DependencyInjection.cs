using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Application.Documents.Services;
using ComplianceClassifier.Application.Authentication.Interfaces;
using ComplianceClassifier.Application.Authentication.Models;
using ComplianceClassifier.Infrastructure.DocumentParsers;
using ComplianceClassifier.Infrastructure.DocumentParsers.Factory;
using ComplianceClassifier.Infrastructure.DocumentParsers.Implementations;
using ComplianceClassifier.Infrastructure.Persistence;
using ComplianceClassifier.Infrastructure.Persistence.Repositories;
using ComplianceClassifier.Infrastructure.Authentication;
using ComplianceClassifier.Infrastructure.FileStorage;
using DotNetEnv;

namespace ComplianceClassifier.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Load environment variables from .env file if it exists
            Env.Load();

            // Register database services
            services.AddScoped<IConnectionStringProvider, ConnectionStringProvider>();
            
            // Register DbContext
            services.AddDbContext<ApplicationDbContext>((provider, options) =>
            {
                var connectionStringProvider = provider.GetRequiredService<IConnectionStringProvider>();
                options.UseNpgsql(connectionStringProvider.GetConnectionString());
            });

            // Register repositories
            services.AddScoped<IDocumentRepository, Persistence.Repositories.DocumentRepository>();
            services.AddScoped<IClassificationRepository, Persistence.Repositories.ClassificationRepository>();
            services.AddScoped<IBatchRepository, Persistence.Repositories.BatchRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserPasswordRepository, UserPasswordRepository>();
            // services.AddScoped<IReportRepository, ReportRepository>(); // Will be implemented later

            // Register domain services
            // These will be implemented later
            // services.AddScoped<IDocumentClassificationService, DocumentClassificationService>();
            // services.AddScoped<IDocumentProcessingService, DocumentProcessingService>();
            // services.AddScoped<IReportGenerationService, ReportGenerationService>();
            // services.AddScoped<IAIService, AIService>();
            // services.AddScoped<IReportGenerator, ReportGenerator>();

            // Register document parser services
            services.AddScoped<IDocumentParserFactory, DocumentParserFactory>();
            services.AddScoped<IDocumentParserService, DocumentParserService>();
            services.AddScoped<IDocumentParsingService, DocumentParsingService>();
            
            // Register document parsers
            services.AddScoped<TxtDocumentParser>();
            services.AddScoped<PdfDocumentParser>();
            services.AddScoped<DocxDocumentParser>();

            // Register authentication services
            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IAuthenticationService, AuthenticationService>();

            // Configure JWT authentication
            var jwtSettings = configuration.GetSection("JwtSettings");
            services.Configure<JwtSettings>(jwtSettings);

            var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("JWT secret key not found. Please set the JWT_SECRET_KEY environment variable.");
            }

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            // Register file storage service
            var fileStoragePath = Environment.GetEnvironmentVariable("FILE_STORAGE_PATH") ??
                Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "FileStorage");
            
            var fileEncryptionKey = Environment.GetEnvironmentVariable("FILE_ENCRYPTION_KEY");
            if (string.IsNullOrEmpty(fileEncryptionKey))
            {
                // Generate a random encryption key if not provided
                using (var aes = Aes.Create())
                {
                    aes.GenerateKey();
                    fileEncryptionKey = Convert.ToBase64String(aes.Key);
                    // Log a warning using the logger from DI
                    var logger = services.BuildServiceProvider().GetService<ILogger<SecureFileService>>();
                    logger?.LogWarning("FILE_ENCRYPTION_KEY not found in environment variables. Generated a random key. This key will not persist across application restarts.");
                }
            }
            
            services.AddSingleton<IFileService>(provider =>
                new SecureFileService(
                    provider.GetRequiredService<ILogger<SecureFileService>>(),
                    fileStoragePath,
                    fileEncryptionKey
                )
            );

            return services;
        }
    }
}
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using ComplianceClassifier.Domain.Interfaces;
using ComplianceClassifier.Application.Documents.DTOs;
using ComplianceClassifier.Application.Classifications.DTOs;
using ComplianceClassifier.Application.Reports.DTOs;
using ComplianceClassifier.Application.Documents.Services;
using ComplianceClassifier.Infrastructure.DocumentParsers;
using ComplianceClassifier.Infrastructure.DocumentParsers.Factory;
using ComplianceClassifier.Infrastructure.DocumentParsers.Implementations;

namespace ComplianceClassifier.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register repositories
            // These will be implemented later
            // services.AddScoped<IDocumentRepository, DocumentRepository>();
            // services.AddScoped<IClassificationRepository, ClassificationRepository>();
            // services.AddScoped<IBatchRepository, BatchRepository>();
            // services.AddScoped<IReportRepository, ReportRepository>();

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

            // Register other infrastructure services
            // These will be implemented later
            // services.AddScoped<IFileStorage, FileStorage>();

            return services;
        }
    }
}
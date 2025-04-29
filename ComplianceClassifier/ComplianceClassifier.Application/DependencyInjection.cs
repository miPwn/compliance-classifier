using Microsoft.Extensions.DependencyInjection;
using ComplianceClassifier.Application.Documents.Services;

namespace ComplianceClassifier.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register application services
            services.AddScoped<IBatchService, BatchService>();
            services.AddScoped<IDocumentService, DocumentService>();
            services.AddScoped<IDocumentParsingService, DocumentParsingService>();
            
            return services;
        }
    }
}
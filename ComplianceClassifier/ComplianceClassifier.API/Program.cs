using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using ComplianceClassifier.Infrastructure;
using ComplianceClassifier.Application;

namespace ComplianceClassifier.API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Add CORS services
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAngularApp", policy =>
            {
                policy.WithOrigins("http://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        // Add rate limiting
        builder.Services.AddRateLimiter(options =>
        {
            options.AddFixedWindowLimiter("fixed", options =>
            {
                options.PermitLimit = 100;
                options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                options.QueueLimit = 0;
                options.Window = TimeSpan.FromMinutes(1);
                options.AutoReplenishment = true;
            });

            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });

        // Register infrastructure services
        builder.Services.AddInfrastructureServices(builder.Configuration);

        // Register application services
        builder.Services.AddApplicationServices();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Enable HTTPS redirection
        app.UseHttpsRedirection();

        // Use CORS middleware
        app.UseCors("AllowAngularApp");

        // Use rate limiting
        app.UseRateLimiter();

        // Enable authentication and authorization
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}


using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using ComplianceClassifier.Infrastructure;
using ComplianceClassifier.Application;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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
    // Swagger removed due to compatibility issues with .NET 7.0
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

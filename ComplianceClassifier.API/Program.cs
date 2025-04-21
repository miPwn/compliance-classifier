using ComplianceClassifier.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Register infrastructure services
builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Swagger removed due to compatibility issues with .NET 7.0
}

// Comment out HTTPS redirection to avoid the warning
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

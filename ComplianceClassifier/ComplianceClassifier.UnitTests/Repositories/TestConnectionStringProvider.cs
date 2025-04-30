using ComplianceClassifier.Infrastructure.Persistence;

namespace ComplianceClassifier.UnitTests.Repositories;

public class TestConnectionStringProvider : IConnectionStringProvider
{
    public string GetConnectionString()
    {
        return "Data Source=:memory:";
    }
}
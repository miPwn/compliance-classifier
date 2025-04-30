namespace ComplianceClassifier.Domain.ValueObjects;

/// <summary>
/// Value object representing configuration for an AI model
/// </summary>
public class AIModelConfig
{
    public string ModelName { get; private set; }
    public decimal Temperature { get; private set; }
    public int MaxTokens { get; private set; }
    public string PromptTemplate { get; private set; }

    public AIModelConfig(
        string modelName,
        decimal temperature,
        int maxTokens,
        string promptTemplate)
    {
        ModelName = modelName;
        Temperature = temperature;
        MaxTokens = maxTokens;
        PromptTemplate = promptTemplate;
    }

    // Value objects should be immutable, so we provide a method to create a new instance with modified values
    public AIModelConfig WithModelName(string modelName)
    {
        return new AIModelConfig(modelName, Temperature, MaxTokens, PromptTemplate);
    }

    public AIModelConfig WithTemperature(decimal temperature)
    {
        return new AIModelConfig(ModelName, temperature, MaxTokens, PromptTemplate);
    }

    public AIModelConfig WithMaxTokens(int maxTokens)
    {
        return new AIModelConfig(ModelName, Temperature, maxTokens, PromptTemplate);
    }

    public AIModelConfig WithPromptTemplate(string promptTemplate)
    {
        return new AIModelConfig(ModelName, Temperature, MaxTokens, promptTemplate);
    }
}
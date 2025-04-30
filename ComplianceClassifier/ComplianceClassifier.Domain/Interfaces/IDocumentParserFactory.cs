using ComplianceClassifier.Domain.Enums;

namespace ComplianceClassifier.Domain.Interfaces;

/// <summary>
/// Interface for document parser factory
/// </summary>
public interface IDocumentParserFactory
{
    /// <summary>
    /// Creates a document parser based on file type
    /// </summary>
    /// <param name="fileType">Type of file</param>
    /// <returns>Document parser</returns>
    IDocumentParser CreateParser(FileType fileType);
}
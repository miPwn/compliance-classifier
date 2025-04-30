namespace ComplianceClassifier.Domain.ValueObjects;

/// <summary>
/// Value object representing metadata of a document
/// </summary>
public class DocumentMetadata
{
    public int PageCount { get; private set; }
    public string Author { get; private set; }
    public DateTime CreationDate { get; private set; }
    public DateTime ModificationDate { get; private set; }
    public List<string> Keywords { get; private set; }

    public DocumentMetadata(
        int pageCount,
        string author,
        DateTime creationDate,
        DateTime modificationDate,
        List<string> keywords)
    {
        PageCount = pageCount;
        Author = author;
        CreationDate = creationDate;
        ModificationDate = modificationDate;
        Keywords = keywords ?? new List<string>();
    }

    // Value objects should be immutable, so we provide a method to create a new instance with modified values
    public DocumentMetadata WithPageCount(int pageCount)
    {
        return new DocumentMetadata(pageCount, Author, CreationDate, ModificationDate, Keywords);
    }

    public DocumentMetadata WithAuthor(string author)
    {
        return new DocumentMetadata(PageCount, author, CreationDate, ModificationDate, Keywords);
    }

    public DocumentMetadata WithCreationDate(DateTime creationDate)
    {
        return new DocumentMetadata(PageCount, Author, creationDate, ModificationDate, Keywords);
    }

    public DocumentMetadata WithModificationDate(DateTime modificationDate)
    {
        return new DocumentMetadata(PageCount, Author, CreationDate, modificationDate, Keywords);
    }

    public DocumentMetadata WithKeywords(List<string> keywords)
    {
        return new DocumentMetadata(PageCount, Author, CreationDate, ModificationDate, keywords);
    }
}
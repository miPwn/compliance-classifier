using Microsoft.EntityFrameworkCore;
using ComplianceClassifier.Domain.Aggregates;
using ComplianceClassifier.Infrastructure.Persistence.Entities;

namespace ComplianceClassifier.Infrastructure.Persistence;

/// <summary>
/// The main database context for the application
/// </summary>
public class ApplicationDbContext : DbContext
{
    private readonly IConnectionStringProvider _connectionStringProvider;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IConnectionStringProvider connectionStringProvider) : base(options)
    {
        _connectionStringProvider = connectionStringProvider ?? 
                                    throw new ArgumentNullException(nameof(connectionStringProvider));
    }

    // Define DbSets for your entities here
    public DbSet<Document> Documents { get; set; }
    public DbSet<Classification> Classifications { get; set; }
    public DbSet<Batch> Batches { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserPassword> UserPasswords { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql(_connectionStringProvider.GetConnectionString());
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure entity relationships, indexes, etc. here
        modelBuilder
            .Entity<Document>()
            .HasOne<Batch>()
            .WithMany()
            .HasForeignKey(d => d.BatchId);

        modelBuilder
            .Entity<Classification>()
            .HasOne<Document>()
            .WithOne()
            .HasForeignKey<Classification>(c => c.DocumentId);

        // Configure User and UserPassword entities
        modelBuilder
            .Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder
            .Entity<User>()
            .Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(50);

        modelBuilder
            .Entity<User>()
            .Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(100);

        modelBuilder
            .Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder
            .Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder
            .Entity<UserPassword>()
            .HasKey(p => p.UserId);

        modelBuilder
            .Entity<UserPassword>()
            .Property(p => p.PasswordHash)
            .IsRequired();

        modelBuilder
            .Entity<UserPassword>()
            .HasOne<User>()
            .WithOne()
            .HasForeignKey<UserPassword>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Value Objects
        modelBuilder.Entity<Document>()
            .OwnsOne(d => d.Metadata, md =>
            {
                md.Property(m => m.PageCount).HasColumnName("Metadata_PageCount");
                md.Property(m => m.Author).HasColumnName("Metadata_Author");
                md.Property(m => m.CreationDate).HasColumnName("Metadata_CreationDate");
                md.Property(m => m.ModificationDate).HasColumnName("Metadata_ModificationDate");
                md.Property(m => m.Keywords)
                    .HasColumnName("Metadata_Keywords")
                    .HasConversion(
                        v => string.Join(',', v!),
                        v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                    );
            });

        modelBuilder
            .Entity<User>()
            .ComplexProperty(u => u.RefreshTokens);
    }
}
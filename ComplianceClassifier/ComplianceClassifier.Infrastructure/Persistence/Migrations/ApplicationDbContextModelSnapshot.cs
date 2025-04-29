using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace ComplianceClassifier.Infrastructure.Persistence.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ComplianceClassifier.Domain.Aggregates.Batch.Batch", b =>
                {
                    b.Property<Guid>("BatchId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime?>("CompletionDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("ProcessedDocuments")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<int>("TotalDocuments")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UploadDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("BatchId");

                    b.ToTable("Batches");
                });

            modelBuilder.Entity("ComplianceClassifier.Domain.Aggregates.Classification.Classification", b =>
                {
                    b.Property<Guid>("ClassificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Category")
                        .HasColumnType("integer");

                    b.Property<string>("ClassifiedBy")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("ClassificationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<decimal>("ConfidenceScore")
                        .HasColumnType("numeric");

                    b.Property<Guid>("DocumentId")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsOverridden")
                        .HasColumnType("boolean");

                    b.Property<int>("RiskLevel")
                        .HasColumnType("integer");

                    b.Property<string>("Summary")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ClassificationId");

                    b.HasIndex("DocumentId")
                        .IsUnique();

                    b.ToTable("Classifications");
                });

            modelBuilder.Entity("ComplianceClassifier.Domain.Aggregates.Document.Document", b =>
                {
                    b.Property<Guid>("DocumentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("BatchId")
                        .HasColumnType("uuid");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("FileSize")
                        .HasColumnType("bigint");

                    b.Property<int>("FileType")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UploadDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("DocumentId");

                    b.HasIndex("BatchId");

                    b.ToTable("Documents");
                });

            modelBuilder.Entity("ComplianceClassifier.Domain.Aggregates.Report.Report", b =>
                {
                    b.Property<Guid>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("BatchId")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("DocumentId")
                        .HasColumnType("uuid");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("GenerationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("ReportType")
                        .HasColumnType("integer");

                    b.HasKey("ReportId");

                    b.HasIndex("BatchId");

                    b.HasIndex("DocumentId");

                    b.ToTable("Reports");
                });

            modelBuilder.Entity("ComplianceClassifier.Domain.Aggregates.Classification.Classification", b =>
                {
                    b.HasOne("ComplianceClassifier.Domain.Aggregates.Document.Document", null)
                        .WithOne()
                        .HasForeignKey("ComplianceClassifier.Domain.Aggregates.Classification.Classification", "DocumentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ComplianceClassifier.Domain.Aggregates.Document.Document", b =>
                {
                    b.HasOne("ComplianceClassifier.Domain.Aggregates.Batch.Batch", null)
                        .WithMany()
                        .HasForeignKey("BatchId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsOne("ComplianceClassifier.Domain.ValueObjects.DocumentMetadata", "Metadata", b1 =>
                        {
                            b1.Property<Guid>("DocumentId")
                                .HasColumnType("uuid");

                            b1.Property<string>("Author")
                                .HasColumnType("text");

                            b1.Property<DateTime>("CreationDate")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<string[]>("Keywords")
                                .HasColumnType("text[]");

                            b1.Property<DateTime>("ModificationDate")
                                .HasColumnType("timestamp with time zone");

                            b1.Property<int>("PageCount")
                                .HasColumnType("integer");

                            b1.HasKey("DocumentId");

                            b1.ToTable("Documents");

                            b1.WithOwner()
                                .HasForeignKey("DocumentId");
                        });

                    b.Navigation("Metadata");
                });

            modelBuilder.Entity("ComplianceClassifier.Domain.Aggregates.Report.Report", b =>
                {
                    b.HasOne("ComplianceClassifier.Domain.Aggregates.Batch.Batch", null)
                        .WithMany()
                        .HasForeignKey("BatchId");

                    b.HasOne("ComplianceClassifier.Domain.Aggregates.Document.Document", null)
                        .WithMany()
                        .HasForeignKey("DocumentId");
                });
#pragma warning restore 612, 618
        }
    }
}
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Npgsql;
using NpgsqlTypes;

namespace ComplianceClassifier.Scripts
{
    /// <summary>
    /// Test script to verify PostgreSQL database connection and table creation
    /// </summary>
    public class TestDatabaseConnection
    {
        // PostgreSQL connection details
        private const string Host = "192.168.1.106";
        private const int Port = 5432;
        private const string Database = "comp-filer";
        private const string Username = "vault66admin";
        private const string Password = "sQ63370";

        private readonly string _connectionString;

        public TestDatabaseConnection()
        {
            _connectionString = $"Host={Host};Port={Port};Database={Database};Username={Username};Password={Password}";
        }

        public static async Task Main(string[] args)
        {
            try
            {
                var tester = new TestDatabaseConnection();
                
                Console.WriteLine("Starting database connection test...");
                
                // Test database connection
                await tester.TestConnection();
                
                // Verify tables exist
                await tester.VerifyTables();
                
                // Create a test batch
                Guid batchId = await tester.CreateTestBatch();
                
                // Verify the batch was created
                await tester.VerifyBatchCreation(batchId);
                
                Console.WriteLine("All tests completed successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }

        /// <summary>
        /// Tests the connection to the PostgreSQL database
        /// </summary>
        public async Task TestConnection()
        {
            Console.WriteLine("Testing database connection...");
            
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();
            
            Console.WriteLine($"Successfully connected to PostgreSQL database: {Database}");
            Console.WriteLine($"Server Version: {connection.PostgreSqlVersion}");
            
            await connection.CloseAsync();
        }

        /// <summary>
        /// Verifies that all required tables exist in the database
        /// </summary>
        public async Task VerifyTables()
        {
            Console.WriteLine("Verifying tables exist...");
            
            var requiredTables = new List<string>
            {
                "Users",
                "UserPasswords",
                "RefreshTokens",
                "Batches",
                "Documents",
                "DocumentMetadata",
                "Classifications",
                "Reports"
            };
            
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();
            
            foreach (var tableName in requiredTables)
            {
                using var command = new NpgsqlCommand(
                    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = @tableName)", 
                    connection);
                
                command.Parameters.AddWithValue("tableName", tableName.ToLower());
                
                bool exists = (bool)await command.ExecuteScalarAsync();
                
                if (exists)
                {
                    Console.WriteLine($"Table '{tableName}' exists.");
                }
                else
                {
                    throw new Exception($"Table '{tableName}' does not exist!");
                }
            }
            
            await connection.CloseAsync();
            Console.WriteLine("All required tables exist.");
        }

        /// <summary>
        /// Creates a test batch in the database
        /// </summary>
        /// <returns>The ID of the created batch</returns>
        public async Task<Guid> CreateTestBatch()
        {
            Console.WriteLine("Creating test batch...");
            
            Guid batchId = Guid.NewGuid();
            string userId = "test-user";
            
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new NpgsqlCommand(
                @"INSERT INTO ""Batches"" (""BatchId"", ""UploadDate"", ""UserId"", ""Status"", ""TotalDocuments"", ""ProcessedDocuments"")
                VALUES (@batchId, @uploadDate, @userId, @status, @totalDocuments, @processedDocuments)",
                connection);
            
            command.Parameters.AddWithValue("batchId", batchId);
            command.Parameters.AddWithValue("uploadDate", DateTime.UtcNow);
            command.Parameters.AddWithValue("userId", userId);
            command.Parameters.AddWithValue("status", NpgsqlDbType.Text, "Pending");
            command.Parameters.AddWithValue("totalDocuments", 0);
            command.Parameters.AddWithValue("processedDocuments", 0);
            
            int rowsAffected = await command.ExecuteNonQueryAsync();
            
            if (rowsAffected > 0)
            {
                Console.WriteLine($"Test batch created successfully with ID: {batchId}");
            }
            else
            {
                throw new Exception("Failed to create test batch!");
            }
            
            await connection.CloseAsync();
            return batchId;
        }

        /// <summary>
        /// Verifies that a batch with the specified ID exists in the database
        /// </summary>
        /// <param name="batchId">The ID of the batch to verify</param>
        public async Task VerifyBatchCreation(Guid batchId)
        {
            Console.WriteLine($"Verifying batch creation for ID: {batchId}...");
            
            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();
            
            using var command = new NpgsqlCommand(
                @"SELECT ""BatchId"", ""UserId"", ""Status"" FROM ""Batches"" WHERE ""BatchId"" = @batchId",
                connection);
            
            command.Parameters.AddWithValue("batchId", batchId);
            
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                Guid retrievedBatchId = reader.GetGuid(0);
                string userId = reader.GetString(1);
                string status = reader.GetString(2);
                
                Console.WriteLine($"Batch found: ID={retrievedBatchId}, UserId={userId}, Status={status}");
                
                if (retrievedBatchId != batchId)
                {
                    throw new Exception($"Retrieved batch ID {retrievedBatchId} does not match expected ID {batchId}!");
                }
            }
            else
            {
                throw new Exception($"Batch with ID {batchId} not found!");
            }
            
            await connection.CloseAsync();
            Console.WriteLine("Batch verification successful.");
        }
    }
}
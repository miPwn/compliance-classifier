using System.ComponentModel.DataAnnotations;

namespace ComplianceClassifier.Application.Authentication.DTOs;

/// <summary>
/// DTO for registration request
/// </summary>
public class RegistrationRequestDto
{
    /// <summary>
    /// Gets or sets the username
    /// </summary>
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; }

    /// <summary>
    /// Gets or sets the password
    /// </summary>
    [Required]
    [StringLength(100, MinimumLength = 8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$", 
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character")]
    public string Password { get; set; }

    /// <summary>
    /// Gets or sets the email
    /// </summary>
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    /// <summary>
    /// Gets or sets the first name
    /// </summary>
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    /// <summary>
    /// Gets or sets the last name
    /// </summary>
    [Required]
    [StringLength(50)]
    public string LastName { get; set; }
}
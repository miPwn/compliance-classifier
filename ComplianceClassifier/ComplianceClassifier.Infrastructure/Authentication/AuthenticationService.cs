using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ComplianceClassifier.Application.Authentication.DTOs;
using ComplianceClassifier.Application.Authentication.Interfaces;
using ComplianceClassifier.Application.Authentication.Models;
using ComplianceClassifier.Domain.Aggregates;
using ComplianceClassifier.Domain.Interfaces;

namespace ComplianceClassifier.Infrastructure.Authentication
{
    /// <summary>
    /// Implementation of the authentication service
    /// </summary>
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly JwtSettings _jwtSettings;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthenticationService"/> class
        /// </summary>
        public AuthenticationService(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher,
            IOptions<JwtSettings> jwtSettings)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
            _jwtSettings = jwtSettings?.Value ?? throw new ArgumentNullException(nameof(jwtSettings));
        }

        /// <inheritdoc/>
        public async Task<AuthenticationResultDto> AuthenticateAsync(AuthenticationRequestDto request)
        {
            // Validate request
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return new AuthenticationResultDto
                {
                    Success = false,
                    ErrorMessage = "Username and password are required"
                };
            }

            // Get user by username
            var user = await _userRepository.GetByUsernameAsync(request.Username);
            if (user == null)
            {
                return new AuthenticationResultDto
                {
                    Success = false,
                    ErrorMessage = "Invalid username or password"
                };
            }

            // Verify password
            var passwordVerificationResult = await _passwordHasher.VerifyPasswordAsync(request.Password, user.Id);
            if (!passwordVerificationResult)
            {
                return new AuthenticationResultDto
                {
                    Success = false,
                    ErrorMessage = "Invalid username or password"
                };
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            // Add refresh token to user
            user.AddRefreshToken(refreshToken, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays));
            await _userRepository.UpdateAsync(user);

            // Return authentication result
            return new AuthenticationResultDto
            {
                UserId = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
                Roles = user.Roles,
                Success = true
            };
        }

        /// <inheritdoc/>
        public async Task<RegistrationResultDto> RegisterAsync(RegistrationRequestDto request)
        {
            // Validate request
            if (request == null)
            {
                return new RegistrationResultDto
                {
                    Success = false,
                    ErrorMessage = "Registration request is required"
                };
            }

            // Check if username already exists
            var existingUserByUsername = await _userRepository.GetByUsernameAsync(request.Username);
            if (existingUserByUsername != null)
            {
                return new RegistrationResultDto
                {
                    Success = false,
                    ErrorMessage = "Username already exists",
                    ValidationErrors = new Dictionary<string, List<string>>
                    {
                        { "Username", new List<string> { "Username already exists" } }
                    }
                };
            }

            // Check if email already exists
            var existingUserByEmail = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUserByEmail != null)
            {
                return new RegistrationResultDto
                {
                    Success = false,
                    ErrorMessage = "Email already exists",
                    ValidationErrors = new Dictionary<string, List<string>>
                    {
                        { "Email", new List<string> { "Email already exists" } }
                    }
                };
            }

            // Create user
            var userId = Guid.NewGuid();
            var user = new User(
                userId,
                request.Username,
                request.Email,
                request.FirstName,
                request.LastName,
                new List<string> { "User" }
            );

            // Hash password
            await _passwordHasher.HashPasswordAsync(request.Password, userId);

            // Save user
            await _userRepository.CreateAsync(user);

            // Generate JWT token
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            // Add refresh token to user
            user.AddRefreshToken(refreshToken, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays));
            await _userRepository.UpdateAsync(user);

            // Return registration result
            return new RegistrationResultDto
            {
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                Success = true,
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes)
            };
        }

        /// <inheritdoc/>
        public async Task<bool> ValidateTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return false;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc/>
        public async Task<AuthenticationResultDto> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.RefreshToken))
            {
                return new AuthenticationResultDto
                {
                    Success = false,
                    ErrorMessage = "Refresh token is required"
                };
            }

            // Get user by ID
            var user = await _userRepository.GetByIdAsync(request.UserId);
            if (user == null)
            {
                return new AuthenticationResultDto
                {
                    Success = false,
                    ErrorMessage = "Invalid user ID"
                };
            }

            // Get refresh token
            var refreshToken = user.GetActiveRefreshToken(request.RefreshToken);
            if (refreshToken == null)
            {
                return new AuthenticationResultDto
                {
                    Success = false,
                    ErrorMessage = "Invalid or expired refresh token"
                };
            }

            // Revoke current refresh token
            user.RevokeRefreshToken(request.RefreshToken);

            // Generate new tokens
            var token = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // Add new refresh token to user
            user.AddRefreshToken(newRefreshToken, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays));
            await _userRepository.UpdateAsync(user);

            // Return authentication result
            return new AuthenticationResultDto
            {
                UserId = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Token = token,
                RefreshToken = newRefreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
                Roles = user.Roles,
                Success = true
            };
        }

        /// <inheritdoc/>
        public async Task<bool> RevokeRefreshTokenAsync(Guid userId, string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return false;
            }

            // Get user by ID
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Revoke refresh token
            var result = user.RevokeRefreshToken(refreshToken);
            if (result)
            {
                await _userRepository.UpdateAsync(user);
            }

            return result;
        }

        /// <summary>
        /// Generates a JWT token for the specified user
        /// </summary>
        /// <param name="user">User</param>
        /// <returns>JWT token</returns>
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("name", user.Username),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName)
            };

            // Add roles as claims
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Generates a random refresh token
        /// </summary>
        /// <returns>Refresh token</returns>
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}
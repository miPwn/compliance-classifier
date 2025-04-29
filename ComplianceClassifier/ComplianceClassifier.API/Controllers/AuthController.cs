using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ComplianceClassifier.Application.Authentication.DTOs;
using ComplianceClassifier.Application.Authentication.Interfaces;

namespace ComplianceClassifier.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthenticationService authService,
            ILogger<AuthController> logger)
        {
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Authenticates a user
        /// </summary>
        /// <param name="request">Authentication request</param>
        /// <returns>Authentication result</returns>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AuthenticationResultDto>> Login([FromBody] AuthenticationRequestDto request)
        {
            try
            {
                var result = await _authService.AuthenticateAsync(request);
                if (!result.Success)
                {
                    return Unauthorized(new { message = result.ErrorMessage });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error authenticating user");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while authenticating" });
            }
        }

        /// <summary>
        /// Registers a new user
        /// </summary>
        /// <param name="request">Registration request</param>
        /// <returns>Registration result</returns>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RegistrationResultDto>> Register([FromBody] RegistrationRequestDto request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                if (!result.Success)
                {
                    return BadRequest(new 
                    { 
                        message = result.ErrorMessage,
                        errors = result.ValidationErrors
                    });
                }

                return Created($"/api/users/{result.UserId}", result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while registering" });
            }
        }

        /// <summary>
        /// Refreshes an authentication token
        /// </summary>
        /// <param name="request">Refresh token request</param>
        /// <returns>Authentication result</returns>
        [HttpPost("refresh-token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AuthenticationResultDto>> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request);
                if (!result.Success)
                {
                    return Unauthorized(new { message = result.ErrorMessage });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while refreshing token" });
            }
        }

        /// <summary>
        /// Revokes a refresh token
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="token">Refresh token</param>
        /// <returns>Success or failure</returns>
        [HttpPost("revoke-token")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> RevokeToken([FromQuery] Guid userId, [FromQuery] string token)
        {
            try
            {
                var result = await _authService.RevokeRefreshTokenAsync(userId, token);
                if (!result)
                {
                    return BadRequest(new { message = "Invalid token" });
                }

                return Ok(new { message = "Token revoked" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking token");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while revoking token" });
            }
        }
    }
}
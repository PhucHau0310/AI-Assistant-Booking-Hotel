using Microsoft.AspNetCore.Mvc;
using be.DTOs;
using be.Services;

namespace be.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponseDTO>>> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<LoginResponseDTO>.ErrorResponse($"Error during login: {ex.Message}"));
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<UserResponseDTO>>> Register([FromBody] RegisterRequestDTO request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserResponseDTO>.ErrorResponse($"Error during registration: {ex.Message}"));
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using be.DTOs;
using be.Services;
using be.Models;
using be.Constants;

namespace be.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserResponseDTO>>>> GetAllUsers()
        {
            try
            {
            var result = await _userService.GetAllUsersAsync();
            return Ok(result);
            }
            catch (Exception ex)
            {
            return StatusCode(500, ApiResponse<IEnumerable<UserResponseDTO>>.ErrorResponse($"Error retrieving users: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserResponseDTO>>> GetUserById(Guid id)
        {
            try
            {
                var result = await _userService.GetUserByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserResponseDTO>.ErrorResponse($"Error retrieving user: {ex.Message}"));
            }
        }

        [HttpGet("search")]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserResponseDTO>>>> SearchUsers([FromQuery] string? keyword)
        {
            try
            {
                var result = await _userService.SearchUsersAsync(keyword);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<UserResponseDTO>>.ErrorResponse($"Error searching users: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserResponseDTO>>> UpdateUser(Guid id, [FromBody] UpdateUserRequestDTO request)
        {
            try
            {
                var result = await _userService.UpdateUserAsync(id, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<UserResponseDTO>.ErrorResponse($"Error updating user: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(Guid id)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Error deleting user: {ex.Message}"));
            }
        }

        [HttpPost("{id}/avatar")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> UploadUserAvatar(Guid id, IFormFile file)
        {
            try
            {
                var result = await _userService.UploadUserAvatarAsync(id, file);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse($"Error uploading avatar: {ex.Message}"));
            }
        }
    }
}

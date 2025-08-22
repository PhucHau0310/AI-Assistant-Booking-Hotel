using be.DTOs;

namespace be.Services
{
    public interface IUserService
    {
        Task<ApiResponse<IEnumerable<UserResponseDTO>>> GetAllUsersAsync();
        Task<ApiResponse<UserResponseDTO>> GetUserByIdAsync(Guid id);
        Task<ApiResponse<UserResponseDTO>> UpdateUserAsync(Guid id, UpdateUserRequestDTO request);
        Task<ApiResponse<bool>> DeleteUserAsync(Guid id);
        Task<ApiResponse<IEnumerable<UserResponseDTO>>> SearchUsersAsync(string? keyword);
        Task<ApiResponse<string>> UploadUserAvatarAsync(Guid id, IFormFile file);
    }
}

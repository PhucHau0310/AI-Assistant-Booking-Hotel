using be.DTOs;
using be.Models;

namespace be.Services
{
    public interface IAuthService
    {
        Task<ApiResponse<LoginResponseDTO>> LoginAsync(LoginRequestDTO request);
        Task<ApiResponse<UserResponseDTO>> RegisterAsync(RegisterRequestDTO request);
        Task<ApiResponse<UserResponseDTO>> GetCurrentUserAsync(Guid userId);
    }
}

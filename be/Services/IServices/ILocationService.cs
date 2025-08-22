using be.DTOs;

namespace be.Services
{
    public interface ILocationService
    {
        Task<ApiResponse<IEnumerable<LocationResponseDTO>>> GetAllLocationsAsync();
        Task<ApiResponse<LocationResponseDTO>> GetLocationByIdAsync(Guid id);
        Task<ApiResponse<LocationResponseDTO>> CreateLocationAsync(CreateLocationRequestDTO request);
        Task<ApiResponse<LocationResponseDTO>> UpdateLocationAsync(Guid id, UpdateLocationRequestDTO request);
        Task<ApiResponse<bool>> DeleteLocationAsync(Guid id);
        Task<ApiResponse<IEnumerable<LocationResponseDTO>>> SearchLocationsAsync(string? keyword);
        Task<ApiResponse<string>> UploadLocationImageAsync(Guid id, IFormFile file);
    }
}

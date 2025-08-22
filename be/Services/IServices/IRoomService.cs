using be.DTOs;

namespace be.Services
{
    public interface IRoomService
    {
        Task<ApiResponse<IEnumerable<RoomResponseDTO>>> GetAllRoomsAsync();
        Task<ApiResponse<RoomResponseDTO>> GetRoomByIdAsync(Guid id);
        Task<ApiResponse<RoomResponseDTO>> CreateRoomAsync(CreateRoomRequestDTO request);
        Task<ApiResponse<RoomResponseDTO>> UpdateRoomAsync(Guid id, UpdateRoomRequestDTO request);
        Task<ApiResponse<bool>> DeleteRoomAsync(Guid id);
        Task<ApiResponse<IEnumerable<RoomResponseDTO>>> GetRoomsByLocationAsync(Guid locationId);
        Task<ApiResponse<IEnumerable<RoomResponseDTO>>> SearchRoomsAsync(string? keyword, Guid? locationId, decimal? minPrice, decimal? maxPrice);
        Task<ApiResponse<PagedResult<RoomResponseDTO>>> GetPaginatedRoomsAsync(int page, int pageSize);
        Task<ApiResponse<string>> UploadRoomImageAsync(Guid id, IFormFile file);
    }
}

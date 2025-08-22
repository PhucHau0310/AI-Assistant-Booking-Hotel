using be.DTOs;

namespace be.Services
{
    public interface IBookingService
    {
        Task<ApiResponse<IEnumerable<BookingResponseDTO>>> GetAllBookingsAsync();
        Task<ApiResponse<BookingResponseDTO>> GetBookingByIdAsync(Guid id);
        Task<ApiResponse<IEnumerable<BookingResponseDTO>>> GetBookingsByUserIdAsync(Guid userId);
        Task<ApiResponse<IEnumerable<BookingResponseDTO>>> GetBookingsByRoomIdAsync(Guid roomId);
        Task<ApiResponse<BookingResponseDTO>> CreateBookingAsync(CreateBookingRequestDTO request);
        Task<ApiResponse<BookingResponseDTO>> UpdateBookingAsync(Guid id, UpdateBookingRequestDTO request);
        Task<ApiResponse<bool>> DeleteBookingAsync(Guid id);
        Task<ApiResponse<bool>> CheckRoomAvailabilityAsync(Guid roomId, DateTime checkIn, DateTime checkOut, Guid? excludeBookingId = null);
    }
}

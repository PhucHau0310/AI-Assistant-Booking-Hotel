using be.DTOs;
using be.Models;
using be.Repositories;

namespace be.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IUserRepository _userRepository;

        public BookingService(IBookingRepository bookingRepository, IRoomRepository roomRepository, IUserRepository userRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<IEnumerable<BookingResponseDTO>>> GetAllBookingsAsync()
        {
            try
            {
                var bookings = await _bookingRepository.GetAllAsync();
                var bookingDTOs = bookings.Select(MapToBookingResponseDTO);
                return ApiResponse<IEnumerable<BookingResponseDTO>>.SuccessResponse(bookingDTOs, "Bookings retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse($"Error retrieving bookings: {ex.Message}");
            }
        }

        public async Task<ApiResponse<BookingResponseDTO>> GetBookingByIdAsync(Guid id)
        {
            try
            {
                var booking = await _bookingRepository.GetByIdAsync(id);
                if (booking == null)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Booking not found", 404);
                }

                var bookingDTO = MapToBookingResponseDTO(booking);
                return ApiResponse<BookingResponseDTO>.SuccessResponse(bookingDTO, "Booking retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<BookingResponseDTO>.ErrorResponse($"Error retrieving booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<BookingResponseDTO>>> GetBookingsByUserIdAsync(Guid userId)
        {
            try
            {
                var bookings = await _bookingRepository.GetByUserIdAsync(userId);
                var bookingDTOs = bookings.Select(MapToBookingResponseDTO);
                return ApiResponse<IEnumerable<BookingResponseDTO>>.SuccessResponse(bookingDTOs, "User bookings retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse($"Error retrieving user bookings: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<BookingResponseDTO>>> GetBookingsByRoomIdAsync(Guid roomId)
        {
            try
            {
                var bookings = await _bookingRepository.GetByRoomIdAsync(roomId);
                var bookingDTOs = bookings.Select(MapToBookingResponseDTO);
                return ApiResponse<IEnumerable<BookingResponseDTO>>.SuccessResponse(bookingDTOs, "Room bookings retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse($"Error retrieving room bookings: {ex.Message}");
            }
        }

        public async Task<ApiResponse<BookingResponseDTO>> CreateBookingAsync(CreateBookingRequestDTO request)
        {
            try
            {
                // Validate dates
                if (request.CheckInDate >= request.CheckOutDate)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Check-out date must be after check-in date", 400);
                }

                if (request.CheckInDate < DateTime.UtcNow.Date)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Check-in date cannot be in the past", 400);
                }

                // Check if room exists
                var room = await _roomRepository.GetByIdAsync(request.RoomId);
                if (room == null)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Room not found", 404);
                }

                // Check if user exists
                var user = await _userRepository.GetByIdAsync(request.UserId);
                if (user == null)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("User not found", 404);
                }

                // Check room availability
                var isAvailable = await _bookingRepository.IsRoomAvailableAsync(request.RoomId, request.CheckInDate, request.CheckOutDate);
                if (!isAvailable)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Room is not available for the selected dates", 409);
                }

                // Create booking
                var booking = new Booking
                {
                    Id = Guid.NewGuid(),
                    RoomId = request.RoomId,
                    UserId = request.UserId,
                    CheckInDate = request.CheckInDate,
                    CheckOutDate = request.CheckOutDate,
                    GuestCount = request.GuestCount,
                    CreatedAt = DateTime.UtcNow.AddHours(7),
                    UpdatedAt = DateTime.UtcNow.AddHours(7)
                };

                var createdBooking = await _bookingRepository.AddAsync(booking);
                var bookingDTO = MapToBookingResponseDTO(createdBooking);
                return ApiResponse<BookingResponseDTO>.SuccessResponse(bookingDTO, "Booking created successfully", 201);
            }
            catch (Exception ex)
            {
                return ApiResponse<BookingResponseDTO>.ErrorResponse($"Error creating booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<BookingResponseDTO>> UpdateBookingAsync(Guid id, UpdateBookingRequestDTO request)
        {
            try
            {
                var booking = await _bookingRepository.GetByIdAsync(id);
                if (booking == null)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Booking not found", 404);
                }

                // Update fields if provided
                if (request.CheckInDate.HasValue)
                {
                    if (request.CheckInDate.Value < DateTime.UtcNow.Date)
                    {
                        return ApiResponse<BookingResponseDTO>.ErrorResponse("Check-in date cannot be in the past", 400);
                    }
                    booking.CheckInDate = request.CheckInDate.Value;
                }

                if (request.CheckOutDate.HasValue)
                {
                    booking.CheckOutDate = request.CheckOutDate.Value;
                }

                if (request.GuestCount.HasValue)
                {
                    booking.GuestCount = request.GuestCount.Value;
                }

                // Validate dates after update
                if (booking.CheckInDate >= booking.CheckOutDate)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Check-out date must be after check-in date", 400);
                }

                // Check room availability (excluding current booking)
                var isAvailable = await _bookingRepository.IsRoomAvailableAsync(booking.RoomId, booking.CheckInDate, booking.CheckOutDate, id);
                if (!isAvailable)
                {
                    return ApiResponse<BookingResponseDTO>.ErrorResponse("Room is not available for the selected dates", 409);
                }

                booking.UpdatedAt = DateTime.UtcNow.AddHours(7);
                var updatedBooking = await _bookingRepository.UpdateAsync(booking);
                var bookingDTO = MapToBookingResponseDTO(updatedBooking);
                return ApiResponse<BookingResponseDTO>.SuccessResponse(bookingDTO, "Booking updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<BookingResponseDTO>.ErrorResponse($"Error updating booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteBookingAsync(Guid id)
        {
            try
            {
                var booking = await _bookingRepository.GetByIdAsync(id);
                if (booking == null)
                {
                    return ApiResponse<bool>.ErrorResponse("Booking not found", 404);
                }

                await _bookingRepository.DeleteAsync(booking);
                return ApiResponse<bool>.SuccessResponse(true, "Booking deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse($"Error deleting booking: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> CheckRoomAvailabilityAsync(Guid roomId, DateTime checkIn, DateTime checkOut, Guid? excludeBookingId = null)
        {
            try
            {
                var isAvailable = await _bookingRepository.IsRoomAvailableAsync(roomId, checkIn, checkOut, excludeBookingId);
                return ApiResponse<bool>.SuccessResponse(isAvailable, isAvailable ? "Room is available" : "Room is not available");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse($"Error checking room availability: {ex.Message}");
            }
        }

        private static BookingResponseDTO MapToBookingResponseDTO(Booking booking)
        {
            var bookingDTO = new BookingResponseDTO
            {
                Id = booking.Id,
                RoomId = booking.RoomId,
                UserId = booking.UserId,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                GuestCount = booking.GuestCount,
                CreatedAt = booking.CreatedAt,
                UpdatedAt = booking.UpdatedAt
            };

            if (booking.Room != null)
            {
                bookingDTO.Room = new RoomResponseDTO
                {
                    Id = booking.Room.Id,
                    Name = booking.Room.Name,
                    BedRoom = booking.Room.BedRoom,
                    Bed = booking.Room.Bed,
                    BathRoom = booking.Room.BathRoom,
                    Description = booking.Room.Description,
                    Price = booking.Room.Price,
                    WashingMachine = booking.Room.WashingMachine,
                    Balcony = booking.Room.Balcony,
                    TV = booking.Room.TV,
                    AirConditioner = booking.Room.AirConditioner,
                    Wifi = booking.Room.Wifi,
                    Kitchen = booking.Room.Kitchen,
                    Parking = booking.Room.Parking,
                    SwimmingPool = booking.Room.SwimmingPool,
                    LocationId = booking.Room.LocationId,
                    Picture = booking.Room.Picture,
                    CreatedAt = booking.Room.CreatedAt,
                    UpdatedAt = booking.Room.UpdatedAt
                };

                if (booking.Room.Location != null)
                {
                    bookingDTO.Room.Location = new LocationResponseDTO
                    {
                        Id = booking.Room.Location.Id,
                        Name = booking.Room.Location.Name,
                        Province = booking.Room.Location.Province,
                        Country = booking.Room.Location.Country,
                        Image = booking.Room.Location.Image,
                        CreatedAt = booking.Room.Location.CreatedAt,
                        UpdatedAt = booking.Room.Location.UpdatedAt
                    };
                }
            }

            if (booking.User != null)
            {
                bookingDTO.User = new UserResponseDTO
                {
                    Id = booking.User.Id,
                    Name = booking.User.Name,
                    Email = booking.User.Email,
                    AvatarUrl = booking.User.AvatarUrl,
                    Phone = booking.User.Phone,
                    DateOfBirth = booking.User.DateOfBirth,
                    Gender = booking.User.Gender,
                    Role = booking.User.Role,
                    CreatedAt = booking.User.CreatedAt,
                    UpdatedAt = booking.User.UpdatedAt
                };
            }

            return bookingDTO;
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using be.DTOs;
using be.Services;
using be.Constants;
using System.Security.Claims;

namespace be.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<IEnumerable<BookingResponseDTO>>>> GetAllBookings()
        {
            try
            {
                var result = await _bookingService.GetAllBookingsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse($"Error retrieving bookings: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<BookingResponseDTO>>> GetBookingById(Guid id)
        {
            try
            {
                var result = await _bookingService.GetBookingByIdAsync(id);
                
                if (result.StatusCode != 200)
                {
                    return result.StatusCode == 404 ? NotFound(result) : BadRequest(result);
                }

                // Check if user is admin or owns the booking
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                
                if (userRole != UserRoles.ADMIN && 
                    Guid.TryParse(userIdClaim, out var userId) && 
                    result.Content?.UserId != userId)
                {
                    return Forbid();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<BookingResponseDTO>.ErrorResponse($"Error retrieving booking: {ex.Message}"));
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<IEnumerable<BookingResponseDTO>>>> GetBookingsByUserId(Guid userId)
        {
            try
            {
                // Check if user is admin or requesting their own bookings
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                
                if (userRole != UserRoles.ADMIN && 
                    (!Guid.TryParse(userIdClaim, out var currentUserId) || currentUserId != userId))
                {
                    return Forbid();
                }

                var result = await _bookingService.GetBookingsByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse($"Error retrieving user bookings: {ex.Message}"));
            }
        }

        [HttpGet("room/{roomId}")]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<IEnumerable<BookingResponseDTO>>>> GetBookingsByRoomId(Guid roomId)
        {
            try
            {
                var result = await _bookingService.GetBookingsByRoomIdAsync(roomId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse($"Error retrieving room bookings: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<BookingResponseDTO>>> CreateBooking([FromBody] CreateBookingRequestDTO request)
        {
            try
            {
                // Check if user is admin or creating booking for themselves
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                
                if (userRole != UserRoles.ADMIN && 
                    (!Guid.TryParse(userIdClaim, out var currentUserId) || currentUserId != request.UserId))
                {
                    return Forbid();
                }

                var result = await _bookingService.CreateBookingAsync(request);
                
                if (result.StatusCode != 201)
                {
                    return result.StatusCode switch
                    {
                        400 => BadRequest(result),
                        404 => NotFound(result),
                        409 => Conflict(result),
                        _ => BadRequest(result)
                    };
                }

                return CreatedAtAction(nameof(GetBookingById), new { id = result.Content?.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<BookingResponseDTO>.ErrorResponse($"Error creating booking: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<BookingResponseDTO>>> UpdateBooking(Guid id, [FromBody] UpdateBookingRequestDTO request)
        {
            try
            {
                // Get the booking first to check ownership
                var bookingResult = await _bookingService.GetBookingByIdAsync(id);
                if (bookingResult.StatusCode != 200)
                {
                    return bookingResult.StatusCode == 404 ? NotFound(bookingResult) : BadRequest(bookingResult);
                }

                // Check if user is admin or owns the booking
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                
                if (userRole != UserRoles.ADMIN && 
                    (!Guid.TryParse(userIdClaim, out var userId) || bookingResult.Content?.UserId != userId))
                {
                    return Forbid();
                }

                var result = await _bookingService.UpdateBookingAsync(id, request);
                
                if (result.StatusCode != 200)
                {
                    return result.StatusCode switch
                    {
                        400 => BadRequest(result),
                        404 => NotFound(result),
                        409 => Conflict(result),
                        _ => BadRequest(result)
                    };
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<BookingResponseDTO>.ErrorResponse($"Error updating booking: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteBooking(Guid id)
        {
            try
            {
                // Get the booking first to check ownership
                var bookingResult = await _bookingService.GetBookingByIdAsync(id);
                if (bookingResult.StatusCode != 200)
                {
                    return bookingResult.StatusCode == 404 ? 
                        NotFound(ApiResponse<bool>.ErrorResponse("Booking not found", 404)) : 
                        BadRequest(ApiResponse<bool>.ErrorResponse("Error retrieving booking"));
                }

                // Check if user is admin or owns the booking
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                
                if (userRole != UserRoles.ADMIN && 
                    (!Guid.TryParse(userIdClaim, out var userId) || bookingResult.Content?.UserId != userId))
                {
                    return Forbid();
                }

                var result = await _bookingService.DeleteBookingAsync(id);
                
                if (result.StatusCode != 200)
                {
                    return result.StatusCode == 404 ? NotFound(result) : BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Error deleting booking: {ex.Message}"));
            }
        }

        [HttpGet("availability")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> CheckRoomAvailability(
            [FromQuery] Guid roomId,
            [FromQuery] DateTime checkIn,
            [FromQuery] DateTime checkOut,
            [FromQuery] Guid? excludeBookingId = null)
        {
            try
            {
                var result = await _bookingService.CheckRoomAvailabilityAsync(roomId, checkIn, checkOut, excludeBookingId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Error checking room availability: {ex.Message}"));
            }
        }

        [HttpGet("my-bookings")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<IEnumerable<BookingResponseDTO>>>> GetMyBookings()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return BadRequest(ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse("Invalid user ID"));
                }

                var result = await _bookingService.GetBookingsByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<BookingResponseDTO>>.ErrorResponse($"Error retrieving user bookings: {ex.Message}"));
            }
        }
    }
}

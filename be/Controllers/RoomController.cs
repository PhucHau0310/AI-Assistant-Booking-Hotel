using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using be.DTOs;
using be.Services;

namespace be.Controllers
{
    [ApiController]
    [Route("api/rooms")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoomResponseDTO>>>> GetAllRooms()
        {
            try
            {
                var result = await _roomService.GetAllRoomsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<RoomResponseDTO>>.ErrorResponse($"Error retrieving rooms: {ex.Message}"));
            }
        }

        [HttpGet("paginated")]
        public async Task<ActionResult<ApiResponse<PagedResult<RoomResponseDTO>>>> GetPaginatedRooms([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _roomService.GetPaginatedRoomsAsync(page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<PagedResult<RoomResponseDTO>>.ErrorResponse($"Error retrieving rooms: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<RoomResponseDTO>>> GetRoomById(Guid id)
        {
            try
            {
                var result = await _roomService.GetRoomByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoomResponseDTO>.ErrorResponse($"Error retrieving room: {ex.Message}"));
            }
        }

        [HttpGet("location/{locationId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoomResponseDTO>>>> GetRoomsByLocation(Guid locationId)
        {
            try
            {
                var result = await _roomService.GetRoomsByLocationAsync(locationId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<RoomResponseDTO>>.ErrorResponse($"Error retrieving rooms: {ex.Message}"));
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<IEnumerable<RoomResponseDTO>>>> SearchRooms(
            [FromQuery] string? keyword, 
            [FromQuery] Guid? locationId, 
            [FromQuery] decimal? minPrice, 
            [FromQuery] decimal? maxPrice)
        {
            try
            {
                var result = await _roomService.SearchRoomsAsync(keyword, locationId, minPrice, maxPrice);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<RoomResponseDTO>>.ErrorResponse($"Error searching rooms: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<RoomResponseDTO>>> CreateRoom([FromBody] CreateRoomRequestDTO request)
        {
            try
            {
                var result = await _roomService.CreateRoomAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoomResponseDTO>.ErrorResponse($"Error creating room: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<RoomResponseDTO>>> UpdateRoom(Guid id, [FromBody] UpdateRoomRequestDTO request)
        {
            try
            {
                var result = await _roomService.UpdateRoomAsync(id, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<RoomResponseDTO>.ErrorResponse($"Error updating room: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteRoom(Guid id)
        {
            try
            {
                var result = await _roomService.DeleteRoomAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Error deleting room: {ex.Message}"));
            }
        }

        [HttpPost("{id}/image")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<string>>> UploadRoomImage(Guid id, IFormFile file)
        {
            try
            {
                var result = await _roomService.UploadRoomImageAsync(id, file);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse($"Error uploading image: {ex.Message}"));
            }
        }
    }
}

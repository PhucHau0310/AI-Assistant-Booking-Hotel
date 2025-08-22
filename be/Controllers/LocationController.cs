using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using be.DTOs;
using be.Services;
using be.Models;
using be.Constants;

namespace be.Controllers
{
    [ApiController]
    [Route("api/locations")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<LocationResponseDTO>>>> GetAllLocations()
        {
            try
            {
                var result = await _locationService.GetAllLocationsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<LocationResponseDTO>>.ErrorResponse($"Error retrieving locations: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<LocationResponseDTO>>> GetLocationById(Guid id)
        {
            try
            {
                var result = await _locationService.GetLocationByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<LocationResponseDTO>.ErrorResponse($"Error retrieving location: {ex.Message}"));
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<IEnumerable<LocationResponseDTO>>>> SearchLocations([FromQuery] string? keyword)
        {
            try
            {
                var result = await _locationService.SearchLocationsAsync(keyword);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<LocationResponseDTO>>.ErrorResponse($"Error searching locations: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<LocationResponseDTO>>> CreateLocation([FromBody] CreateLocationRequestDTO request)
        {
            try
            {
                var result = await _locationService.CreateLocationAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<LocationResponseDTO>.ErrorResponse($"Error creating location: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<LocationResponseDTO>>> UpdateLocation(Guid id, [FromBody] UpdateLocationRequestDTO request)
        {
            try
            {
                var result = await _locationService.UpdateLocationAsync(id, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<LocationResponseDTO>.ErrorResponse($"Error updating location: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteLocation(Guid id)
        {
            try
            {
                var result = await _locationService.DeleteLocationAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Error deleting location: {ex.Message}"));
            }
        }

        [HttpPost("{id}/image")]
        [Authorize(Roles = UserRoles.ADMIN)]
        public async Task<ActionResult<ApiResponse<string>>> UploadLocationImage(Guid id, IFormFile file)
        {
            try
            {
                var result = await _locationService.UploadLocationImageAsync(id, file);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse($"Error uploading image: {ex.Message}"));
            }
        }
    }
}

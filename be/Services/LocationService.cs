using be.DTOs;
using be.Models;
using be.Repositories;

namespace be.Services
{
    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _locationRepository;

        public LocationService(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public async Task<ApiResponse<IEnumerable<LocationResponseDTO>>> GetAllLocationsAsync()
        {
            try
            {
                var locations = await _locationRepository.GetAllAsync();
                var response = locations.Select(l => new LocationResponseDTO
                {
                    Id = l.Id,
                    Name = l.Name,
                    Province = l.Province,
                    Country = l.Country,
                    Image = l.Image,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt
                });

                return ApiResponse<IEnumerable<LocationResponseDTO>>.SuccessResponse(response, "Locations retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<LocationResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<LocationResponseDTO>> GetLocationByIdAsync(Guid id)
        {
            try
            {
                var location = await _locationRepository.GetByIdAsync(id);

                if (location == null)
                {
                    return ApiResponse<LocationResponseDTO>.ErrorResponse("Location not found", 404);
                }

                var response = new LocationResponseDTO
                {
                    Id = location.Id,
                    Name = location.Name,
                    Province = location.Province,
                    Country = location.Country,
                    Image = location.Image,
                    CreatedAt = location.CreatedAt,
                    UpdatedAt = location.UpdatedAt
                };

                return ApiResponse<LocationResponseDTO>.SuccessResponse(response, "Location retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<LocationResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<LocationResponseDTO>> CreateLocationAsync(CreateLocationRequestDTO request)
        {
            try
            {
                // Check if location name already exists
                if (await _locationRepository.NameExistsAsync(request.Name))
                {
                    return ApiResponse<LocationResponseDTO>.ErrorResponse("Location name already exists", 400);
                }

                var location = new Location
                {
                    Name = request.Name,
                    Province = request.Province,
                    Country = request.Country,
                    Image = request.Image,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var createdLocation = await _locationRepository.AddAsync(location);

                var response = new LocationResponseDTO
                {
                    Id = createdLocation.Id,
                    Name = createdLocation.Name,
                    Province = createdLocation.Province,
                    Country = createdLocation.Country,
                    Image = createdLocation.Image,
                    CreatedAt = createdLocation.CreatedAt,
                    UpdatedAt = createdLocation.UpdatedAt
                };

                return ApiResponse<LocationResponseDTO>.SuccessResponse(response, "Location created successfully", 201);
            }
            catch (Exception ex)
            {
                return ApiResponse<LocationResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<LocationResponseDTO>> UpdateLocationAsync(Guid id, UpdateLocationRequestDTO request)
        {
            try
            {
                var location = await _locationRepository.GetByIdAsync(id);

                if (location == null)
                {
                    return ApiResponse<LocationResponseDTO>.ErrorResponse("Location not found", 404);
                }

                // Check if new name already exists (excluding current location)
                if (await _locationRepository.NameExistsAsync(request.Name, id))
                {
                    return ApiResponse<LocationResponseDTO>.ErrorResponse("Location name already exists", 400);
                }

                location.Name = request.Name;
                location.Province = request.Province;
                location.Country = request.Country;
                location.UpdatedAt = DateTime.UtcNow;

                var updatedLocation = await _locationRepository.UpdateAsync(location);

                var response = new LocationResponseDTO
                {
                    Id = updatedLocation.Id,
                    Name = updatedLocation.Name,
                    Province = updatedLocation.Province,
                    Country = updatedLocation.Country,
                    Image = updatedLocation.Image,
                    CreatedAt = updatedLocation.CreatedAt,
                    UpdatedAt = updatedLocation.UpdatedAt
                };

                return ApiResponse<LocationResponseDTO>.SuccessResponse(response, "Location updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<LocationResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteLocationAsync(Guid id)
        {
            try
            {
                var deleted = await _locationRepository.DeleteAsync(id);

                if (!deleted)
                {
                    return ApiResponse<bool>.ErrorResponse("Location not found", 404);
                }

                return ApiResponse<bool>.SuccessResponse(true, "Location deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<LocationResponseDTO>>> SearchLocationsAsync(string? keyword)
        {
            try
            {
                var locations = await _locationRepository.SearchAsync(keyword);
                var response = locations.Select(l => new LocationResponseDTO
                {
                    Id = l.Id,
                    Name = l.Name,
                    Province = l.Province,
                    Country = l.Country,
                    Image = l.Image,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt
                });

                return ApiResponse<IEnumerable<LocationResponseDTO>>.SuccessResponse(response, "Locations search completed successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<LocationResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> UploadLocationImageAsync(Guid id, IFormFile file)
        {
            try
            {
                var location = await _locationRepository.GetByIdAsync(id);

                if (location == null)
                {
                    return ApiResponse<string>.ErrorResponse("Location not found", 404);
                }

                // Save file logic (simplified)
                var fileName = $"location_{id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine("wwwroot", "images", "locations", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/images/locations/{fileName}";
                location.Image = imageUrl;
                location.UpdatedAt = DateTime.UtcNow;

                await _locationRepository.UpdateAsync(location);

                return ApiResponse<string>.SuccessResponse(imageUrl, "Image uploaded successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }
    }
}

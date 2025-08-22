using be.DTOs;
using be.Models;
using be.Repositories;

namespace be.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepository;
        private readonly ILocationRepository _locationRepository;

        public RoomService(IRoomRepository roomRepository, ILocationRepository locationRepository)
        {
            _roomRepository = roomRepository;
            _locationRepository = locationRepository;
        }

        public async Task<ApiResponse<IEnumerable<RoomResponseDTO>>> GetAllRoomsAsync()
        {
            try
            {
                var rooms = await _roomRepository.GetAllAsync();
                var response = rooms.Select(MapToResponseDTO);

                return ApiResponse<IEnumerable<RoomResponseDTO>>.SuccessResponse(response, "Rooms retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<RoomResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<RoomResponseDTO>> GetRoomByIdAsync(Guid id)
        {
            try
            {
                var room = await _roomRepository.GetByIdAsync(id);

                if (room == null)
                {
                    return ApiResponse<RoomResponseDTO>.ErrorResponse("Room not found", 404);
                }

                var response = MapToResponseDTO(room);
                return ApiResponse<RoomResponseDTO>.SuccessResponse(response, "Room retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<RoomResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<RoomResponseDTO>> CreateRoomAsync(CreateRoomRequestDTO request)
        {
            try
            {
                // Verify location exists
                var locationExists = await _locationRepository.ExistsAsync(request.LocationId);
                if (!locationExists)
                {
                    return ApiResponse<RoomResponseDTO>.ErrorResponse("Location not found", 400);
                }

                var room = new Room
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    BedRoom = request.BedRoom,
                    Bed = request.Bed,
                    BathRoom = request.BathRoom,
                    Description = request.Description,
                    Price = request.Price,
                    WashingMachine = request.WashingMachine,
                    Balcony = request.Balcony,
                    TV = request.TV,
                    AirConditioner = request.AirConditioner,
                    Wifi = request.Wifi,
                    Kitchen = request.Kitchen,
                    Parking = request.Parking,
                    SwimmingPool = request.SwimmingPool,
                    LocationId = request.LocationId,
                    Picture = request.Picture,
                    CreatedAt = DateTime.UtcNow.AddHours(7),
                    UpdatedAt = DateTime.UtcNow.AddHours(7)
                };

                var createdRoom = await _roomRepository.AddAsync(room);
                var response = MapToResponseDTO(createdRoom);

                return ApiResponse<RoomResponseDTO>.SuccessResponse(response, "Room created successfully", 201);
            }
            catch (Exception ex)
            {
                return ApiResponse<RoomResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<RoomResponseDTO>> UpdateRoomAsync(Guid id, UpdateRoomRequestDTO request)
        {
            try
            {
                var room = await _roomRepository.GetByIdAsync(id);

                if (room == null)
                {
                    return ApiResponse<RoomResponseDTO>.ErrorResponse("Room not found", 404);
                }

                // Verify location exists if provided
                if (request.LocationId.HasValue)
                {
                    var locationExists = await _locationRepository.ExistsAsync(request.LocationId.Value);
                    if (!locationExists)
                    {
                        return ApiResponse<RoomResponseDTO>.ErrorResponse("Location not found", 400);
                    }
                    room.LocationId = request.LocationId.Value;
                }

                room.Name = request.Name ?? room.Name;
                room.BedRoom = request.BedRoom ?? room.BedRoom;
                room.Bed = request.Bed ?? room.Bed;
                room.BathRoom = request.BathRoom ?? room.BathRoom;
                room.Description = request.Description ?? room.Description;
                room.Price = request.Price ?? room.Price;
                room.WashingMachine = request.WashingMachine ?? room.WashingMachine;
                room.Balcony = request.Balcony ?? room.Balcony;
                room.TV = request.TV ?? room.TV;
                room.AirConditioner = request.AirConditioner ?? room.AirConditioner;
                room.Wifi = request.Wifi ?? room.Wifi;
                room.Kitchen = request.Kitchen ?? room.Kitchen;
                room.Parking = request.Parking ?? room.Parking;
                room.SwimmingPool = request.SwimmingPool ?? room.SwimmingPool;
                room.UpdatedAt = DateTime.UtcNow.AddHours(7);

                var updatedRoom = await _roomRepository.UpdateAsync(room);
                var response = MapToResponseDTO(updatedRoom);

                return ApiResponse<RoomResponseDTO>.SuccessResponse(response, "Room updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<RoomResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteRoomAsync(Guid id)
        {
            try
            {
                var deleted = await _roomRepository.DeleteAsync(id);

                if (!deleted)
                {
                    return ApiResponse<bool>.ErrorResponse("Room not found", 404);
                }

                return ApiResponse<bool>.SuccessResponse(true, "Room deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<RoomResponseDTO>>> GetRoomsByLocationAsync(Guid locationId)
        {
            try
            {
                var rooms = await _roomRepository.GetByLocationIdAsync(locationId);
                var response = rooms.Select(MapToResponseDTO);

                return ApiResponse<IEnumerable<RoomResponseDTO>>.SuccessResponse(response, "Rooms retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<RoomResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<RoomResponseDTO>>> SearchRoomsAsync(string? keyword, Guid? locationId, decimal? minPrice, decimal? maxPrice)
        {
            try
            {
                var rooms = await _roomRepository.SearchAsync(keyword, locationId, minPrice, maxPrice);
                var response = rooms.Select(MapToResponseDTO);

                return ApiResponse<IEnumerable<RoomResponseDTO>>.SuccessResponse(response, "Room search completed successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<RoomResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<PagedResult<RoomResponseDTO>>> GetPaginatedRoomsAsync(int page, int pageSize)
        {
            try
            {
                var rooms = await _roomRepository.GetPaginatedAsync(page, pageSize);
                var totalCount = await _roomRepository.GetTotalCountAsync();

                var response = new PagedResult<RoomResponseDTO>
                {
                    Items = rooms.Select(MapToResponseDTO).ToList(),
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return ApiResponse<PagedResult<RoomResponseDTO>>.SuccessResponse(response, "Rooms retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<PagedResult<RoomResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> UploadRoomImageAsync(Guid id, IFormFile file)
        {
            try
            {
                var room = await _roomRepository.GetByIdAsync(id);

                if (room == null)
                {
                    return ApiResponse<string>.ErrorResponse("Room not found", 404);
                }

                // Save file logic (simplified)
                var fileName = $"room_{id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine("wwwroot", "images", "rooms", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/images/rooms/{fileName}";
                room.Picture = imageUrl;
                room.UpdatedAt = DateTime.UtcNow.AddHours(7);

                await _roomRepository.UpdateAsync(room);

                return ApiResponse<string>.SuccessResponse(imageUrl, "Image uploaded successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        private RoomResponseDTO MapToResponseDTO(Room room)
        {
            return new RoomResponseDTO
            {
                Id = room.Id,
                Name = room.Name,
                BedRoom = room.BedRoom,
                Bed = room.Bed,
                BathRoom = room.BathRoom,
                Description = room.Description,
                Price = room.Price,
                WashingMachine = room.WashingMachine,
                Balcony = room.Balcony,
                TV = room.TV,
                AirConditioner = room.AirConditioner,
                Wifi = room.Wifi,
                Kitchen = room.Kitchen,
                Parking = room.Parking,
                SwimmingPool = room.SwimmingPool,
                LocationId = room.LocationId,
                Picture = room.Picture,
                CreatedAt = room.CreatedAt,
                UpdatedAt = room.UpdatedAt,
                Location = room.Location != null ? new LocationResponseDTO
                {
                    Id = room.Location.Id,
                    Name = room.Location.Name,
                    Province = room.Location.Province,
                    Country = room.Location.Country,
                    Image = room.Location.Image,
                    CreatedAt = room.Location.CreatedAt,
                    UpdatedAt = room.Location.UpdatedAt
                } : null
            };
        }
    }
}

using be.DTOs;
using be.Models;
using be.Repositories;

namespace be.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IUserRepository _userRepository;

        public CommentService(ICommentRepository commentRepository, IRoomRepository roomRepository, IUserRepository userRepository)
        {
            _commentRepository = commentRepository;
            _roomRepository = roomRepository;
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<IEnumerable<CommentResponseDTO>>> GetAllCommentsAsync()
        {
            try
            {
                var comments = await _commentRepository.GetAllAsync();
                var response = comments.Select(MapToResponseDTO);

                return ApiResponse<IEnumerable<CommentResponseDTO>>.SuccessResponse(response, "Comments retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<CommentResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CommentResponseDTO>> GetCommentByIdAsync(Guid id)
        {
            try
            {
                var comment = await _commentRepository.GetByIdAsync(id);

                if (comment == null)
                {
                    return ApiResponse<CommentResponseDTO>.ErrorResponse("Comment not found", 404);
                }

                var response = MapToResponseDTO(comment);
                return ApiResponse<CommentResponseDTO>.SuccessResponse(response, "Comment retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<CommentResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CommentResponseDTO>> CreateCommentAsync(CreateCommentRequestDTO request)
        {
            try
            {
                // Verify room exists
                var roomExists = await _roomRepository.ExistsAsync(request.RoomId);
                if (!roomExists)
                {
                    return ApiResponse<CommentResponseDTO>.ErrorResponse("Room not found", 400);
                }

                // Verify user exists
                var userExists = await _userRepository.ExistsAsync(request.UserId);
                if (!userExists)
                {
                    return ApiResponse<CommentResponseDTO>.ErrorResponse("User not found", 400);
                }

                // Check if user has already commented on this room
                var hasCommented = await _commentRepository.HasUserCommentedOnRoomAsync(request.UserId, request.RoomId);
                if (hasCommented)
                {
                    return ApiResponse<CommentResponseDTO>.ErrorResponse("User has already commented on this room", 400);
                }

                var comment = new Comment
                {
                    Id = Guid.NewGuid(),
                    RoomId = request.RoomId,
                    UserId = request.UserId,
                    Content = request.Content,
                    Rating = request.Rating,
                    CreatedAt = DateTime.UtcNow.AddHours(7)
                };

                var createdComment = await _commentRepository.AddAsync(comment);
                var response = MapToResponseDTO(createdComment);

                return ApiResponse<CommentResponseDTO>.SuccessResponse(response, "Comment created successfully", 201);
            }
            catch (Exception ex)
            {
                return ApiResponse<CommentResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<CommentResponseDTO>> UpdateCommentAsync(Guid id, UpdateCommentRequestDTO request)
        {
            try
            {
                var comment = await _commentRepository.GetByIdAsync(id);

                if (comment == null)
                {
                    return ApiResponse<CommentResponseDTO>.ErrorResponse("Comment not found", 404);
                }

                comment.Content = request.Content ?? comment.Content;
                comment.Rating = request.Rating ?? comment.Rating;

                var updatedComment = await _commentRepository.UpdateAsync(comment);
                var response = MapToResponseDTO(updatedComment);

                return ApiResponse<CommentResponseDTO>.SuccessResponse(response, "Comment updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<CommentResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteCommentAsync(Guid id)
        {
            try
            {
                var deleted = await _commentRepository.DeleteAsync(id);

                if (!deleted)
                {
                    return ApiResponse<bool>.ErrorResponse("Comment not found", 404);
                }

                return ApiResponse<bool>.SuccessResponse(true, "Comment deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<CommentResponseDTO>>> GetCommentsByRoomAsync(Guid roomId)
        {
            try
            {
                var comments = await _commentRepository.GetByRoomIdAsync(roomId);
                var response = comments.Select(MapToResponseDTO);

                return ApiResponse<IEnumerable<CommentResponseDTO>>.SuccessResponse(response, "Room comments retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<CommentResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<CommentResponseDTO>>> GetCommentsByUserAsync(Guid userId)
        {
            try
            {
                var comments = await _commentRepository.GetByUserIdAsync(userId);
                var response = comments.Select(MapToResponseDTO);

                return ApiResponse<IEnumerable<CommentResponseDTO>>.SuccessResponse(response, "User comments retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<CommentResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        private static CommentResponseDTO MapToResponseDTO(Comment comment)
        {
            return new CommentResponseDTO
            {
                Id = comment.Id,
                RoomId = comment.RoomId,
                UserId = comment.UserId,
                Content = comment.Content,
                Rating = comment.Rating,
                CreatedAt = comment.CreatedAt,
                Room = comment.Room != null ? new RoomResponseDTO
                {
                    Id = comment.Room.Id,
                    Name = comment.Room.Name,
                    BedRoom = comment.Room.BedRoom,
                    Bed = comment.Room.Bed,
                    BathRoom = comment.Room.BathRoom,
                    Description = comment.Room.Description,
                    Price = comment.Room.Price,
                    WashingMachine = comment.Room.WashingMachine,
                    Balcony = comment.Room.Balcony,
                    TV = comment.Room.TV,
                    AirConditioner = comment.Room.AirConditioner,
                    Wifi = comment.Room.Wifi,
                    Kitchen = comment.Room.Kitchen,
                    Parking = comment.Room.Parking,
                    SwimmingPool = comment.Room.SwimmingPool,
                    LocationId = comment.Room.LocationId,
                    Picture = comment.Room.Picture,
                    CreatedAt = comment.Room.CreatedAt,
                    UpdatedAt = comment.Room.UpdatedAt
                } : null,
                User = comment.User != null ? new UserResponseDTO
                {
                    Id = comment.User.Id,
                    Name = comment.User.Name,
                    Email = comment.User.Email,
                    AvatarUrl = comment.User.AvatarUrl,
                    Phone = comment.User.Phone,
                    DateOfBirth = comment.User.DateOfBirth,
                    Gender = comment.User.Gender,
                    Role = comment.User.Role,
                    CreatedAt = comment.User.CreatedAt,
                    UpdatedAt = comment.User.UpdatedAt
                } : null
            };
        }
    }
}

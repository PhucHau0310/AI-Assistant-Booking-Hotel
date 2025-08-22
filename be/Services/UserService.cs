using be.DTOs;
using be.Models;
using be.Repositories;

namespace be.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ApiResponse<IEnumerable<UserResponseDTO>>> GetAllUsersAsync()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                var response = users.Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    AvatarUrl = u.AvatarUrl,
                    Phone = u.Phone,
                    DateOfBirth = u.DateOfBirth,
                    Gender = u.Gender,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                });

                return ApiResponse<IEnumerable<UserResponseDTO>>.SuccessResponse(response, "Users retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<UserResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserResponseDTO>> GetUserByIdAsync(Guid id)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                {
                    return ApiResponse<UserResponseDTO>.ErrorResponse("User not found", 404);
                }

                var response = new UserResponseDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    AvatarUrl = user.AvatarUrl,
                    Phone = user.Phone,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                };

                return ApiResponse<UserResponseDTO>.SuccessResponse(response, "User retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserResponseDTO>> UpdateUserAsync(Guid id, UpdateUserRequestDTO request)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                {
                    return ApiResponse<UserResponseDTO>.ErrorResponse("User not found", 404);
                }

                // Check if email already exists (excluding current user)
                if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
                {
                    if (await _userRepository.EmailExistsAsync(request.Email))
                    {
                        return ApiResponse<UserResponseDTO>.ErrorResponse("Email already exists", 400);
                    }
                    user.Email = request.Email;
                }

                user.Name = request.Name ?? user.Name;
                user.Phone = request.Phone ?? user.Phone;
                user.DateOfBirth = request.DateOfBirth ?? user.DateOfBirth;
                user.Gender = request.Gender ?? user.Gender;
                user.UpdatedAt = DateTime.UtcNow.AddHours(7);

                var updatedUser = await _userRepository.UpdateAsync(user);

                var response = new UserResponseDTO
                {
                    Id = updatedUser.Id,
                    Name = updatedUser.Name,
                    Email = updatedUser.Email,
                    AvatarUrl = updatedUser.AvatarUrl,
                    Phone = updatedUser.Phone,
                    DateOfBirth = updatedUser.DateOfBirth,
                    Gender = updatedUser.Gender,
                    Role = updatedUser.Role,
                    CreatedAt = updatedUser.CreatedAt,
                    UpdatedAt = updatedUser.UpdatedAt
                };

                return ApiResponse<UserResponseDTO>.SuccessResponse(response, "User updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponseDTO>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteUserAsync(Guid id)
        {
            try
            {
                var deleted = await _userRepository.DeleteAsync(id);

                if (!deleted)
                {
                    return ApiResponse<bool>.ErrorResponse("User not found", 404);
                }

                return ApiResponse<bool>.SuccessResponse(true, "User deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<UserResponseDTO>>> SearchUsersAsync(string? keyword)
        {
            try
            {
                var users = await _userRepository.GetAllAsync();

                if (!string.IsNullOrEmpty(keyword))
                {
                    users = users.Where(u => 
                        u.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                        u.Email.Contains(keyword, StringComparison.OrdinalIgnoreCase));
                }

                var response = users.Select(u => new UserResponseDTO
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    AvatarUrl = u.AvatarUrl,
                    Phone = u.Phone,
                    DateOfBirth = u.DateOfBirth,
                    Gender = u.Gender,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                });

                return ApiResponse<IEnumerable<UserResponseDTO>>.SuccessResponse(response, "User search completed successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<UserResponseDTO>>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> UploadUserAvatarAsync(Guid id, IFormFile file)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(id);

                if (user == null)
                {
                    return ApiResponse<string>.ErrorResponse("User not found", 404);
                }

                // Save file logic (simplified)
                var fileName = $"avatar_{id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine("wwwroot", "images", "avatars", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = $"/images/avatars/{fileName}";
                user.AvatarUrl = imageUrl;
                user.UpdatedAt = DateTime.UtcNow.AddHours(7);

                await _userRepository.UpdateAsync(user);

                return ApiResponse<string>.SuccessResponse(imageUrl, "Avatar uploaded successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.ErrorResponse($"An error occurred: {ex.Message}");
            }
        }
    }
}

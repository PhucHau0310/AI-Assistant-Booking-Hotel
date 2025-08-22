using be.DTOs;
using be.Models;
using be.Repositories;
using be.Constants;

namespace be.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<ApiResponse<LoginResponseDTO>> LoginAsync(LoginRequestDTO request)
        {
            try
            {
                var user = await _userRepository.AuthenticateAsync(request.Email, request.Password);

                if (user == null)
                {
                    return ApiResponse<LoginResponseDTO>.ErrorResponse("Invalid email or password", 401);
                }

                // Convert enum to constant string for JWT
                var roleString = user.Role == UserRole.Admin ? UserRoles.ADMIN : UserRoles.USER;
                var token = _jwtService.GenerateToken(user.Id, user.Email, roleString);

                var response = new LoginResponseDTO
                {
                    Token = token,
                    User = new UserResponseDTO
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
                    }
                };

                return ApiResponse<LoginResponseDTO>.SuccessResponse(response, "Login successful");
            }
            catch (Exception ex)
            {
                return ApiResponse<LoginResponseDTO>.ErrorResponse($"An error occurred during login: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserResponseDTO>> RegisterAsync(RegisterRequestDTO request)
        {
            try
            {
                // Check if email already exists
                if (await _userRepository.EmailExistsAsync(request.Email))
                {
                    return ApiResponse<UserResponseDTO>.ErrorResponse("Email already exists", 400);
                }

                // Create new user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Email = request.Email,
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Phone = request.Phone,
                    DateOfBirth = request.DateOfBirth,
                    Gender = request.Gender,
                    Role = UserRole.User,
                    AvatarUrl = AppConstants.AvatarUrl, // Use the default avatar URL from AppConstants
                    CreatedAt = DateTime.UtcNow.AddHours(7),
                    UpdatedAt = DateTime.UtcNow.AddHours(7)
                };

                var createdUser = await _userRepository.AddAsync(user);

                var response = new UserResponseDTO
                {
                    Id = createdUser.Id,
                    Name = createdUser.Name,
                    Email = createdUser.Email,
                    AvatarUrl = createdUser.AvatarUrl,
                    Phone = createdUser.Phone,
                    DateOfBirth = createdUser.DateOfBirth,
                    Gender = createdUser.Gender,
                    Role = createdUser.Role,
                    CreatedAt = createdUser.CreatedAt,
                    UpdatedAt = createdUser.UpdatedAt
                };

                return ApiResponse<UserResponseDTO>.SuccessResponse(response, "User registered successfully", 201);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponseDTO>.ErrorResponse($"An error occurred during registration: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserResponseDTO>> GetCurrentUserAsync(Guid userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);

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
    }
}

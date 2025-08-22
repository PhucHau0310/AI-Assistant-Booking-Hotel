using be.DTOs;

namespace be.Services
{
    public interface ICommentService
    {
        Task<ApiResponse<IEnumerable<CommentResponseDTO>>> GetAllCommentsAsync();
        Task<ApiResponse<CommentResponseDTO>> GetCommentByIdAsync(Guid id);
        Task<ApiResponse<CommentResponseDTO>> CreateCommentAsync(CreateCommentRequestDTO request);
        Task<ApiResponse<CommentResponseDTO>> UpdateCommentAsync(Guid id, UpdateCommentRequestDTO request);
        Task<ApiResponse<bool>> DeleteCommentAsync(Guid id);
        Task<ApiResponse<IEnumerable<CommentResponseDTO>>> GetCommentsByRoomAsync(Guid roomId);
        Task<ApiResponse<IEnumerable<CommentResponseDTO>>> GetCommentsByUserAsync(Guid userId);
    }
}

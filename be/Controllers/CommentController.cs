using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using be.DTOs;
using be.Services;

namespace be.Controllers
{
    [ApiController]
    [Route("api/comments")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<CommentResponseDTO>>>> GetAllComments()
        {
            try
            {
                var result = await _commentService.GetAllCommentsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<CommentResponseDTO>>.ErrorResponse($"Error retrieving comments: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CommentResponseDTO>>> GetCommentById(Guid id)
        {
            try
            {
                var result = await _commentService.GetCommentByIdAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<CommentResponseDTO>.ErrorResponse($"Error retrieving comment: {ex.Message}"));
            }
        }

        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<CommentResponseDTO>>>> GetCommentsByRoom(Guid roomId)
        {
            try
            {
                var result = await _commentService.GetCommentsByRoomAsync(roomId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<CommentResponseDTO>>.ErrorResponse($"Error retrieving room comments: {ex.Message}"));
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<CommentResponseDTO>>>> GetCommentsByUser(Guid userId)
        {
            try
            {
                var result = await _commentService.GetCommentsByUserAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<IEnumerable<CommentResponseDTO>>.ErrorResponse($"Error retrieving user comments: {ex.Message}"));
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CommentResponseDTO>>> CreateComment([FromBody] CreateCommentRequestDTO request)
        {
            try
            {
                var result = await _commentService.CreateCommentAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<CommentResponseDTO>.ErrorResponse($"Error creating comment: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<CommentResponseDTO>>> UpdateComment(Guid id, [FromBody] UpdateCommentRequestDTO request)
        {
            try
            {
                var result = await _commentService.UpdateCommentAsync(id, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<CommentResponseDTO>.ErrorResponse($"Error updating comment: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteComment(Guid id)
        {
            try
            {
                var result = await _commentService.DeleteCommentAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<bool>.ErrorResponse($"Error deleting comment: {ex.Message}"));
            }
        }
    }
}

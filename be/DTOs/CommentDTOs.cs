using System.ComponentModel.DataAnnotations;

namespace be.DTOs
{
    public class CommentResponseDTO
    {
        public Guid Id { get; set; }
        public Guid RoomId { get; set; }
        public Guid UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public RoomResponseDTO? Room { get; set; }
        public UserResponseDTO? User { get; set; }
    }

    public class CreateCommentRequestDTO
    {
        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(500)]
        public string Content { get; set; } = string.Empty;

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
    }

    public class UpdateCommentRequestDTO
    {
        [StringLength(500)]
        public string? Content { get; set; }

        [Range(1, 5)]
        public int? Rating { get; set; }
    }
}

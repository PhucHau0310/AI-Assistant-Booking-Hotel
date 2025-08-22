using System.ComponentModel.DataAnnotations;

namespace be.DTOs
{
    public class BookingResponseDTO
    {
        public Guid Id { get; set; }
        public Guid RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int GuestCount { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public RoomResponseDTO? Room { get; set; }
        public UserResponseDTO? User { get; set; }
    }

    public class CreateBookingRequestDTO
    {
        [Required]
        public Guid RoomId { get; set; }

        [Required]
        public DateTime CheckInDate { get; set; }

        [Required]
        public DateTime CheckOutDate { get; set; }

        [Required]
        [Range(1, 20)]
        public int GuestCount { get; set; }

        [Required]
        public Guid UserId { get; set; }
    }

    public class UpdateBookingRequestDTO
    {
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }

        [Range(1, 20)]
        public int? GuestCount { get; set; }
    }
}

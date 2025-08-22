using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be.Models
{
    public class Room
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int BedRoom { get; set; }

        [Required]
        public int Bed { get; set; }

        [Required]
        public int BathRoom { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public bool WashingMachine { get; set; } = false;
        public bool Balcony { get; set; } = false;
        public bool TV { get; set; } = false;
        public bool AirConditioner { get; set; } = false;
        public bool Wifi { get; set; } = false;
        public bool Kitchen { get; set; } = false;
        public bool Parking { get; set; } = false;
        public bool SwimmingPool { get; set; } = false;

        [Required]
        public Guid LocationId { get; set; }

        public string? Picture { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7);
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow.AddHours(7);

        // Navigation properties
        [ForeignKey("LocationId")]
        public virtual Location Location { get; set; } = null!;

        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}

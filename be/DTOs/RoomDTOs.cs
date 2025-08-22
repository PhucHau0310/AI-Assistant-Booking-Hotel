using System.ComponentModel.DataAnnotations;
using be.Models;

namespace be.DTOs
{
    public class RoomResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int BedRoom { get; set; }
        public int Bed { get; set; }
        public int BathRoom { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public bool WashingMachine { get; set; }
        public bool Balcony { get; set; }
        public bool TV { get; set; }
        public bool AirConditioner { get; set; }
        public bool Wifi { get; set; }
        public bool Kitchen { get; set; }
        public bool Parking { get; set; }
        public bool SwimmingPool { get; set; }
        public Guid LocationId { get; set; }
        public string? Picture { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public LocationResponseDTO? Location { get; set; }
    }

    public class CreateRoomRequestDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(1, 10)]
        public int BedRoom { get; set; }

        [Required]
        [Range(1, 10)]
        public int Bed { get; set; }

        [Required]
        [Range(1, 5)]
        public int BathRoom { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
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
    }

    public class UpdateRoomRequestDTO
    {
        [StringLength(100)]
        public string? Name { get; set; }

        [Range(1, 10)]
        public int? BedRoom { get; set; }

        [Range(1, 10)]
        public int? Bed { get; set; }

        [Range(1, 5)]
        public int? BathRoom { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? Price { get; set; }

        public bool? WashingMachine { get; set; }
        public bool? Balcony { get; set; }
        public bool? TV { get; set; }
        public bool? AirConditioner { get; set; }
        public bool? Wifi { get; set; }
        public bool? Kitchen { get; set; }
        public bool? Parking { get; set; }
        public bool? SwimmingPool { get; set; }

        public Guid? LocationId { get; set; }
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}

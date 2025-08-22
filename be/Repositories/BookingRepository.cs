using be.Data;
using be.Models;
using Microsoft.EntityFrameworkCore;

namespace be.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(BookingHotelContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Include(b => b.Room)
                    .ThenInclude(r => r.Location)
                .Include(b => b.User)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetByRoomIdAsync(Guid roomId)
        {
            return await _dbSet
                .Include(b => b.Room)
                    .ThenInclude(r => r.Location)
                .Include(b => b.User)
                .Where(b => b.RoomId == roomId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> IsRoomAvailableAsync(Guid roomId, DateTime checkIn, DateTime checkOut, Guid? excludeBookingId = null)
        {
            var query = _dbSet.Where(b => b.RoomId == roomId &&
                ((b.CheckInDate <= checkIn && b.CheckOutDate > checkIn) ||
                 (b.CheckInDate < checkOut && b.CheckOutDate >= checkOut) ||
                 (b.CheckInDate >= checkIn && b.CheckOutDate <= checkOut)));

            if (excludeBookingId.HasValue)
            {
                query = query.Where(b => b.Id != excludeBookingId.Value);
            }

            return !await query.AnyAsync();
        }

        public override async Task<IEnumerable<Booking>> GetAllAsync()
        {
            return await _dbSet
                .Include(b => b.Room)
                    .ThenInclude(r => r.Location)
                .Include(b => b.User)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public override async Task<Booking?> GetByIdAsync(object id)
        {
            if (id is Guid guidId)
            {
                return await _dbSet
                    .Include(b => b.Room)
                        .ThenInclude(r => r.Location)
                    .Include(b => b.User)
                    .FirstOrDefaultAsync(b => b.Id == guidId);
            }
            return null;
        }
    }
}

using be.Data;
using be.Models;
using Microsoft.EntityFrameworkCore;

namespace be.Repositories
{
    public class RoomRepository : GenericRepository<Room>, IRoomRepository
    {
        public RoomRepository(BookingHotelContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Room>> GetByLocationIdAsync(Guid locationId)
        {
            return await _dbSet
                .Include(r => r.Location)
                .Include(r => r.Bookings)
                .Include(r => r.Comments)
                .Where(r => r.LocationId == locationId)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> SearchAsync(string? keyword, Guid? locationId, decimal? minPrice, decimal? maxPrice)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(r => 
                    r.Name.Contains(keyword) ||
                    (r.Description != null && r.Description.Contains(keyword)));
            }

            if (locationId.HasValue)
            {
                query = query.Where(r => r.LocationId == locationId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(r => r.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(r => r.Price <= maxPrice.Value);
            }

            return await query
                .Include(r => r.Location)
                .Include(r => r.Bookings)
                .Include(r => r.Comments)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> GetPaginatedAsync(int page, int pageSize)
        {
            return await _dbSet
                .Include(r => r.Location)
                .Include(r => r.Bookings)
                .Include(r => r.Comments)
                .OrderBy(r => r.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _dbSet.CountAsync();
        }

        public override async Task<IEnumerable<Room>> GetAllAsync()
        {
            return await _dbSet
                .Include(r => r.Location)
                .Include(r => r.Bookings)
                .Include(r => r.Comments)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public override async Task<Room?> GetByIdAsync(object id)
        {
            if (id is Guid guidId)
            {
                return await _dbSet
                    .Include(r => r.Location)
                    .Include(r => r.Bookings)
                    .Include(r => r.Comments)
                    .FirstOrDefaultAsync(r => r.Id == guidId);
            }
            return null;
        }
    }
}

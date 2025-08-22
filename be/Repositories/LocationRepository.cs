using be.Data;
using be.Models;
using Microsoft.EntityFrameworkCore;

namespace be.Repositories
{
    public class LocationRepository : GenericRepository<Location>, ILocationRepository
    {
        public LocationRepository(BookingHotelContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Location>> SearchAsync(string? keyword)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(l => 
                    l.Name.Contains(keyword) ||
                    l.Province.Contains(keyword) ||
                    l.Country.Contains(keyword));
            }

            return await query
                .Include(l => l.Rooms)
                .OrderBy(l => l.Name)
                .ToListAsync();
        }

        public async Task<bool> NameExistsAsync(string name, Guid? excludeId = null)
        {
            var query = _dbSet.Where(l => l.Name.ToLower() == name.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(l => l.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public override async Task<IEnumerable<Location>> GetAllAsync()
        {
            return await _dbSet
                .Include(l => l.Rooms)
                .OrderBy(l => l.Name)
                .ToListAsync();
        }

        public override async Task<Location?> GetByIdAsync(object id)
        {
            if (id is Guid guidId)
            {
                return await _dbSet
                    .Include(l => l.Rooms)
                    .FirstOrDefaultAsync(l => l.Id == guidId);
            }
            return null;
        }
    }
}

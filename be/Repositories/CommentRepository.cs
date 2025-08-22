using be.Data;
using be.Models;
using Microsoft.EntityFrameworkCore;

namespace be.Repositories
{
    public class CommentRepository : GenericRepository<Comment>, ICommentRepository
    {
        public CommentRepository(BookingHotelContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Comment>> GetByRoomIdAsync(Guid roomId)
        {
            return await _dbSet
                .Include(c => c.Room)
                .Include(c => c.User)
                .Where(c => c.RoomId == roomId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Comment>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Include(c => c.Room)
                    .ThenInclude(r => r.Location)
                .Include(c => c.User)
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> HasUserCommentedOnRoomAsync(Guid userId, Guid roomId)
        {
            return await _dbSet.AnyAsync(c => c.UserId == userId && c.RoomId == roomId);
        }

        public override async Task<IEnumerable<Comment>> GetAllAsync()
        {
            return await _dbSet
                .Include(c => c.Room)
                    .ThenInclude(r => r.Location)
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public override async Task<Comment?> GetByIdAsync(object id)
        {
            if (id is Guid guidId)
            {
                return await _dbSet
                    .Include(c => c.Room)
                        .ThenInclude(r => r.Location)
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == guidId);
            }
            return null;
        }
    }
}

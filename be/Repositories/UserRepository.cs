using be.Data;
using be.Models;
using Microsoft.EntityFrameworkCore;

namespace be.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(BookingHotelContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            var user = await GetByEmailAsync(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.HashedPassword))
                return null;

            return user;
        }

        public override async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbSet
                .Include(u => u.Bookings)
                .Include(u => u.Comments)
                .ToListAsync();
        }

        public override async Task<User?> GetByIdAsync(object id)
        {
            if (id is Guid guidId)
            {
                return await _dbSet
                    .Include(u => u.Bookings)
                    .Include(u => u.Comments)
                    .FirstOrDefaultAsync(u => u.Id == guidId);
            }
            return null;
        }
    }
}

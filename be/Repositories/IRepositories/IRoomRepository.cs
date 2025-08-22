using be.Models;

namespace be.Repositories
{
    public interface IRoomRepository : IGenericRepository<Room>
    {
        Task<IEnumerable<Room>> GetByLocationIdAsync(Guid locationId);
        Task<IEnumerable<Room>> SearchAsync(string? keyword, Guid? locationId, decimal? minPrice, decimal? maxPrice);
        Task<IEnumerable<Room>> GetPaginatedAsync(int page, int pageSize);
        Task<int> GetTotalCountAsync();
    }
}

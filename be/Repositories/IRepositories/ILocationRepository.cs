using be.Models;

namespace be.Repositories
{
    public interface ILocationRepository : IGenericRepository<Location>
    {
        Task<IEnumerable<Location>> SearchAsync(string? keyword);
        Task<bool> NameExistsAsync(string name, Guid? excludeId = null);
    }
}

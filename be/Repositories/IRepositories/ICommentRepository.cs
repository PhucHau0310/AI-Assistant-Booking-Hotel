using be.Models;

namespace be.Repositories
{
    public interface ICommentRepository : IGenericRepository<Comment>
    {
        Task<IEnumerable<Comment>> GetByRoomIdAsync(Guid roomId);
        Task<IEnumerable<Comment>> GetByUserIdAsync(Guid userId);
        Task<bool> HasUserCommentedOnRoomAsync(Guid userId, Guid roomId);
    }
}

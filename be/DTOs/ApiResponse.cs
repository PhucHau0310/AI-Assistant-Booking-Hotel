namespace be.DTOs
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Content { get; set; }
        public int? TotalRow { get; set; }
        public int? PageIndex { get; set; }
        public DateTime DateTime { get; set; } = DateTime.UtcNow;

        public static ApiResponse<T> SuccessResponse(T data, string message = "Success", int statusCode = 200)
        {
            return new ApiResponse<T>
            {
                StatusCode = statusCode,
                Message = message,
                Content = data,
                DateTime = DateTime.UtcNow
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, int statusCode = 500)
        {
            return new ApiResponse<T>
            {
                StatusCode = statusCode,
                Message = message,
                Content = default(T),
                DateTime = DateTime.UtcNow
            };
        }
    }

    public class PaginatedResult<T>
    {
        public List<T> Data { get; set; } = new List<T>();
        public int TotalRow { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
    }
}

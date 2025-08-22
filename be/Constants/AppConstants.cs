namespace be.Constants
{
    public static class AppConstants
    {
        public const string AvatarUrl = "https://booking-api.hau.io.vn/avatar-default.jpg";
    }

    public static class UserRoles
    {
        public const string ADMIN = "Admin";
        public const string USER = "User";
    }

    public static class PaymentStatus
    {
        public const string PENDING = "PENDING";
        public const string PROCESSING = "PROCESSING";
        public const string COMPLETED = "COMPLETED";
        public const string FAILED = "FAILED";
        public const string CANCELLED = "CANCELLED";
        public const string REFUNDED = "REFUNDED";
    }

    public static class PaymentMethods
    {
        public const string CREDIT_CARD = "CREDIT_CARD";
        public const string DEBIT_CARD = "DEBIT_CARD";
        public const string BANK_TRANSFER = "BANK_TRANSFER";
        public const string DIGITAL_WALLET = "DIGITAL_WALLET";
    }

    public static class BookingStatus
    {
        public const string PENDING = "PENDING";
        public const string CONFIRMED = "CONFIRMED";
        public const string CANCELLED = "CANCELLED";
        public const string COMPLETED = "COMPLETED";
    }
}

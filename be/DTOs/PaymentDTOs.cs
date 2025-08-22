using System.ComponentModel.DataAnnotations;

namespace be.DTOs
{
    public class PaymentRequestDTO
    {
        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, DIGITAL_WALLET

        [StringLength(100)]
        public string? CardNumber { get; set; }

        [StringLength(10)]
        public string? ExpiryMonth { get; set; }

        [StringLength(10)]
        public string? ExpiryYear { get; set; }

        [StringLength(10)]
        public string? CVV { get; set; }

        [StringLength(100)]
        public string? CardHolderName { get; set; }

        [StringLength(200)]
        public string? BillingAddress { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class PaymentResponseDTO
    {
        public Guid PaymentId { get; set; }
        public Guid BookingId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REFUNDED
        public string PaymentMethod { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ReceiptUrl { get; set; }
        public PaymentDetailsDTO? PaymentDetails { get; set; }
    }

    public class PaymentStatusDTO
    {
        public Guid BookingId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
        public string? TransactionId { get; set; }
        public string? PaymentMethod { get; set; }
        public PaymentHistoryDTO[]? History { get; set; }
    }

    public class PaymentDetailsDTO
    {
        public string? Gateway { get; set; } // STRIPE, PAYPAL, VNPAY, MOMO
        public string? GatewayTransactionId { get; set; }
        public decimal? ProcessingFee { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        public DateTime? ProcessedAt { get; set; }
    }

    public class PaymentHistoryDTO
    {
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
    }

    public class RefundRequestDTO
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Refund amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Notes { get; set; }
    }

    public class RefundResponseDTO
    {
        public Guid RefundId { get; set; }
        public Guid BookingId { get; set; }
        public Guid OriginalPaymentId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // PENDING, PROCESSING, COMPLETED, FAILED
        public string Reason { get; set; } = string.Empty;
        public DateTime RequestDate { get; set; }
        public DateTime? ProcessedDate { get; set; }
        public string? TransactionId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}

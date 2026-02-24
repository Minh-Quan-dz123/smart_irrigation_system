using System.ComponentModel.DataAnnotations;

namespace device_service.DTO
{
    public class CreateListDeviceRequest
    {
        [Required]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100. ")]
        public int Quantity {get; set;}

        [Required]
        [MaxLength(100)]
        public string Type { get; set; } = string.Empty;
    }
}
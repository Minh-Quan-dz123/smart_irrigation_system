using device_service.Models;


namespace device_service.DTO
{
    public class DeviceResponseUser
    {
        public Guid DeviceId { get; set; }
        public string Type { get; set; } = string.Empty;
        public DeviceStatus Status { get; set; }

        public DateTimeOffset? UpdatedAt {get; set;}

    }
}
using device_service.Models;

namespace device_service.DTO
{
    public class DeviceResponseAdmin
    {
        public long Id { get; set; }
        public Guid DeviceId { get; set; }
        public long? UserId {get; set;}
        public string Type { get; set; } = string.Empty;
        public DeviceStatus Status { get; set; }

        public string? DeviceSecret {get; set;}

        public DateTimeOffset? CreatedAt {get; set;}

        public DateTimeOffset? UpdatedAt {get; set;}

    }
}
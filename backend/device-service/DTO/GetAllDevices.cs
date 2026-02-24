using device_service.Models;

namespace device_service.DTO
{
    public class GetAllDevices
    {
        public long Id { get; set; }
        public Guid DeviceId { get; set; }
        public long? UserId {get; set;}
        public string Type { get; set; } = string.Empty;
        public DeviceStatus Status { get; set; }
    }
}
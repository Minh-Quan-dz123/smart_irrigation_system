using System.ComponentModel.DataAnnotations; // để dùng [Required, Range,..]
using System.ComponentModel.DataAnnotations.Schema; // dùng [Table("....)]


namespace device_service.Models
{
    public class User
    {
        public long Id { get; set; }
        public int RemainingDeviceQuota { get; set; }
    }
}
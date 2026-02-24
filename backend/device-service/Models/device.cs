using System.ComponentModel.DataAnnotations; // để dùng [Required, Range,..]
using System.ComponentModel.DataAnnotations.Schema; // dùng [Table("....)]

namespace device_service.Models // namespace là khai báo không gian
{
    [Table("devices")] // dùng [Table] để map class này vào bảng trong database
    public class Device
    {
        [Key] // khóa chính
        public long Id {get; set;} // bigint <-> long trong C#endregion
        // do trong database là cột id nên C# tự map được ko phân biệt chữ hoa, thường

        
        [Column("user_id")]
        public long? UserId {get; set;} // do khác nhau dấu "_" nên c# ko tự map được nên phải chỉ định rõ column
 
        [Required]
        [Column("device_id")]
        public Guid DeviceId {get; set;} // Guid = duy nhất

        [Required]
        [MaxLength(100)]
        public required string Type {get; set;}


        [Required]
        [MaxLength(20)]
        public DeviceStatus Status {get; set;} = DeviceStatus.Inactive;

        [Column("device_secret")]
        public string? DeviceSecret {get; set;}

        [Column("created_at")]
        public DateTimeOffset? CreatedAt {get; set;}

        [Column("updated_at")]
        public DateTimeOffset? UpdatedAt {get; set;}

    }
}
using System.ComponentModel.DataAnnotations;

namespace device_service.DTO
{
    public class DeviceReportRequest
    {
        public Guid DeviceId { get; set; }

        [Required]
        public long UserId {get; set;}
        
        public long? PlantId {get; set;}

        [Required]
        public string Title {get; set;} = string.Empty;

        [MaxLength(500)]
        [Required]
        public string Context {get; set;} = string.Empty;

        public long? ReportIdPre {get; set;}
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace device_service.Models
{

    [Table("reports")]
    public class Report
    {
        [Key]
        public long Id {get; set;}

        [Column("user_id")]
        public long UserId {get; set;} // long mặc định ko null nên ko cần required

        [Column("device_id")]
        public long DeviceId {get; set;}

        [Column("report_id_pre")]
        public long PreReportId {get; set;}

        [Column("created_at")]
        public DateTimeOffset? CreatedAt {get; set;}

        [Column("plant_id")]
        public long PlantId {get; set;}

        public ReportStatus Status {get; set;} = ReportStatus.New;
        //'new', 'processing', 'resolved', 'rejected', cho phép null

        [Required]
        [MaxLength(500)]
        public string Title {get;set;} = null!; // length< 500, ko cho phép null

        [MaxLength(500)]
        public string? Context {get; set;} // length< 500 cho phép null
        
    }
}
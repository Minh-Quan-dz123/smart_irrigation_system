using Microsoft.EntityFrameworkCore; // thư viện để tạo kết nối database, query, save,...
using device_service.Models;

namespace device_service.data
{
    // tạo lớp AppDbContext kế thừa từ lớp DbConText(options) để thao tác vs database
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        //DbSet Đại diện cho bảng device : khai báo thuộc tính là 1 bảng Devicé
        public DbSet<Device> Devices{get; set;}

        // đại diện cho bảng reports
        public DbSet<Report> Reports {get; set;}

        // thêm user
        public DbSet<User> Users {get; set;}

            
            // cấu hình model
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                // .HasIndex để tạo index giúp thao tác nhanh, .IsUnique() để bắt buộc là giá trị duy nhất
                modelBuilder.Entity<Device>().HasIndex(d => d.DeviceId).IsUnique();

                modelBuilder.Entity<Device>().Property(d => d.Status).HasConversion<string>().HasMaxLength(20); 

                // 
                var entityDevice = modelBuilder.Entity<Device>();
                var entityReport = modelBuilder.Entity<Report>();
                var entityUser = modelBuilder.Entity<User>();
                entityUser.ToTable("users");
                // Id tự tăng
                entityDevice.Property(d=>d.Id).ValueGeneratedOnAdd();

                // device_id do DB sinh
                entityDevice.Property(d=>d.DeviceId).ValueGeneratedOnAdd();

                // created_at do DB sinh
                entityDevice.Property(d => d.CreatedAt).ValueGeneratedOnAdd();

                // updated_at chỉ update khi chỉnh sửa
                entityDevice.Property(d => d.UpdatedAt).ValueGeneratedOnUpdate();

                // secret
                modelBuilder.Entity<Device>().HasIndex(d => d.DeviceSecret).IsUnique();



                //--- report ---
                entityReport.Property(r => r.Id).ValueGeneratedOnAdd();

                // CreatedAt do DB sinh (NOW())
                entityReport.Property(r => r.CreatedAt).ValueGeneratedOnAdd();

                // Convert enum sang string
                entityReport.Property(r => r.Status).HasConversion<string>().HasMaxLength(20).HasDefaultValue(ReportStatus.New);


                //--- user ---
                entityUser.HasKey(u => u.Id);
                entityUser.Property(u => u.RemainingDeviceQuota).HasColumnName("remaining_device_quota");
            }
        }
    
}
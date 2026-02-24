using device_service.data;
using device_service.Models;
using device_service.DTO;
using Microsoft.EntityFrameworkCore;



namespace device_service.Services
{
    // khai báo class DeviceService xử lý nghiệp vụ
    public class DeviceService(AppDbContext context)
    {
        // khai báo client tới database
        private readonly AppDbContext ClientConnectDb = context;

        // 1 tạo device mới theo số lượng// device_id đc tạo sẵn trong database nên ko phải lo tạo deviceID
        public async Task<List<DeviceResponseAdmin>> CreateListDevices(CreateListDeviceRequest listDR)
        {
            if(listDR.Quantity <= 0) throw new ArgumentException("Quantity must be greater than 0");

            if (listDR.Quantity > 100) throw new ArgumentException("Quantity too large");

            var ListDevice = new List<Device>();
            for(int i = 0; i<listDR.Quantity; i++)
            {
                ListDevice.Add(new Device
                {
                    Type = listDR.Type,
                });
            }

            ClientConnectDb.Devices.AddRange(ListDevice);
            await ClientConnectDb.SaveChangesAsync();

            return ListDevice.Select(d => new DeviceResponseAdmin
            {
                Id = d.Id,
                DeviceId = d.DeviceId,
                Type = d.Type,
                Status = d.Status,
                CreatedAt = d.CreatedAt
            }).ToList();

        }


        // 2 lấy list devices của user_id
        public async Task<List<DeviceResponseUser>> GetDevicesByUser(long userId)
        {
            return await ClientConnectDb.Devices.Where(d => d.UserId == userId).Select(d => new DeviceResponseUser
            {
                DeviceId = d.DeviceId,
                Type = d.Type,
                Status = d.Status,
                UpdatedAt = d.UpdatedAt,
            }).ToListAsync();
        }

        //3  lấy thông tin chi tiết của 1 device (admin)
        public async Task<DeviceResponseAdmin?> GetDeviceByAdmin(long id)
        {
            return await ClientConnectDb.Devices.Where(d => d.Id == id).Select(input => new DeviceResponseAdmin
            {
                Id = input.Id,
                DeviceId = input.DeviceId,
                UserId = input.UserId,
                Type = input.Type,
                Status = input.Status,
                DeviceSecret = input.DeviceSecret,
                CreatedAt = input.CreatedAt,
                UpdatedAt = input.UpdatedAt,
            }).FirstOrDefaultAsync();
        }

        // 4 lấy all Device
        public async Task<List<GetAllDevices>> GetAllDevices()
        {
            return await ClientConnectDb.Devices.Select(input => new GetAllDevices
            {
                Id = input.Id,
                DeviceId = input.DeviceId,
                UserId = input.UserId,
                Type = input.Type,
                Status = input.Status,
            }).ToListAsync();
        }

        
        // 5 thêm hàm báo lỗi thiết bị
        public async Task<string> CreateReport(DeviceReportRequest DRR)
        {
            ArgumentNullException.ThrowIfNull(DRR);
            // tạo report
            var report = new Report
            {
                UserId = DRR.UserId,
                PlantId = DRR.PlantId ?? 0,
                PreReportId = DRR.ReportIdPre ?? 0,
                Title = DRR.Title,
                Context = DRR.Context,
                Status = ReportStatus.New
            };

            ClientConnectDb.Add(report);
            await ClientConnectDb.SaveChangesAsync();
            return "Report submitted successfully";
        }
 
        // 6 hàm làm để tạo device_secret
        public async Task<string> CreateDeviceSecret(Guid deviceId, long userId)
        {
            // 1 kiểm tra user
            var userExist = await ClientConnectDb.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new Exception("User not found");

            // 2 kiểm tra số lượng
            if(userExist.RemainingDeviceQuota <= 0) throw new Exception("No remaining device quota");

            // 3 nếu oke hết thì kiểm tra device này có secret chưa, nếu có rồi thì thôi
            var deviceExist = await ClientConnectDb.Devices.FirstOrDefaultAsync(d => d.DeviceId == deviceId && d.UserId == userId) ?? throw new Exception("Device not found");

            if(!string.IsNullOrEmpty(deviceExist.DeviceSecret)) return deviceExist.DeviceSecret;

            // 4 nếu chưa có thì tạo mới
            
            int retryCount = 0;

            while(retryCount < 3)
            {
                var newSecret = Guid.NewGuid().ToString("N");
                deviceExist.DeviceSecret = newSecret;

                try
                {
                    userExist.RemainingDeviceQuota--;
                    await ClientConnectDb.SaveChangesAsync();
                    return newSecret; // thành công thì return
                }
                catch (DbUpdateException)
                {
                    // reset lại quota vì Save fail
                    userExist.RemainingDeviceQuota++;

                    // tạo lại secret và thử lại
                    deviceExist.DeviceSecret = null;
                    retryCount++;
                    
                }
            }

            throw new Exception("Failed to generate unique device secret"); 
        }
        
    }

}
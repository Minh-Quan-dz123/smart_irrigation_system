using Microsoft.AspNetCore.Mvc; // để dùng Controller, ApiController, HttpGet,Post, IActionResult
using device_service.Services;
using device_service.DTO;
using Microsoft.AspNetCore.Authorization;


namespace device_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeviceController(DeviceService deviceService) : ControllerBase
    {
        private readonly DeviceService deviceServiceInstance = deviceService;
        // readonly = ko thể thay đổi khi khởi tạo nhưng gán trong constructor đc, giá trị runtime

        // 1. Admin tạo nhiều device
        [Authorize(Roles = "admin")]
        [HttpPost("create-list")]
        public async Task<IActionResult> CreateListDevices([FromBody] CreateListDeviceRequest request)
        {
            try
            {
                var res = await deviceServiceInstance.CreateListDevices(request);
                return Ok(res);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 2. User lấy danh sách device của mình
        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetDevicesByUser()
        {
            var userIdFromJWT = User.FindFirst("sub")?.Value;
            if(userIdFromJWT == null) return Unauthorized();

            long userId = long.Parse(userIdFromJWT);
            var res = await deviceServiceInstance.GetDevicesByUser(userId);
            return Ok(res);
        }

        // 3. Admin lấy chi tiết 1 device theo Id (database Id)
        [Authorize(Roles = "admin")]
        [HttpGet("admin/{id:long}")]
        public async Task<IActionResult> GetDeviceByAdmin(long id)
        {
            var result = await deviceServiceInstance.GetDeviceByAdmin(id);
            if(result == null) return NotFound("Device not found");
            return Ok(result);
        }

        // 4. Admin lấy toàn bộ device
        [Authorize(Roles = "admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllDevices()
        {
            var res = await deviceServiceInstance.GetAllDevices();
            return Ok(res);
        }

        // 5. User gửi báo lỗi thiết bị
        [Authorize]
        [HttpPost("report")]
        public async Task<IActionResult> CreateReport([FromBody] DeviceReportRequest request)
        {
            try
            {
                var result = await deviceServiceInstance.CreateReport(request);
                return Ok(result);
            }
            catch (ArgumentException)
            {
                return BadRequest("Invalid report data");
            }
        }

        // 6. Tạo device secret
        [Authorize]
        [HttpPost("create-secret")]
        public async Task<IActionResult> CreateDeviceSecret(Guid deviceId, long userId)
        {
            try
            {
                var secret = await deviceServiceInstance.CreateDeviceSecret(deviceId, userId);
                return Ok(new { DeviceSecret = secret });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
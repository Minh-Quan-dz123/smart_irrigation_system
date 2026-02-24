using Microsoft.EntityFrameworkCore;
using device_service.data;
using device_service.Services;

var builder = WebApplication.CreateBuilder(args);// tạo instance , tạo web Application

// đăng ký DbConText
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
    
builder.Services.AddScoped<DeviceService>();
builder.Services.AddControllers(); // đăng ký controller, cho phép dùng [ApiController]


var app = builder.Build();// tạo instance chính thức cho ứng dụng
app.MapControllers(); //map tất cả controller vào routing system
app.Run();
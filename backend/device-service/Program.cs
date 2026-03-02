using Microsoft.EntityFrameworkCore;
using device_service.data;
using device_service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using DotNetEnv;


var builder = WebApplication.CreateBuilder(args);// tạo instance , tạo web Application

// 1.1 Load file .env
Env.Load();
// 1.2 lấy key ra
var publicKey = Environment.GetEnvironmentVariable("JWT_PUBLIC_KEY");
if(string.IsNullOrEmpty(publicKey)) throw new Exception("JWT_PUBLIC_KEY not found in .env");
// 1.3 Convert \n thành newline thật
publicKey = publicKey.Replace("\\n", "\n");
var rsa = RSA.Create();
rsa.ImportFromPem(publicKey.ToCharArray());

var key = new RsaSecurityKey(rsa);

// 1.4 thêm vào builder
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false, // kiểm tra ai/web nào phát hành
                        ValidateAudience = false, // jwt có "aud": "device_service" nếu bật nghĩa là server này cần kt
                        ValidateLifetime = true, // là "exp": 1712345678
                        ValidateIssuerSigningKey = true, // kiểm tra Token có được ký bằng đúng private key không?
                        IssuerSigningKey = key, // là public key
                        ValidAlgorithms = [SecurityAlgorithms.RsaSha256], // đây là RS256
                        
                        RoleClaimType = "role", 
                        NameClaimType = "sub"
                    };
                });
builder.Services.AddAuthorization();


// 2 đăng ký DbConText với database
var connectionString = Environment.GetEnvironmentVariable("SUPABASE_CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString)) throw new Exception("SUPABASE_CONNECTION_STRING not found");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString) );
    
// 3 khác
builder.Services.AddScoped<DeviceService>();
builder.Services.AddControllers(); // đăng ký controller, cho phép dùng [ApiController]


var app = builder.Build();// tạo instance chính thức cho ứng dụng
app.MapControllers(); //map tất cả controller vào routing system
app.Run();
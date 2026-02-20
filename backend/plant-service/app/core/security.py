from jose import jwt, JWTError #jwt để decode, JWTError bắt lỗi, token sai, hết hạn
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

security = HTTPBearer()

PUBLIC_KEY = os.getenv("JWT_PUBLIC_KEY")
if not PUBLIC_KEY:
    raise RuntimeError("JWT_PUBLIC_KEY missing")


# code hàm get user để lấy và kiểm tra token có hợp lệ ko, dùng cho cả user và admin
async def get_current_user( credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try: 
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])

        return payload # chứa sub, role, exp mà auth-service code
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
async def get_current_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
    return user # user này có role là admin
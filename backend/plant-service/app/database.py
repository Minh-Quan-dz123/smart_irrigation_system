#file dùng để kết nối supabase
from supabase import create_client # hàm create_client để tạo kết nối tới supabase
from config import SUPABASE_URL, SUPABASE_KEY # đọc biến từ file config.py

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
# tạo kết nối , tạo client và tao có thể sau đó dùng các hàm thao tác
import os # os là module có sẵn của python , cho phép đọc biến môi trường
from dotenv import load_dotenv # load_dotenv là hàm của thư viện dotenv để đọc file .env 

load_dotenv() #khi hàm này chạy nó sẽ đọc file .env

SUPABASE_URL = os.getenv("SUPABASE_URL")    # gọi hàm get env đọc biến kia
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
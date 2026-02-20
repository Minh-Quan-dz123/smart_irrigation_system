from fastapi import FastAPI # FastAPI là class chính để tạo server
from routers.plant_router import plants_router

app = FastAPI() # tạo 1 instance app

app.include_router(plants_router)

@app.get("/") # cổng GET/ tạo "/" + "paht của plants_router"
def root():
    return {"message": "Server is running"}

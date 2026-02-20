from fastapi import APIRouter, status, Depends #depend là cơ chế cho phép 1 hàm A gọi hàm B trc khi chạy bằng cách "nhờ FastAPI gọi hộ"
# APIRouter chia chỏ api

from services.plant_service import PlantService
from schemas.plant_schema import PlantListResponse, PlantDetailsResponse, PlantCreate, PlantUpdate

from typing import List

# thêm middleware để xác thực
from core.security import get_current_admin


# tạo instance
plants_router = APIRouter(prefix="/plants")
plantService = PlantService()

# 1 lấy list: GET List: GET/plants/
@plants_router.get("/", response_model = List[PlantListResponse]) # tạo ra path "/plants" + "/"
async def get_all_plants():
    return await plantService.get_all_plants()


# search: GET/plants/search
@plants_router.get("/search", response_model=List[PlantListResponse])
async def search_plants(name: str):
    return await plantService.get_plants_by_name(name)


# 2 lấy 1 plant: GET by id: GET/plants/{plant_id}
@plants_router.get("/{plant_id}", response_model = PlantDetailsResponse)
async def get_plant_details(plant_id: int):
    return await plantService.get_plant_by_id(plant_id)

# 3 tạo 1 plant: Create:  POST/plants
@plants_router.post("", response_model = PlantDetailsResponse, status_code = 201)
async def create_plant(form: PlantCreate, admin=Depends(get_current_admin)):
    return await plantService.create_plant(form)

# 4 sửa thông tin của plant: PATCH/plants/{plant_id}
@plants_router.patch("/{plant_id}", response_model = PlantDetailsResponse)
async def update_plant(plant_id: int, form: PlantUpdate, admin=Depends(get_current_admin)):
    return await plantService.update_plant(plant_id, form)

#xóa plant: DELETE/plants/{plant_id}
@plants_router.delete("/{plant_id}", status_code = 200)
async def delete_plant(plant_id: int, admin=Depends(get_current_admin)):
    await plantService.delete_plant(plant_id)

from database import supabase # lấy object supabase
from fastapi import HTTPException
from schemas.plant_schema import PlantCreate, PlantDetailsResponse, PlantListResponse, PlantUpdate

#tạo class để gom các logic liên quan tới plant
class PlantService:

    # 1.1 khai báo hàm/ phương thức lấy tất cả plants
    #@staticmethod cho biết đây là hàm độc lập trong class
    async def get_all_plants(self):
        response = await supabase.table("plants").select("name, id").execute()

        if( response.error is not None) :
            raise HTTPException(status_code = 500, detail = response.error.message)

        return [PlantListResponse(**plant) for plant in response.data]
    

    #1.2 lấy plant dựa theo name
    async def get_plants_by_name(self, plantName: str):

        if not plantName.strip(): # xử lý chuỗi rỗng
            raise HTTPException(status_code=400, detail="Name must not be empty")
    
        response = await supabase.table("plants").select("name, id").ilike("name", f"%{plantName}%").execute() # tìm gần đúng, không phân biệt hoa thường

        if( response.error is not None) :
            raise HTTPException(status_code = 500, detail = response.error.message)

        return [PlantListResponse(**plant) for plant in response.data]


    # 2 lấy thông tin chi tiết của cây dựa trên id
    async def get_plant_by_id(self, plant_id: int):
        response = await supabase.table("plants").select("*").eq("id", plant_id).maybe_single().execute()
        # maybe_single() nếu ko có => trả none, single() => trả lỗi
        # nếu lỗi
        if(response.error is not None): 
            raise HTTPException(status_code = 500, detail = response.error.message)

        # nếu ko data
        if (response.data is None):
            raise HTTPException(status_code = 404, detail = "Plant not found")
        return PlantDetailsResponse(**response.data) 
    
        # dấu "**" là dictionary upacking <=> 
        # PlantResponse(
        # id=response.data["id"],
        # name=response.data["name"],
        # guide=response.data["guide"])    


    # 3 tạo plant
    async def create_plant(self, formCreate: PlantCreate):
        response = await (supabase.table("plants").insert(formCreate.model_dump()) # chuyển pydantic -> dict (dữ liệu gốc của py)
                                                    .select("*") # trả về bản ghi vừa rồi
                                                    .maybe_single().execute()
        )

        if response.error:
            raise HTTPException(status_code=500, detail=response.error.message)

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create plant")

        return PlantDetailsResponse(**response.data)

    # 4 update
    async def update_plant(self, plant_id: int, form: PlantUpdate):
        updateForm = form.model_dump(exclude_unset=True)

        if not updateForm: # bad request
            raise HTTPException(status_code=400, detail="No fields provided for update")

        response = await supabase.table("plants").update(updateForm).eq("id", plant_id).select("*").maybe_single().execute()

        if response.error:
            raise HTTPException(status_code=500, detail=response.error.message)

        if response.data is None:
            raise HTTPException(status_code=404, detail="Plant not found")

        return PlantDetailsResponse(**response.data)


    async def delete_plant(self, plant_id: int):
        response = await supabase.table("plants").delete().eq("id", plant_id).execute()

        if response.error:
            raise HTTPException(status_code=500, detail=response.error.message)

        if not response.data:
            raise HTTPException(status_code=404, detail="Plant not found")

        return {"message": "Plant deleted successfully"}

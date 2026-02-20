from pydantic import BaseModel, Field, model_validator
# thư viện pydantic giúp kiểm tra dữ liệu, tự động parse dữ liệu JSON->object
# BaseModel là class cha mà ta phải kế thừa để tạo model riêng
from datetime import datetime

from typing import Optional
# giống dto
class PlantDetailsResponse(BaseModel):
    id: int
    name: str
    guide: str

    upper_humidity_limit: float
    optimal_humidity: float
    lower_humidity_limit: float

    upper_temperature_limit: float
    optimal_temperature: float
    lower_temperature_limit: float

    upper_soil_limit: float
    optimal_soil: float
    lower_soil_limit: float

    created_at: datetime
    updated_at: datetime

class PlantListResponse(BaseModel):
    id: int
    name: str


class PlantCreate(BaseModel):

    # đc gửi thêm field nhưng mình chỉ lọc ra các trường cần thiết
    model_config = {
        "extra": "ignore"
    }

    name: str = Field(..., min_length = 2, max_length = 150)
    guide: str =Field(..., max_length = 2000)

    upper_humidity_limit: float = Field(..., ge=-60, le=100)
    optimal_humidity: float = Field(..., ge=-60, le=100)
    lower_humidity_limit: float = Field(..., ge=-60, le=100)

    upper_temperature_limit: float = Field(..., ge=-60, le=100)
    optimal_temperature: float = Field(..., ge=-60, le=100)
    lower_temperature_limit: float = Field(..., ge=-60, le=100)

    upper_soil_limit: float = Field(..., ge=-60, le=100)
    optimal_soil: float = Field(..., ge=-60, le=100)
    lower_soil_limit: float = Field(..., ge=-60, le=100)

    # thêm kiểm tra
    @model_validator(mode = "after")
    def validate_limits(self):
        errors = []

        if not (self.upper_humidity_limit > self.optimal_humidity > self.lower_humidity_limit):
            errors.append("Humidity limits không hợp lệ")

        if not (self.upper_temperature_limit > self.optimal_temperature > self.lower_temperature_limit):
            errors.append("Temperature limits không hợp lệ")

        if not (self.upper_soil_limit > self.optimal_soil > self.lower_soil_limit):
            errors.append("Soil limits không hợp lệ")

        if errors:
            raise ValueError(", " .join(errors))

        return self
    

class PlantUpdate(BaseModel):
    model_config = {
        "extra": "ignore"
    }
    
    name: Optional[str] = None
    guide: Optional[str] = None

    upper_humidity_limit: Optional[float] = Field(None, ge=-60, le=100)
    optimal_humidity: Optional[float] = Field(None, ge=-60, le=100)
    lower_humidity_limit: Optional[float] = Field(None, ge=-60, le=100)

    upper_temperature_limit: Optional[float] = Field(None, ge=-60, le=100)
    optimal_temperature: Optional[float] = Field(None, ge=-60, le=100)
    lower_temperature_limit: Optional[float] = Field(None, ge=-60, le=100)

    upper_soil_limit: Optional[float] = Field(None, ge=-60, le=100)
    optimal_soil: Optional[float] = Field(None, ge=-60, le=100)
    lower_soil_limit: Optional[float] = Field(None, ge=-60, le=100)

    @model_validator(mode="after")
    def validate_groups(self):
        self._validate_group(
            self.upper_humidity_limit,
            self.optimal_humidity,
            self.lower_humidity_limit,
            "humidity"
        )

        self._validate_group(
            self.upper_temperature_limit,
            self.optimal_temperature,
            self.lower_temperature_limit,
            "temperature"
        )

        self._validate_group(
            self.upper_soil_limit,
            self.optimal_soil,
            self.lower_soil_limit,
            "soil"
        )

        return self

    def _validate_group(self, upper, optimal, lower, group_name):
        values = [upper, optimal, lower]
        provided = [v is not None for v in values]

        if any(provided) and not all(provided):
            raise ValueError(
                f"If updating {group_name}, you must provide upper, optimal and lower values."
            )

        if all(provided):
            if not (lower < optimal < upper):
                raise ValueError(
                    f"{group_name} must satisfy lower < optimal < upper."
                )
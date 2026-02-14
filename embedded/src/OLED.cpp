#include "OLED.h"

Adafruit_SSD1306 Display_Oled(128,64,&Wire,-1);

void OLED_SET()
{
  
  // kết nối với OLED
  if(!Display_Oled.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  {
    Serial.println(F("Khong the khoi tao OLED!"));
  }
  else
  {
    Display_Oled.clearDisplay(); //xóa màn hình ban đầu;
    Display_Oled.setTextSize(1); // cài đặt kích thước chữ
    Display_Oled.setTextColor(SSD1306_WHITE);

    Display_Oled.setCursor(1,0); // vị trí bắt đầu chữ
    Display_Oled.println("Ta Minh Quan 20225386");

    Display_Oled.display();
  }
}

// in ra thời gian hiện tại
void OledPrint_Infor(uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t minute, uint8_t second,
    uint8_t status,
    String device_id,
    String wifi_ssid)
{
    /*
Ta Minh Quan 20225386
2026-02-14
Time: 21:45:30
Status: Connected
WiFi: MyWifi
ID: abc123
*/
    Display_Oled.fillRect(0, 16, 128, 48, SSD1306_BLACK); // xóa phần thông tin cũ đi, để in thông tin mới lên

    // dòng ngày
    Display_Oled.setCursor(0,16);
    Display_Oled.printf("%04d-%02d-%02d", year, month, day);

    // dòng giờ
    Display_Oled.setCursor(0,26);
    Display_Oled.printf("Time: %02d:%02d:%02d", hour, minute, second);

    // status
    Display_Oled.setCursor(0,36);

    Display_Oled.printf("Status: %d", status);

    // wifi
    Display_Oled.setCursor(0,46);
    Display_Oled.print("WiFi: ");
    Display_Oled.print(wifi_ssid);

    // device_id
    Display_Oled.setCursor(0,56);
    Display_Oled.print("ID: ");

    if(device_id.length() > 20) Display_Oled.print(device_id.substring(0,20)); // nếu id quá dài thì chỉ in 20 ký tự đầu
    else Display_Oled.print(device_id);

    Display_Oled.display();
    
}





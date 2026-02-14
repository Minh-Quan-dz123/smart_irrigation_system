#include "config.h" // thư viện chứa các cấu hình

uint32_t t_check = millis();// biến chạy thời gian hệ thống
uint32_t t_pump = millis(); // biến chạy thời gian tưới
uint32_t t_mqtt = millis(); // biến chạy thời gian để gửi dữ liệu
uint32_t t_connectHiveMQ = millis(); // biến chạy thời gian để kết nối HiveMQ
uint32_t t_connectWifi = millis(); // biến chạy thời gian để kết nối wifi
uint32_t TIME_ON_PUMP = 0; // thời gian tưới, đơn vị ms giây
int8_t CYCLE = 10;

void setup() {
  // gọi setup cấu hình
  beginConfig();
}

void loop() {

  // 1 if kiểm tra hệ thống đang tưới cây không
  if(pumpStatus == false) // ko tưới cây
  {
    // kiểm tra đã qua 1 giây chưa
    if(millis() - t_check >= 1000)
    {
      t_check = millis();
      CYCLE--;
      if(CYCLE < 0) CYCLE = 0;
      DateTime now = rtc.now();   // đọc thời gian hiện tại

      Serial.print(now.year());
      Serial.print("-");
      Serial.print(now.month());
      Serial.print("-");
      Serial.print(now.day());
      Serial.print("  { thu: ");

      Serial.print(now.dayOfTheWeek()); Serial.print("} ");

      Serial.print(now.hour());
      Serial.print(":");
      Serial.print(now.minute());
      Serial.print(":");
      Serial.println(now.second());
      Serial.print("status = ");
      Serial.println(status);

      // kiểm tra đang ở trạng thái tưới nào
      if(status == 1) // tưới cây theo lịch
      {
        printSchedules();
        // đã đến giờ tưới chưa
        if(checkIsTimeSchedule())
        {
          Serial.println("dang tuoi cay");
          pumpStatus = true;
          TIME_ON_PUMP = wateringDuration*1000;
          t_pump = millis();
          turnOnPump();// bật máy bơm
          Serial.print("temp: "); Serial.print(temp);
          Serial.print("  , humi: "); Serial.print(humi);
          Serial.print("  , soil: "); Serial.println(soil);

          writeLog(status, wateringDuration, now.minute(), now.second());
        }
      }
      else if(status == 2) // theo độ chịu hạn
      {
        // T-- và kiểm tra
        if(getTemp() == 0 || getHum() == 0) initDHT();
        if(getSoil() == 0) initSoil();

        if(checkSoil(getSoil()) && CYCLE <= 0) // đã khô và đã qua 10 giây chưa tưới cây lần trước
        {
          pumpStatus = true;
          TIME_ON_PUMP = wateringDuration*1000;
          t_pump = millis();
          turnOnPump();// bật máy bơm
          Serial.println("dang tuoi cay");
          Serial.print("temp: "); Serial.print(temp);
          Serial.print(",humi: "); Serial.print(humi);
          Serial.print(",soil: "); Serial.println(soil);
          writeLog(status, wateringDuration, now.minute(), now.second());
        }
      }
      else if(status == 3) // bấm tưới ngay
      {
        pumpStatus = true;
        TIME_ON_PUMP = wateringDuration*1000;
        t_pump = millis();
        turnOnPump();// bật máy bơm
        Serial.println("dang tuoi cay");
        writeLog(status, wateringDuration, now.minute(), now.second());
      }
      // in ra oled
      OledPrint_Infor(now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second(),
      status,
      deviceIdentity.deviceId,
      wifi_ssid);
    
    }
  }

  // 1 else kiểm tra hệ thống đang tưới cây ko - có
  else
  {
    if(emerTurnOff == false)// tắt khẩn cấp chưa hoạt động
    {
      // kiểm tra đã hết thời gian tưới chưa
      if(millis() - t_pump >= TIME_ON_PUMP)
      {
        CYCLE = 10;
        Serial.println("may bom da tat");
        pumpStatus = false;
        turnOffPump(); // tắt máy bơm
        if(status == 3) status = 0; // tắt tưới ngay
        
      }
      else// chưa tưới xong
      {
        delay(50);
        return;
      }
    }
    else //= true
    {
      emerTurnOff = false;
      CYCLE = 10;
      Serial.println("may bom da tat");
      pumpStatus = false;
      turnOffPump(); // tắt máy bơm
      if(status == 3) status = 0; // tắt tưới ngay
    }
    
  }
  

  // 2 kiểm tra kết nối wifi, 10 giây 1 lần
  if(millis() - t_connectWifi >= 10000)
  {
    t_connectWifi = millis();
    if(WiFi.status() != WL_CONNECTED) 
    {
      reconnectWifi();
    }
  }

  // 3 kiểm tra kết nối HiveMQ, 10 giây 1 lần kiểm tra
  if(millis() - t_connectHiveMQ >= 10000)
  {
    t_connectHiveMQ = millis();
    if(!client.connected()) reconnectMQTT();
  }
  client.poll(); // nhận message và gọi callback

  // 4 gửi dữ liệu tới MQTT sau 3 giây
  if(millis() - t_mqtt >= 3000 && WiFi.status() == WL_CONNECTED && client.connected())
  {
    t_mqtt = millis();
    float tem = getTemp();
    float hum = getHum();
    float soi = getSoil();
    if(tem == 0 || hum == 0) initDHT();// nếu có lỗi gì đó
    if(soi == 0) initSoil();
    sendDataToHiveMQ(tem,hum,soi);
  }

  delay(20);
}

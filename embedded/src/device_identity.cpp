#include "device_identity.h"

#define DEVICE_IDENTITY_FILE "/device_identity.json"

DeviceIdentity deviceIdentity;


void loadDeviceIdentity()
{
    if (!LittleFS.begin())
    {
        Serial.println("loi begin LittleFS trong loadDeviceIdentity");
        return;
    }

    // nếu ko có file thì reset về rỗng
    if (!LittleFS.exists(DEVICE_IDENTITY_FILE))
    {
        Serial.println("device_identity.json ko tim thay");
        
        // reset về rỗng
        deviceIdentity.deviceName = "Node MCU ESP8266 Device";
        deviceIdentity.deviceId = "0001"; // mặc định nếu chưa có thì đặt 1 id tĩnh, sau này có thể thay đổi bằng cách gọi saveDeviceIdentity() sau khi chỉnh sửa deviceIdentity trong RAM
        deviceIdentity.deviceSecret = "";

        return;
    }

    // nếu có file rồi thì đọc thôi
    File file = LittleFS.open(DEVICE_IDENTITY_FILE, "r");

    if (!file)
    {
        Serial.println("ko mo duoc file device_identity.json");
        return;
    }

    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, file);
    file.close();
    if (error)
    {
        Serial.println("ko chuyen duoc device_identity.json");
        return;
    }

    // đọc và gán vào biến toan cuc
    deviceIdentity.deviceName   = doc["deviceName"]   | "";
    deviceIdentity.deviceId     = doc["deviceId"]     | "";
    deviceIdentity.deviceSecret = doc["deviceSecret"] | "";

    Serial.println("Device identity da duoc load:");
    Serial.println(deviceIdentity.deviceName);
    Serial.println(deviceIdentity.deviceId);
    Serial.println(deviceIdentity.deviceSecret);
}


//Save device identity từ ram vào flash

void saveDeviceIdentity()
{
    if (!LittleFS.begin())
    {
        Serial.println("LittleFS ko mo duoc trong saveDeviceIdentity");
        return;
    }

    File file = LittleFS.open(DEVICE_IDENTITY_FILE, "w");
    if (!file)
    {
        Serial.println("ko mo duoc file device_identity.json de ghi");
        return;
    }

    // gán deviceIdentity vào JSON rồi serialize vào file
    JsonDocument doc;
    doc["deviceName"]   = deviceIdentity.deviceName;
    doc["deviceId"]     = deviceIdentity.deviceId;
    doc["deviceSecret"] = deviceIdentity.deviceSecret;

    if (serializeJson(doc, file) == 0)
    {
        Serial.println("ko ghi duoc device_identity.json");
    }
    else
    {
        Serial.println("Device identity da luu");
    }

    file.close();
}

#ifndef DEVICE_IDENTITY_H
#define DEVICE_IDENTITY_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <LittleFS.h>

struct DeviceIdentity
{
  String deviceName;
  String deviceId;
  String deviceSecret;
};

extern DeviceIdentity deviceIdentity;

void loadDeviceIdentity(); // load device identity từ flash vào RAM
void saveDeviceIdentity(); // lưu device identity từ RAM vào flash

#endif
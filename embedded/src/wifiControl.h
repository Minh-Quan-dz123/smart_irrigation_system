#ifndef WIFICONTROL_H
#define WIFICONTROL_H

#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <ESP8266WebServer.h>
#include <LittleFS.h>
#include "device_identity.h"


extern String wifi_ssid;
extern String wifi_pass;
extern String device_secret;

void setWifi();// kết nối wifi
void reconnectWifi(); // nếu lỡ đang kết nối mà xịt thì kiểm tra và gọi lại
void saveWifiConfig(); // lưu wifi vào flash
void loadWifiConfig(); // load wifi từ flash
#endif
#ifndef OLED_H
#define OLED_H
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


extern Adafruit_SSD1306 Display_Oled;

void OLED_SET();
void OledPrint_Infor(uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t minute, uint8_t second,
    uint8_t status,
    String device_id,
    String wifi_ssid);

#endif
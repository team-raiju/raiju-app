import { Component } from "@angular/core";
import { RaijuService } from "src/app/services/raiju.service";

@Component({
  selector: "app-config-tab",
  templateUrl: "./config-tab.page.html",
  styleUrls: ["./config-tab.page.scss"],
})
export class ConfigTabPage {
  distanceSensors = ["L", "FL", "F", "FR", "R"];
  lineSensors = ["FL", "FR", "BL", "BR"];

  private distanceSensorMask = new Map([
    ["L", 0b00001],
    ["FL", 0b00010],
    ["F", 0b00100],
    ["FR", 0b01000],
    ["R", 0b10000],
  ]);

  private lineSensorMask = new Map([
    ["FL", 0b0001],
    ["FR", 0b0010],
    ["BL", 0b0100],
    ["BR", 0b1000],
  ]);

  constructor(private raijuService: RaijuService) {}

  get maxMotorSpeed() {
    return this.raijuService.botState.maxMotorSpeed;
  }

  set maxMotorSpeed(v: number) {
    this.raijuService.botState.maxMotorSpeed = v;
  }

  get reverseSpeed() {
    return this.raijuService.botState.reverseSpeed;
  }

  set reverseSpeed(v: number) {
    this.raijuService.botState.reverseSpeed = v;
  }

  get reverseTime() {
    return this.raijuService.botState.reverseTimeMs;
  }

  set reverseTime(v: number) {
    this.raijuService.botState.reverseTimeMs = v;
  }

  get turnSpeed() {
    return this.raijuService.botState.turnSpeed;
  }

  set turnSpeed(v: number) {
    this.raijuService.botState.turnSpeed = v;
  }

  get turnTime() {
    return this.raijuService.botState.turnTimeMs;
  }

  set turnTime(v: number) {
    this.raijuService.botState.turnTimeMs = v;
  }

  get stepWaitTime() {
    return this.raijuService.botState.stepWaitTimeMs;
  }

  set stepWaitTime(v: number) {
    this.raijuService.botState.stepWaitTimeMs = v;
  }

  toggleDistanceSensor(sensor: string) {
    this.raijuService.botState.enabledDistanceSensors ^= this.distanceSensorMask.get(sensor);
  }

  isDistanceSensorEnabled(sensor: string): boolean {
    return (this.raijuService.botState.enabledDistanceSensors & this.distanceSensorMask.get(sensor)) !== 0;
  }

  toggleLineSensor(sensor: string) {
    this.raijuService.botState.enabledLineSensors ^= this.lineSensorMask.get(sensor);
  }

  isLineSensorEnabled(sensor: string): boolean {
    return (this.raijuService.botState.enabledLineSensors & this.lineSensorMask.get(sensor)) !== 0;
  }
}

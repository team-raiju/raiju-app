import { Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { LoggingService } from "src/app/services/logging.service";
import { RaijuService } from "src/app/services/raiju.service";

@Component({
  selector: "app-config-tab",
  templateUrl: "./config-tab.page.html",
  styleUrls: ["./config-tab.page.scss"],
})
export class ConfigTabPage {
  readonly distanceSensors = ["L", "FL", "DL", "F", "DR", "FR", "R"];
  readonly lineSensors = ["FL", "FR", "BL", "BR"];

  // This must match src/services/DistanceService.cpp in raiju-cpp
  private readonly distanceSensorMask = new Map([
    ["L", 1 << 0],
    ["FL", 1 << 1],
    ["DL", 1 << 2],
    ["F", 1 << 3],
    ["DR", 1 << 4],
    ["FR", 1 << 5],
    ["R", 1 << 6],
  ]);

  // This must match src/services/LineService.cpp in raiju-cpp
  private readonly lineSensorMask = new Map([
    ["FL", 1 << 0],
    ["FR", 1 << 1],
    ["BL", 1 << 2],
    ["BR", 1 << 3],
  ]);

  constructor(private raijuService: RaijuService, private toastController: ToastController, private logger: LoggingService) {}

  get maxMotorSpeed() {
    return this.raijuService.config.maxMotorSpeed;
  }

  set maxMotorSpeed(v: number) {
    this.raijuService.config.maxMotorSpeed = v;
  }

  get reverseSpeed() {
    return this.raijuService.config.reverseSpeed;
  }

  set reverseSpeed(v: number) {
    this.raijuService.config.reverseSpeed = v;
  }

  get reverseTime() {
    return this.raijuService.config.reverseTimeMs;
  }

  set reverseTime(v: number) {
    this.raijuService.config.reverseTimeMs = v;
  }

  get turnSpeed() {
    return this.raijuService.config.turnSpeed;
  }

  set turnSpeed(v: number) {
    this.raijuService.config.turnSpeed = v;
  }

  get turnTime() {
    return this.raijuService.config.turnTimeMs;
  }

  set turnTime(v: number) {
    this.raijuService.config.turnTimeMs = v;
  }

  get stepWaitTime() {
    return this.raijuService.config.stepWaitTimeMs;
  }

  set stepWaitTime(v: number) {
    this.raijuService.config.stepWaitTimeMs = v;
  }

  toggleDistanceSensor(sensor: string) {
    this.raijuService.config.enabledDistanceSensors ^= this.distanceSensorMask.get(sensor);
  }

  isDistanceSensorEnabled(sensor: string): boolean {
    return (this.raijuService.config.enabledDistanceSensors & this.distanceSensorMask.get(sensor)) !== 0;
  }

  toggleLineSensor(sensor: string) {
    this.raijuService.config.enabledLineSensors ^= this.lineSensorMask.get(sensor);
  }

  isLineSensorEnabled(sensor: string): boolean {
    return (this.raijuService.config.enabledLineSensors & this.lineSensorMask.get(sensor)) !== 0;
  }

  async sendData() {
    try {
      await this.raijuService.applyConfig();
    } catch (e) {
      this.logger.error(`sendStrategies: ${e}`);
      void (e && this.showToast(JSON.stringify(e)));
    }
  }

  async saveConfig() {
    await this.raijuService.saveConfig();
  }

  private showToast(msg: string) {
    this.toastController
      .create({
        message: msg,
        duration: 1700,
      })
      .then((toast) => toast.present())
      .catch((e) => {
        this.logger.error(`Error showing toast ${e}`);
        throw e;
      });
  }
}

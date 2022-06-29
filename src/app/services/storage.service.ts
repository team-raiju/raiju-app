import { Injectable } from "@angular/core";
import { Storage } from "@capacitor/storage";
import { Strategy } from "../model/strategy";
import { RaijuConfig } from "./raiju.service";

enum StorageKeys {
  knownDeviceIds = "KNOWN_BLE_DEVICE_IDS",
  strategies = "STRATEGIES",
  config = "CONFIG",
}

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private knownDevices: string[] = [];
  private botConfig: RaijuConfig;

  constructor() {}

  public addKnownDevice(id: string) {
    if (!this.knownDevices.includes(id)) {
      this.knownDevices.push(id);
      this.setValue(StorageKeys.knownDeviceIds, this.knownDevices).catch((e) => console.error("addStrategy", e));
    }
  }

  public setRaijuConfig(config: RaijuConfig) {
    this.botConfig = { ...config };
    this.setValue(StorageKeys.config, this.botConfig).catch((e) => console.error("setConfig", e));
  }

  public async getKnowDevices() {
    if (this.knownDevices.length === 0) {
      this.knownDevices = await this.getValue<string[]>(StorageKeys.knownDeviceIds);
    }

    return [...this.knownDevices];
  }

  public async getRaijuConfig() {
    if (this.botConfig == null) {
      this.botConfig = await this.getValue<RaijuConfig>(StorageKeys.config);
    }

    return this.botConfig && { ...this.botConfig };
  }

  private async getValue<T>(key: StorageKeys): Promise<T> {
    const { value } = await Storage.get({ key });

    return JSON.parse(value) as T;
  }

  private async setValue<T>(key: StorageKeys, value: T) {
    await Storage.set({
      key,
      value: JSON.stringify(value),
    });
  }
}

import { Injectable } from "@angular/core";
import { Storage } from "@capacitor/storage";
import { Strategy } from "../model/strategy";

enum StorageKeys {
  knownDeviceIds = "KNOWN_BLE_DEVICE_IDS",
  strategies = "STRATEGIES",
}

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private readonly defaultStrategies: Strategy[] = [new Strategy(0x01, "little steps"), new Strategy(0x02, "star")];

  private strategies: Strategy[] = [];
  private knownDevices: string[] = [];

  constructor() {}

  public addKnownDevice(id: string) {
    if (!this.knownDevices.includes(id)) {
      this.knownDevices.push(id);
      this.setValue(StorageKeys.knownDeviceIds, this.knownDevices).catch((e) => console.error("addStrategy", e));
    }
  }

  public addStrategy(id: number, name: string) {
    const idx = this.strategies.findIndex((v) => v.id === id);

    if (idx === -1) {
      this.strategies.push(new Strategy(id, name));
    } else {
      this.strategies[idx].name = name;
    }

    this.setValue(StorageKeys.strategies, this.strategies).catch((e) => console.error("addStrategy", e));
  }

  public async getKnowDevices() {
    if (this.knownDevices.length === 0) {
      this.knownDevices = await this.getValue<string[]>(StorageKeys.knownDeviceIds);
    }

    return [...this.knownDevices];
  }

  public async getStrategies() {
    if (this.strategies.length === 0) {
      this.strategies = await this.getValue<Strategy[]>(StorageKeys.strategies);
      if (this.strategies.length === 0) {
        this.strategies = [...this.defaultStrategies];
        await this.setValue(StorageKeys.strategies, this.strategies);
      }
    }

    return [...this.strategies];
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

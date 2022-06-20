import { Injectable } from "@angular/core";
import {
  BleClient,
  BleDevice,
  dataViewToHexString,
  dataViewToText,
  numbersToDataView,
} from "@capacitor-community/bluetooth-le";
import { StorageService } from "./storage.service";

const RXTX_SERVICE = "0000ffe0-0000-1000-8000-00805f9b34fb";
const RXTX_CHARACTERISTIC = "0000ffe1-0000-1000-8000-00805f9b34fb";

@Injectable({
  providedIn: "root",
})
export class BluetoothService {
  // private scanresults: ScanResult[] = [];
  private connectedDevice?: BleDevice = null;

  constructor(private storageService: StorageService) {}

  private get deviceId() {
    return this.connectedDevice?.deviceId;
  }

  async searchAndConnect(onMessage: (v: string) => void = null, onDisconnect: (id: string) => void = null) {
    try {
      console.log("initializing ble client ");
      await BleClient.initialize();

      console.log("scanning devices");
      this.connectedDevice = await BleClient.requestDevice({
        services: [RXTX_SERVICE],
      });

      console.log("connecting to:", this.deviceId, this.connectedDevice.name);
      await BleClient.connect(this.deviceId, onDisconnect);

      console.log("connected to:", this.deviceId, this.connectedDevice.name);
      this.storageService.addKnownDevice(this.deviceId);

      await BleClient.startNotifications(this.deviceId, RXTX_SERVICE, RXTX_CHARACTERISTIC, (v) => {
        if (onMessage) {
          onMessage(dataViewToText(v));
        }
      });
    } catch (e) {
      await this.disconnect();
      throw e;
    }
  }

  async send(byte: number[]) {
    console.log(`sending byte ${byte}`);
    await BleClient.write(this.deviceId, RXTX_SERVICE, RXTX_CHARACTERISTIC, numbersToDataView(byte));
  }

  async disconnect() {
    if (this.deviceId == null) {
      return;
    }

    try {
      await BleClient.stopNotifications(this.deviceId, RXTX_SERVICE, RXTX_CHARACTERISTIC);
      await BleClient.disconnect(this.deviceId);
    } finally {
      this.connectedDevice = null;
    }
  }

  isConnected() {
    return this.connectedDevice != null;
  }
}

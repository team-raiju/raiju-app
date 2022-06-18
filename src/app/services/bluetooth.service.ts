import { Injectable } from "@angular/core";
import { BleClient, BleDevice, numbersToDataView, ScanResult } from "@capacitor-community/bluetooth-le";

const RXTX_SERVICE = "0000ffe0-0000-1000-8000-00805f9b34fb";
const RXTX_CHARACTERISTIC = "0000ffe1-0000-1000-8000-00805f9b34fb";

@Injectable({
  providedIn: "root",
})
export class BluetoothService {
  // private scanresults: ScanResult[] = [];
  private connectedDevice: BleDevice = null;
  private isScanning = false;

  constructor() {}

  private get deviceId() {
    return this.connectedDevice?.deviceId;
  }

  async searchAndConnect(onDisconnect?: (id: string) => void) {
    BleClient.initialize();

    this.isScanning = true;

    this.connectedDevice = await BleClient.requestDevice({
      services: [RXTX_SERVICE],
    });

    this.isScanning = false;

    await BleClient.connect(this.deviceId, onDisconnect);
  }

  async send(byte: number) {
    console.log(`sending byte ${byte}`);

    await BleClient.write(this.deviceId, RXTX_SERVICE, RXTX_CHARACTERISTIC, numbersToDataView([byte]));
  }

  async disconnect() {
    await BleClient.disconnect(this.deviceId);
  }
}

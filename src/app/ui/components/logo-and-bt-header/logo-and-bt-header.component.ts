import { Component, EventEmitter, Output } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { BluetoothService } from "src/app/services/bluetooth.service";
import { RaijuService } from "src/app/services/raiju.service";

@Component({
  selector: "app-logo-and-bt-header",
  templateUrl: "./logo-and-bt-header.component.html",
  styleUrls: ["./logo-and-bt-header.component.scss"],
})
export class LogoAndBtHeaderComponent {
  constructor(private toastController: ToastController, private raijuService: RaijuService) {}

  get isConnected() {
    return this.raijuService.isConnected;
  }

  async connect() {
    try {
      await this.raijuService.connectToRobot();
    } catch (e) {
      console.error("raijuService.connectToRobot", e as Error);
      this.showToast("error on connectToRobot: " + JSON.stringify(e));
    }
  }

  private showToast(msg: string) {
    this.toastController
      .create({
        message: msg,
        duration: 1700,
      })
      .then((toast) => toast.present())
      .catch((e) => {
        console.log("Error showing toast", e);
        throw e;
      });
  }
}

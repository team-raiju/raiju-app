import { Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { BluetoothService } from "src/app/services/bluetooth.service";

@Component({
  selector: "app-strategy-tab",
  templateUrl: "strategy-tab.page.html",
  styleUrls: ["strategy-tab.page.scss"],
})
export class StrategyTabComponent {
  readonly strategies: string[] = ["little steps", "star"];
  selectedPreStrategy = "";
  selectedStrategy = "";
  isConnected = false;

  constructor(private bleService: BluetoothService, private toastController: ToastController) {}

  async test() {
    console.log("testing...");

    try {
      await this.bleService.searchAndConnect((id) => {
        this.isConnected = false;
        console.log(`Disconnected from ${id}`);
        this.toastController
          .create({
            message: "Disconnected from device!",
            duration: 1700,
          })
          .then((toast) => toast.present());
      });
      this.isConnected = true;
    } catch (e) {
      console.error(e as Error);
      const toast = await this.toastController.create({
        message: JSON.stringify(e),
        duration: 2000,
      });
      toast.present();
    }
  }

  async send() {
    try {
      await this.bleService.send(this.strategies.indexOf(this.selectedStrategy));
    } catch (e) {
      console.error(e as Error);
      const toast = await this.toastController.create({
        message: JSON.stringify(e),
        duration: 2000,
      });
      toast.present();
    }
  }

  onSelectPreStrategy(event: CustomEvent<{ value: string }>) {
    console.log("selected pre-strategy", event.detail.value);
    this.selectedPreStrategy = event.detail.value;
  }

  onSelectStrategy(event: CustomEvent<{ value: string }>) {
    console.log("selected strategy", event.detail.value);
    this.selectedStrategy = event.detail.value;
  }
}

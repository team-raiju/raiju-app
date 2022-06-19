import { ChangeDetectorRef, Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { Strategy } from "src/app/model/strategy";
import { BluetoothService } from "src/app/services/bluetooth.service";

@Component({
  selector: "app-strategy-tab",
  templateUrl: "strategy-tab.page.html",
  styleUrls: ["strategy-tab.page.scss"],
})
export class StrategyTabComponent {
  readonly strategies: Strategy[] = [new Strategy(0x01, "little steps"), new Strategy(0x02, "star")];
  selectedPreStrategyId = 0;
  selectedStrategyId = 0;

  currentState: string = null;
  currentPreStrategy: string = null;
  currentStrategy: string = null;

  constructor(
    private bleService: BluetoothService,
    private toastController: ToastController,
    private changeDetector: ChangeDetectorRef
  ) {}

  get isConnected() {
    return this.bleService.isConnected();
  }

  async test() {
    try {
      if (this.isConnected) {
        await this.bleService.disconnect();
        return;
      }

      await this.bleService.searchAndConnect(
        (message) => this.parseMessage(message),
        (id) => {
          console.log(`Disconnected from ${id}`);
          this.showToast("Disconnected from device!");
        }
      );
    } catch (e) {
      console.error("bleService.searchAndConnect", e as Error);
      void (e && this.showToast(JSON.stringify(e)));
    }
  }

  async sendStrategies() {
    try {
      await this.bleService.send([this.selectedPreStrategyId, this.selectedStrategyId]);
    } catch (e) {
      console.error("bleService.send", e as Error);
      void (e && this.showToast(JSON.stringify(e)));
    }
  }

  onSelectPreStrategy(event: CustomEvent<{ value: number }>) {
    console.log("selected pre-strategy", event.detail.value);
    this.selectedPreStrategyId = event.detail.value;
  }

  onSelectStrategy(event: CustomEvent<{ value: number }>) {
    console.log("selected strategy", event.detail.value);
    this.selectedStrategyId = event.detail.value;
  }

  private parseMessage(message: string) {
    console.log("Message received", message);

    if (!message.includes(":")) {
      console.warn(`Receive invalid message: ${message}`);
      return;
    }

    const [type, ...value] = message.split(":");

    if (type === "state") {
      this.currentState = value[0];
    } else if (type === "str") {
      this.currentPreStrategy = this.strategies.find((s) => s.id === parseInt(value[0], 10))?.name;
      this.currentStrategy = this.strategies.find((s) => s.id === parseInt(value[1], 10))?.name;
    } else {
      console.warn(`Receive invalid message: ${message}`);
      return;
    }

    this.changeDetector.detectChanges();
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

import { ChangeDetectorRef, Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { Strategy } from "src/app/model/strategy";
import { BotState, RaijuService } from "src/app/services/raiju.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "app-strategy-tab",
  templateUrl: "strategy-tab.page.html",
  styleUrls: ["strategy-tab.page.scss"],
})
export class StrategyTabPage {
  strategies: Strategy[] = [];
  selectedPreStrategyId = 0;
  selectedStrategyId = 0;

  botState: BotState;
  currentPreStrategy: string = null;
  currentStrategy: string = null;

  constructor(
    private toastController: ToastController,
    private raijuService: RaijuService,
    private storageService: StorageService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.storageService
      .getStrategies()
      .then((s) => (this.strategies = s))
      .catch((e) => console.error("StrategyTabComponent()", e));

    this.raijuService.subscribe((state: BotState) => {
      this.botState = { ...state };
      this.currentPreStrategy = this.strategies.find((s) => s.id === state.preStrategy)?.name;
      this.currentStrategy = this.strategies.find((s) => s.id === state.strategy)?.name;

      this.changeDetector.detectChanges();
    });
  }

  get isConnected() {
    return this.raijuService.isConnected;
  }

  async sendStrategies() {
    try {
      await this.raijuService.applyConfig();
    } catch (e) {
      console.error("sendStrategies", e as Error);
      void (e && this.showToast(JSON.stringify(e)));
    }
  }

  async requestInfo() {
    console.log(this.raijuService.config);
    return;
  }

  onSelectPreStrategy(event: any) {
    console.log("selected pre-strategy", event.detail.value);
    this.raijuService.config.preStrategy = event.detail.value;
  }

  onSelectStrategy(event: any) {
    console.log("selected strategy", event.detail.value);
    this.raijuService.config.strategy = event.detail.value;
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

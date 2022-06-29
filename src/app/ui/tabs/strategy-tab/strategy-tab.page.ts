import { ChangeDetectorRef, Component } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { Strategy } from "src/app/model/strategy";
import { LoggingService } from "src/app/services/logging.service";
import { BotState, RaijuService } from "src/app/services/raiju.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "app-strategy-tab",
  templateUrl: "strategy-tab.page.html",
  styleUrls: ["strategy-tab.page.scss"],
})
export class StrategyTabPage {
  selectedPreStrategyId = 0;
  selectedStrategyId = 0;

  botState: BotState;
  currentPreStrategy: string = null;
  currentStrategy: string = null;

  constructor(
    private toastController: ToastController,
    private raijuService: RaijuService,
    private storageService: StorageService,
    private changeDetector: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private logger: LoggingService
  ) {
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

  get strategies() {
    return this.raijuService.strategies;
  }

  async sendStrategies() {
    try {
      await this.raijuService.applyConfig();
    } catch (e) {
      this.logger.error(`sendStrategies: ${e}`);
      void (e && this.showToast(JSON.stringify(e)));
    }
  }

  async requestInfo() {
    await this.raijuService.requestInfo();
    this.logger.info(this.raijuService.config);
    return;
  }

  onSelectPreStrategy(event: any) {
    this.logger.info(`selected pre-strategy: ${event.detail.value}`);
    this.raijuService.config.preStrategy = event.detail.value;
  }

  onSelectStrategy(event: any) {
    this.logger.info(`selected strategy: ${event.detail.value}`);
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
        this.logger.error(`Error showing toast ${e}`);
        throw e;
      });
  }
}

import { Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { ILog, LoggingService } from "src/app/services/logging.service";
import { RaijuService } from "src/app/services/raiju.service";

@Component({
  selector: "app-logo-and-bt-header",
  templateUrl: "./logo-and-bt-header.component.html",
  styleUrls: ["./logo-and-bt-header.component.scss"],
})
export class LogoAndBtHeaderComponent {
  isLogsOpen = false;

  constructor(
    private toastController: ToastController,
    private raijuService: RaijuService,
    private logger: LoggingService
  ) {}

  get isConnected() {
    return this.raijuService.isConnected;
  }

  get logs() {
    return this.logger.allLogs;
  }

  showLogs(show: boolean) {
    this.isLogsOpen = show;
  }

  onLogsClose(_ev: Event) {
    void _ev;
    this.isLogsOpen = false;
  }

  getLogBadgeColor(item: ILog) {
    switch (item.severity) {
      case "ERROR":
        return "danger";

      case "WARN":
        return "warning";

      case "INFO":
        return "primary";

      case "DEBUG":
        return "medium";

      default:
        return "primary";
    }
  }

  async connect() {
    try {
      await this.raijuService.connectToRobot();
    } catch (e) {
      this.logger.error(`raijuService.connectToRobot: ${e}`);
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
        this.logger.error(`Error showing toast ${e}`);
        throw e;
      });
  }
}

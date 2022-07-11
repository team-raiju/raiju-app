import { EventEmitter, Injectable } from "@angular/core";
import { Strategy } from "../model/strategy";
import { BluetoothService } from "./bluetooth.service";
import { LoggingService } from "./logging.service";
import { StorageService } from "./storage.service";

export type RaijuConfig = {
  enabledDistanceSensors: number;
  enabledLineSensors: number;
  reverseSpeed: number;
  reverseTimeMs: number;
  turnSpeed: number;
  turnTimeMs: number;
  stepWaitTimeMs: number;

  preStrategy: number;
  strategy: number;
  maxMotorSpeed: number;
};

export type BotState = {
  currentState: string;
} & RaijuConfig;

@Injectable({
  providedIn: "root",
})
export class RaijuService extends EventEmitter {
  botState: BotState;
  strategies: Strategy[] = [];

  config: RaijuConfig = {
    enabledDistanceSensors: 0,
    enabledLineSensors: 0,
    reverseSpeed: 0,
    reverseTimeMs: 0,
    turnSpeed: 0,
    turnTimeMs: 0,
    stepWaitTimeMs: 0,
    preStrategy: 0,
    strategy: 0,
    maxMotorSpeed: 0,
  };

  private readonly defaultConfig: RaijuConfig = {
    enabledDistanceSensors: 0xff,
    enabledLineSensors: 0xff,
    reverseSpeed: 100,
    reverseTimeMs: 50,
    turnSpeed: 100,
    turnTimeMs: 50,
    stepWaitTimeMs: 50,
    preStrategy: 0,
    strategy: 0,
    maxMotorSpeed: 100,
  };

  constructor(
    private bleService: BluetoothService,
    private storageService: StorageService,
    private logger: LoggingService
  ) {
    super();

    this.storageService
      .getRaijuConfig()
      .then((c) => {
        this.config = c ?? { ...this.defaultConfig };
        this.botState = { ...this.config, currentState: null };
      })
      .catch((e) => this.logger.error(e));
  }

  get isConnected() {
    return this.bleService.isConnected();
  }

  async connectToRobot() {
    if (this.isConnected) {
      await this.bleService.disconnect();
      return;
    }

    await this.bleService.searchAndConnect(
      (message) => this.parseMessage(message),
      (id) => {
        this.logger.warn(`Disconnected from ${id}`);
      }
    );
  }

  async saveConfig() {
    this.storageService.setRaijuConfig(this.config);
  }

  async applyConfig() {
    try {
      await this.bleService.send(this.configToPacket());
    } catch (e) {
      this.logger.error(`bleService.send: ${e}`);
    }
  }

  async sendSwapRequest() {
    this.logger.info("sending swap state request");
    try {
      const packet = this.configToPacket().map(() => 0xff);
      packet[0] = 0xfe;
      packet[1] = 0xef;

      await this.bleService.send(packet);
    } catch (e) {
      this.logger.error(`bleService.send: ${e}`);
    }
  }

  async requestInfo() {
    this.logger.info("requesting bot info");
    try {
      await this.bleService.send(this.configToPacket().map(() => 0xfe));
    } catch (e) {
      this.logger.error(`bleService.send: ${e}`);
    }
  }

  private parseMessage(message: string) {
    this.logger.info(`message received: ${message}`);

    if (!message.includes(":")) {
      this.logger.warn("received invalid message:");
      return;
    }

    const [type, ...value] = message.split(":");

    if (type === "state") {
      this.botState.currentState = value[0];
    } else if (type === "str") {
      this.botState.preStrategy = parseInt(value[0], 10);
      this.botState.strategy = parseInt(value[1], 10);
    } else if (type === "mms") {
      this.botState.maxMotorSpeed = parseInt(value[0], 10);
    } else if (type === "rev") {
      this.botState.reverseSpeed = parseInt(value[0], 10);
      this.botState.reverseTimeMs = parseInt(value[1], 10);
    } else if (type === "turn") {
      this.botState.turnSpeed = parseInt(value[0], 10);
      this.botState.turnTimeMs = parseInt(value[1], 10);
    } else if (type === "step") {
      this.botState.stepWaitTimeMs = parseInt(value[0], 10);
    } else if (type === "ss") {
      const id = parseInt(value[0], 10);
      const name = value[1];
      this.addStrategy(id, name);
    } else {
      this.logger.warn("received invalid message");
      return;
    }

    this.emit(this.botState);
  }

  private configToPacket() {
    const packet = [
      0xff,
      this.config.enabledDistanceSensors & 0xff,
      this.config.enabledLineSensors & 0xff,
      this.config.reverseSpeed & 0xff,
      this.config.reverseTimeMs & 0xff,
      this.config.turnSpeed & 0xff,
      this.config.turnTimeMs & 0xff,
      this.config.stepWaitTimeMs & 0xff,
      this.config.preStrategy & 0xff,
      this.config.strategy & 0xff,
      this.config.maxMotorSpeed & 0xff,
    ];

    const chk = packet.reduce((p, c) => p ^ c, 0);
    packet.push(chk);

    return packet;
  }

  private addStrategy(id: number, name: string) {
    const idx = this.strategies.findIndex((v) => v.id === id);

    if (idx === -1) {
      this.strategies.push(new Strategy(id, name));
    } else {
      this.strategies[idx].name = name;
    }
  }
}

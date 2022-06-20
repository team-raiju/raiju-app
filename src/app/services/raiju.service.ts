import { EventEmitter, Injectable } from "@angular/core";
import { BluetoothService } from "./bluetooth.service";

type RaijuConfig = {
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

  private config: RaijuConfig = {
    enabledDistanceSensors: 0b00011111,
    enabledLineSensors: 0b00001111,
    reverseSpeed: 100,
    reverseTimeMs: 50,
    turnSpeed: 100,
    turnTimeMs: 50,
    stepWaitTimeMs: 50,
    preStrategy: 0,
    strategy: 0,
    maxMotorSpeed: 100,
  };

  constructor(private bleService: BluetoothService) {
    super();
    this.botState = { ...this.config, currentState: null };
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
        console.log(`Disconnected from ${id}`);
      }
    );
  }

  async applyConfig() {
    await this.bleService.send(this.configToPacket());
  }

  private parseMessage(message: string) {
    console.log("message received:", message);

    if (!message.includes(":")) {
      console.warn("received invalid message:", message);
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
    } else {
      console.warn(`Receive invalid message: ${message}`);
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
}

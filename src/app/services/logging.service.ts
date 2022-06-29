import { Injectable } from "@angular/core";

export interface ILog {
  severity: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class LoggingService {
  allLogs: ILog[] = [];

  constructor() {}

  info(message: object | string) {
    if (message instanceof Object) {
      message = JSON.stringify(message);
    }

    console.log(message);
    this.allLogs.unshift({
      severity: "INFO",
      message,
    });
  }

  debug(message: object | string) {
    if (message instanceof Object) {
      message = JSON.stringify(message);
    }

    console.log(message);
    this.allLogs.unshift({
      severity: "DEBUG",
      message,
    });
  }

  error(message: object | string) {
    if (message instanceof Object) {
      message = JSON.stringify(message);
    }

    console.error(message);
    this.allLogs.unshift({
      severity: "ERROR",
      message,
    });
  }

  warn(message: object | string) {
    if (message instanceof Object) {
      message = JSON.stringify(message);
    }

    console.warn(message);
    this.allLogs.unshift({
      severity: "WARN",
      message,
    });
  }

  clear() {
    this.allLogs = [];
  }
}

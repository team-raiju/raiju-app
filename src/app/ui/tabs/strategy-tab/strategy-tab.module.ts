import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StrategyTabPage } from "./strategy-tab.page";

import { StrategyTabPageRoutingModule } from "./strategy-tab-routing.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, StrategyTabPageRoutingModule, ComponentsModule],
  declarations: [StrategyTabPage],
})
export class StrategyTabPageModule {}

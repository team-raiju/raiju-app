import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StrategyTabPage } from "./strategy-tab.page";

const routes: Routes = [
  {
    path: "",
    component: StrategyTabPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrategyTabPageRoutingModule {}

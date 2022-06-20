import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ConfigTabPage } from "./config-tab.page";

const routes: Routes = [
  {
    path: "",
    component: ConfigTabPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigTabPageRoutingModule {}

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "strategy",
        loadChildren: () => import("./strategy-tab/strategy-tab.module").then((m) => m.StrategyTabPageModule),
      },
      {
        path: "config",
        loadChildren: () => import("./config-tab/config-tab.module").then((m) => m.ConfigTabPageModule),
      },
      {
        path: "",
        redirectTo: "/tabs/strategy",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/strategy",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

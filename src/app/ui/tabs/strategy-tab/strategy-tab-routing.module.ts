import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategyTab } from './strategy-tab.page';

const routes: Routes = [
  {
    path: '',
    component: StrategyTab,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}

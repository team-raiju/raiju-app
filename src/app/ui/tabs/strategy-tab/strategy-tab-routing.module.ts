import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategyTabComponent } from './strategy-tab.page';

const routes: Routes = [
  {
    path: '',
    component: StrategyTabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrategyTabPageRoutingModule {}

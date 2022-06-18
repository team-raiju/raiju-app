import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategyTabComponent } from './strategy-tab.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { StrategyTabPageRoutingModule } from './strategy-tab-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ExploreContainerComponentModule, StrategyTabPageRoutingModule],
  declarations: [StrategyTabComponent],
})
export class StrategyTabModule {}

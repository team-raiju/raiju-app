import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StrategyTab } from './strategy-tab.page';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './strategy-tab-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ExploreContainerComponentModule, Tab1PageRoutingModule],
  declarations: [StrategyTab],
})
export class StrategyTabModule {}

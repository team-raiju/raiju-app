import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { StrategyTab } from './strategy-tab.page';

describe('Tab1Page', () => {
  let component: StrategyTab;
  let fixture: ComponentFixture<StrategyTab>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StrategyTab],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategyTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

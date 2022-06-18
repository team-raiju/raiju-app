import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../components/explore-container/explore-container.module';

import { StrategyTabComponent } from './strategy-tab.page';

describe('Tab1Page', () => {
  let component: StrategyTabComponent;
  let fixture: ComponentFixture<StrategyTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StrategyTabComponent],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

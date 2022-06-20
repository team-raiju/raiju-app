import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { LogoAndBtHeaderComponent } from "./logo-and-bt-header.component";

describe("LogoAndBtHeaderComponent", () => {
  let component: LogoAndBtHeaderComponent;
  let fixture: ComponentFixture<LogoAndBtHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LogoAndBtHeaderComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoAndBtHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { LogoAndBtHeaderComponent } from "./logo-and-bt-header/logo-and-bt-header.component";

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [LogoAndBtHeaderComponent],
  exports: [LogoAndBtHeaderComponent],
})
export class ComponentsModule {}

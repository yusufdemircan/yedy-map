import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './components/map/map.component';
import {ButtonDemoModule} from "../../fw/components/uikit/button/buttondemo.module";
import {ButtonDemoRoutingModule} from "../../fw/components/uikit/button/buttondemo-routing.module";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SplitButtonModule} from "primeng/splitbutton";
import {ToggleButtonModule} from "primeng/togglebutton";
import {InputDemoModule} from "../../fw/components/uikit/input/inputdemo.module";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
      FormsModule,
    MapRoutingModule,
    InputDemoModule,
    ButtonModule,
    RippleModule,
    SplitButtonModule,
    ToggleButtonModule,
    DropdownModule,
  ]
})
export class MapModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackingMapComponent} from './tracking-map/tracking-map.component';
import {HavacilikRoutingModule} from "./havacilik-routing.module";
import {MapModule} from "../../map/map.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {SliderModule} from "primeng/slider";
import {HavacilikService} from "./services/havacilik.service";

@NgModule({
    declarations: [
        TrackingMapComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HavacilikRoutingModule,
        MapModule,
        CheckboxModule,
        ReactiveFormsModule,
        RippleModule,
        ButtonModule,
        SliderModule
    ],
    providers:[HavacilikService]
})
export class HavacilikModule {
}

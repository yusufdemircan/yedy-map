import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackingMapComponent} from './tracking-map/tracking-map.component';
import {HavacilikRoutingModule} from "./havacilik-routing.module";
import {MapModule} from "../../map/map.module";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        TrackingMapComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HavacilikRoutingModule,
        MapModule
    ]
})
export class HavacilikModule {
}

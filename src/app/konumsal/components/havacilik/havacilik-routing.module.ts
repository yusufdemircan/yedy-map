import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackingMapComponent} from "./tracking-map/tracking-map.component";


const routes: Routes = [
    {path:'',pathMatch:'full',redirectTo:'tracking'},
    {path:'tracking',component:TrackingMapComponent},

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HavacilikRoutingModule { }

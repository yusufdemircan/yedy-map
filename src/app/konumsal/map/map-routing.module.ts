import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicMapComponent} from "./components/dynamic-map/dynamic-map.component";
import {TestMapComponent} from "./test-map/test-map.component";

const routes: Routes = [
    {path:'',pathMatch:'full',redirectTo:'dynamic'},
    {path:'dynamic',component:DynamicMapComponent},
    {path:'test',component:TestMapComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule { }

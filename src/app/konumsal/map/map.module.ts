import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MapRoutingModule} from './map-routing.module';
import {MapComponent} from './components/map/map.component';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SplitButtonModule} from "primeng/splitbutton";
import {ToggleButtonModule} from "primeng/togglebutton";
import {InputDemoModule} from "../../fw/components/uikit/input/inputdemo.module";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {DynamicMapComponent} from './components/dynamic-map/dynamic-map.component';
import { MapStatusBarComponent } from './components/map-status-bar/map-status-bar.component';
import {ToolbarModule} from "primeng/toolbar";
import {SidebarModule} from "primeng/sidebar";
import {SpeedDialModule} from "primeng/speeddial";
import {TabMenuModule} from "primeng/tabmenu";
import {DockModule} from "primeng/dock";
import {InplaceModule} from "primeng/inplace";
import {TabViewModule} from "primeng/tabview";
import {MenubarModule} from "primeng/menubar";
import {MenuModule} from "primeng/menu";
import {SlideMenuModule} from "primeng/slidemenu";
import {PanelMenuModule} from "primeng/panelmenu";
import {ListboxModule} from "primeng/listbox";
import { TestMapComponent } from './test-map/test-map.component';
import {TableModule} from "primeng/table";
import {SelectButtonModule} from "primeng/selectbutton";
import {RadioButtonModule} from "primeng/radiobutton";
import {DialogModule} from "primeng/dialog";
import {ImageModule} from "primeng/image";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";


@NgModule({
    declarations: [
        MapComponent,
        DynamicMapComponent,
        MapStatusBarComponent,
        TestMapComponent,
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
        ToolbarModule,
        SidebarModule,
        SpeedDialModule,
        TabMenuModule,
        DockModule,
        InplaceModule,
        TabViewModule,
        MenubarModule,
        MenuModule,
        SlideMenuModule,
        PanelMenuModule,
        ListboxModule,
        TableModule,
        SelectButtonModule,
        RadioButtonModule,
        DialogModule,
        ImageModule,
        InputTextModule,
        InputTextareaModule,
    ],
    exports:[MapComponent]
})

export class MapModule {
}

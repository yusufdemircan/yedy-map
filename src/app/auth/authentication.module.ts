import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoleComponent} from "./components/role/role.component";
import {AuthenticationRoutingModule} from "./authentication-routing.module";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";

@NgModule({
    imports: [
        CommonModule,
        AuthenticationRoutingModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        TableModule
    ],
    declarations: [
      RoleComponent
    ]
})
export class AuthenticationModule { }

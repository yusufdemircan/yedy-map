import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RoleComponent} from "./components/role/role.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'role', component: RoleComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule { }

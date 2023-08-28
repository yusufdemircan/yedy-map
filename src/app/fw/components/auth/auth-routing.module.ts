import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'roles', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }

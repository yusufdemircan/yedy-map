import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './fw/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import {IsAuthed} from "./auth/guards/authguard";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'member', component: AppLayoutComponent, //canActivate: [IsAuthed],
                children: [
                    { path:'map', loadChildren:()=>import('./konumsal/map/map.module').then(m=>m.MapModule)},
                    { path:'havacilik', loadChildren:()=>import('./konumsal/components/havacilik/havacilik.module').then(m=>m.HavacilikModule)},
                    { path: '', loadChildren: () => import('./fw/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./fw/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./fw/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./fw/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./fw/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./fw/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },

            {
                path: 'authentication', component: AppLayoutComponent, //canActivate: [IsAuthed],
                children: [
                    { path: '', loadChildren: () => import('./auth/authentication.module').then(m => m.AuthenticationModule) },
                ]
            },
            { path: 'auth', loadChildren: () => import('./fw/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./fw/components/landing/landing.module').then(m => m.LandingModule) },
            { path: '',loadChildren: () => import('./fw/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

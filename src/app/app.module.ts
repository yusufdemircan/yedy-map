import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './fw/components/notfound/notfound.component';
import { ProductService } from './fw/service/product.service';
import { CountryService } from './fw/service/country.service';
import { CustomerService } from './fw/service/customer.service';
import { EventService } from './fw/service/event.service';
import { IconService } from './fw/service/icon.service';
import { NodeService } from './fw/service/node.service';
import { PhotoService } from './fw/service/photo.service';
import {AuthService} from "./auth/service/authservice";
import { MenuModule } from 'primeng/menu';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        MenuModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

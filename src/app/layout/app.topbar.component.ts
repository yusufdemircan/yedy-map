import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {AuthService} from "../auth/service/authservice";
import {UserModel} from "../auth/model/user.model";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent  {

    items!: MenuItem[];
    profileItems: MenuItem[];
    user: UserModel | undefined;

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(private auth: AuthService,public layoutService: LayoutService) {
        this.user= this.auth.loadUserFromLocalStorage();
        this.profileItems = [
            {
                label: this.user.name,
                items: [
                    {
                        label: 'Profile',
                        icon: 'pi pi-file-edit',
                        command: () => {

                        }
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.auth.logout();
                        }
                    }
                ]
            }
        ];
    }
}

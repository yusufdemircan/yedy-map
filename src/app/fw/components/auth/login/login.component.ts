import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../auth/service/authservice";
import {Router} from "@angular/router";
import {switchMap} from "rxjs";
import {UserModel} from "../../../../auth/model/user.model";
import {LayoutService} from "../../../../layout/service/app.layout.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {

    valCheck: string[] = ['remember'];

    loginUser: any = {
        username: '',
        password: '',
    };

    constructor(public layoutService: LayoutService,
                private auth: AuthService,
                private router: Router) { }
    ngOnInit(): void {
        console.log("started");
    }
    login() {
        let authFlow = this.auth
            .login(this.loginUser)
            .pipe(switchMap(() => this.auth.profile()));
        authFlow.subscribe({
            next: (user: UserModel) => {
                this.auth.saveUserToLocalStorage(user);
                this.router.navigate(['/member']);
                console.log(user);
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}

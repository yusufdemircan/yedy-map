import { Injectable } from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from '../service/authservice';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(public auth: AuthService, public router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {

        // this will be passed from the route config
        // on the data property
        const expectedRoles = route.data['allowedRoles'];

        if (this.auth.hasAnyRole(expectedRoles)) {
            return true;
        } else {

            this.router.navigate(['/login']);
            return false;
        }
    }
}

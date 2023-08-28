import {inject, Injectable} from '@angular/core';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn
} from '@angular/router';
import {Observable} from "rxjs";
import {AuthService} from "../service/authservice";

@Injectable({
    providedIn: 'root'
})
class AuthGuard {
    constructor(public authService: AuthService, public router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot ):
        boolean {
        let userInfo = this.authService.loadUserFromLocalStorage();
        if (route.data['userType'] === 'guest') {
            return true;
        } else if (route.data['userType'] === 'loged-in') {
            if (userInfo.id > 0) {
                return true;
            }
            this.router.navigate(['/auth/login']);
            return false;
        } else if (route.data['userType'] === 'non-loged-in') {
            if (userInfo.id === 0) {
                return true;
            }
            this.router.navigate(['/auth/login']);
            return false;
        }
        this.router.navigate(['/auth/login']);
        return false;
    }
}
export const IsAuthed:CanActivateFn = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot ):boolean => {
    return inject(AuthGuard).canActivate(route,state);
}


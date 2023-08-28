import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable} from "rxjs";
import {UserModel} from "../model/user.model";

@Injectable()
export class AuthService {
    userProfile: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>({
        email: '',
        username: '',
        id: 0,
        name:'',
        roles:[],
        menus:[]
    });

    constructor(private http: HttpClient) {
    }

    readonly serviceUrl = environment.serviceUrl + '/auth';

    login(user: any) {
        console.log(this.serviceUrl + '/signin');
        return this.http.post(this.serviceUrl + '/signin', user,{
            withCredentials: true,
        });
    }

    profile(): Observable<UserModel> {
        return this.http.get<UserModel>(this.serviceUrl + '/me',{
            withCredentials: true,
        });
    }


    public isLoggedIn() {
        return false;
    }

    refreshCookie() {
        return this.http.get(this.serviceUrl + '/refresh-token', {
            withCredentials: true,
        });
    }

    logout() {
        return this.http.get(this.serviceUrl + '/logout', {withCredentials: true});
    }

    saveUserToLocalStorage(user: UserModel) {
        this.userProfile.next(user);
        localStorage.setItem('user-profile', JSON.stringify(user));
    }

    loadUserFromLocalStorage(): UserModel {
        if (this.userProfile.value.id == 0) {
            let fromLocalStorage = localStorage.getItem('user-profile');
            if (fromLocalStorage) {
                let userInfo = JSON.parse(fromLocalStorage);
                this.userProfile.next(userInfo);
            }
        }
        return this.userProfile.value;
    }


    hasAnyRole(roleList: string[]) {

        return false;
    }

}
